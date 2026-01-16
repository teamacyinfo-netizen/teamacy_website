from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, re
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import resend

# ---------------- LOAD ENV ----------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------------- ENV ----------------
mongo_url = os.environ["MONGO_URL"]
db_name = os.environ["DB_NAME"]

ADMIN_LOGIN_EMAIL = os.environ["ADMIN_LOGIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
SENDER_EMAIL = os.environ["SENDER_EMAIL"]
RESEND_API_KEY = os.environ["RESEND_API_KEY"]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.environ["JWT_ALGORITHM"]
JWT_EXPIRATION_HOURS = int(os.environ["JWT_EXPIRATION_HOURS"])

resend.api_key = RESEND_API_KEY

# ---------------- DB ----------------
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# ---------------- APP ----------------
app = FastAPI()
api = APIRouter(prefix="/api")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("teamacy")

# ---------------- MODELS ----------------

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RegisterModel(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    type: str   # enquiry | feedback

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# ---------------- HELPERS ----------------

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain, hashed):
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    data.update({"exp": expire})
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except:
        raise HTTPException(401, "Invalid token")

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(401, "User not found")
    user.pop("_id", None)
    return User(**user)

async def get_current_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Admin only")
    return user

def make_links_clickable(text: str):
    return re.sub(r'(https?://[^\s]+)', r'<a href="\1">\1</a>', text)

# ---------------- EMAIL ----------------

async def send_email_to_admin(msg: dict):
    html = f"""
    <h2>New {msg['type'].title()} – Teamacy</h2>
    <p><b>Name:</b> {msg['name']}</p>
    <p><b>Email:</b> {msg['email']}</p>
    <p><b>Subject:</b> {msg['subject']}</p>
    <p>{make_links_clickable(msg['message'])}</p>
    """

    resend.Emails.send({
        "from": SENDER_EMAIL,
        "to": [ADMIN_EMAIL],
        "subject": f"New {msg['type'].title()} – Teamacy",
        "html": html
    })

# ---------------- ROUTES ----------------

@api.get("/")
async def root():
    return {"message": "Teamacy API running"}

# REGISTER
@api.post("/auth/register", response_model=TokenResponse)
async def register(data: RegisterModel):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(400, "Email already registered")

    user = User(name=data.name, email=data.email)
    doc = user.model_dump()
    doc["password_hash"] = hash_password(data.password)
    doc["created_at"] = user.created_at.isoformat()

    await db.users.insert_one(doc)

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user=user)

# LOGIN
@api.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user_doc = await db.users.find_one({"email": data.email})
    if not user_doc or not verify_password(data.password, user_doc["password_hash"]):
        raise HTTPException(401, "Invalid credentials")

    user_doc.pop("_id", None)
    user = User(**user_doc)

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user=user)

# 📩 MESSAGE (🔐 LOGIN REQUIRED – FINAL FIX)
@api.post("/messages")
async def send_message(
    data: MessageCreate,
    user: User = Depends(get_current_user)
):
    msg = data.model_dump()
    msg["user_id"] = user.id
    msg["created_at"] = datetime.now(timezone.utc).isoformat()

    await db.messages.insert_one(msg)
    await send_email_to_admin(msg)

    return {"status": "ok"}

# 👨‍💼 ADMIN DASHBOARD
@api.get("/admin/messages")
async def get_messages(admin: User = Depends(get_current_admin)):
    return await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# ---------------- ADMIN AUTO CREATE ----------------

@app.on_event("startup")
async def create_admin():
    await db.users.delete_many({"role": "admin"})

    admin = User(
        name="Teamacy Admin",
        email=ADMIN_LOGIN_EMAIL,
        role="admin"
    )

    doc = admin.model_dump()
    doc["password_hash"] = hash_password(ADMIN_PASSWORD)
    doc["created_at"] = admin.created_at.isoformat()

    await db.users.insert_one(doc)
    logger.info("Admin created successfully")

# ---------------- SETUP ----------------

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
