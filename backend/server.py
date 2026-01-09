from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, asyncio, re
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import resend

# Load .env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ENV
mongo_url = os.environ["MONGO_URL"]
db_name = os.environ["DB_NAME"]
resend_api_key = os.environ["RESEND_API_KEY"]
sender_email = os.environ["SENDER_EMAIL"]
admin_email = os.environ["ADMIN_EMAIL"]
admin_password = os.environ["ADMIN_PASSWORD"]
jwt_secret = os.environ["JWT_SECRET"]
jwt_algorithm = os.environ["JWT_ALGORITHM"]
jwt_expiration = int(os.environ["JWT_EXPIRATION_HOURS"])

resend.api_key = resend_api_key

# DB
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# App
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- MODELS ----------------

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

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# ---------------- HELPERS ----------------

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain, hashed):
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_access_token(data):
    expire = datetime.now(timezone.utc) + timedelta(hours=jwt_expiration)
    data.update({"exp": expire})
    return jwt.encode(data, jwt_secret, algorithm=jwt_algorithm)

def decode_token(token):
    try:
        return jwt.decode(token, jwt_secret, algorithms=[jwt_algorithm])
    except:
        raise HTTPException(401, "Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return User(**user)

async def get_current_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Admin only")
    return user

def make_links_clickable(text):
    return re.sub(r'(https?://[^\s]+)', r'<a href="\1">\1</a>', text)

async def send_email_to_admin(subject, name, email, user_subject, message):
    html = f"""
    <h2>{subject}</h2>
    <p><b>Name:</b> {name}</p>
    <p><b>Email:</b> {email}</p>
    <p><b>Subject:</b> {user_subject}</p>
    <p>{make_links_clickable(message)}</p>
    """

    try:
        resend.Emails.send({
            "from": sender_email,
            "to": [admin_email],
            "subject": subject,
            "html": html
        })
        logger.info("Email sent to admin")
    except Exception as e:
        logger.error(f"Email failed: {e}")

# ---------------- ROUTES ----------------

@api_router.get("/")
async def root():
    return {"message": "Teamacy API running"}

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserRegister):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(400, "Email exists")

    user = User(name=data.name, email=data.email)
    doc = user.model_dump()
    doc["password_hash"] = hash_password(data.password)
    doc["created_at"] = doc["created_at"].isoformat()
    await db.users.insert_one(doc)

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user=user)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user_doc = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user_doc or not verify_password(data.password, user_doc["password_hash"]):
        raise HTTPException(401, "Invalid credentials")

    user = User(**user_doc)
    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user=user)

@api_router.post("/feedback")
async def feedback(data: FeedbackCreate):
    await db.feedback.insert_one(data.model_dump())
    await send_email_to_admin("New Feedback – Teamacy", data.name, data.email, data.subject, data.message)
    return {"status": "ok"}

@api_router.post("/enquiries")
async def enquiry(data: EnquiryCreate):
    await db.enquiries.insert_one(data.model_dump())
    await send_email_to_admin("New Enquiry – Teamacy", data.name, data.email, data.subject, data.message)
    return {"status": "ok"}

# ---------------- ADMIN ----------------

@app.on_event("startup")
async def create_admin():
    await db.users.delete_many({"role": "admin"})
    admin = User(name="Teamacy Admin", email=admin_email, role="admin")
    doc = admin.model_dump()
    doc["password_hash"] = hash_password(admin_password)
    doc["created_at"] = doc["created_at"].isoformat()
    await db.users.insert_one(doc)
    logger.info("Admin created")

# ---------------- SETUP ----------------

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
