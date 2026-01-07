from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import re
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Environment variables
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
resend_api_key = os.environ['RESEND_API_KEY']
sender_email = os.environ['SENDER_EMAIL']
admin_email = os.environ['ADMIN_EMAIL']
jwt_secret = os.environ['JWT_SECRET']
jwt_algorithm = os.environ['JWT_ALGORITHM']
jwt_expiration = int(os.environ['JWT_EXPIRATION_HOURS'])

# Configure Resend
resend.api_key = resend_api_key

# MongoDB connection
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class Feedback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=jwt_expiration)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, jwt_secret, algorithm=jwt_algorithm)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=[jwt_algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def make_links_clickable(text: str) -> str:
    """Convert URLs in text to clickable HTML links"""
    url_pattern = r'(https?://[^\s]+)'
    return re.sub(url_pattern, r'<a href="\1" target="_blank" style="color: #7c3aed; text-decoration: underline;">\1</a>', text)

async def send_email_to_admin(subject: str, name: str, email: str, user_subject: str, message: str):
    """Send email notification to admin with clickable links"""
    message_with_links = make_links_clickable(message)
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
            .info-row {{ margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }}
            .label {{ font-weight: bold; color: #7c3aed; }}
            .message-box {{ background: white; padding: 20px; border-left: 4px solid #7c3aed; margin: 20px 0; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Teamacy</h1>
                <p>{subject}</p>
            </div>
            <div class="content">
                <div class="info-row">
                    <span class="label">Name:</span> {name}
                </div>
                <div class="info-row">
                    <span class="label">Email:</span> <a href="mailto:{email}">{email}</a>
                </div>
                <div class="info-row">
                    <span class="label">Subject:</span> {user_subject}
                </div>
                <div class="message-box">
                    <p class="label">Message:</p>
                    <p>{message_with_links}</p>
                </div>
                <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                    Received at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": sender_email,
        "to": [admin_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to admin: {email_response}")
        return email_response
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise

# Routes
@api_router.get("/")
async def root():
    return {"message": "Teamacy API is running"}

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        role="user"
    )
    
    user_dict = user.model_dump()
    user_dict['password_hash'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    
    return TokenResponse(access_token=token, user=user)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(login_data.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**user_doc)
    
    # Create token
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    
    return TokenResponse(access_token=token, user=user)

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(enquiry_data: EnquiryCreate):
    enquiry = Enquiry(**enquiry_data.model_dump())
    
    enquiry_dict = enquiry.model_dump()
    enquiry_dict['created_at'] = enquiry_dict['created_at'].isoformat()
    
    # Store in database
    await db.enquiries.insert_one(enquiry_dict)
    
    # Send email to admin (non-blocking)
    try:
        await send_email_to_admin(
            subject="New Enquiry – Teamacy Website",
            name=enquiry.name,
            email=enquiry.email,
            user_subject=enquiry.subject,
            message=enquiry.message
        )
    except Exception as e:
        logger.error(f"Failed to send enquiry email: {str(e)}")
    
    return enquiry

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries(admin: User = Depends(get_current_admin)):
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for enq in enquiries:
        if isinstance(enq['created_at'], str):
            enq['created_at'] = datetime.fromisoformat(enq['created_at'])
    
    return enquiries

@api_router.post("/feedback", response_model=Feedback)
async def create_feedback(feedback_data: FeedbackCreate):
    feedback = Feedback(**feedback_data.model_dump())
    
    feedback_dict = feedback.model_dump()
    feedback_dict['created_at'] = feedback_dict['created_at'].isoformat()
    
    # Store in database
    await db.feedback.insert_one(feedback_dict)
    
    # Send email to admin (non-blocking)
    try:
        await send_email_to_admin(
            subject="New Feedback / Contact – Teamacy Website",
            name=feedback.name,
            email=feedback.email,
            user_subject=feedback.subject,
            message=feedback.message
        )
    except Exception as e:
        logger.error(f"Failed to send feedback email: {str(e)}")
    
    return feedback

@api_router.get("/feedback", response_model=List[Feedback])
async def get_feedback(admin: User = Depends(get_current_admin)):
    feedback_list = await db.feedback.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for fb in feedback_list:
        if isinstance(fb['created_at'], str):
            fb['created_at'] = datetime.fromisoformat(fb['created_at'])
    
    return feedback_list

# Initialize admin user
@app.on_event("startup")
async def startup_event():
    # Create admin user if not exists
    admin_exists = await db.users.find_one({"email": admin_email}, {"_id": 0})
    if not admin_exists:
        admin_user = User(
            name="Admin",
            email=admin_email,
            role="admin"
        )
        admin_dict = admin_user.model_dump()
        admin_dict['password_hash'] = hash_password("teamacysdg")
        admin_dict['created_at'] = admin_dict['created_at'].isoformat()
        await db.users.insert_one(admin_dict)
        logger.info(f"Admin user created: {admin_email}")

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()