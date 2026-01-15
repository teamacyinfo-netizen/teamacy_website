from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
import os, bcrypt, jwt, uuid, resend, logging, re
from datetime import datetime, timedelta, timezone

# ---------------- CONFIG ----------------

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

ADMIN_LOGIN_EMAIL = os.environ["ADMIN_LOGIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]   # business inbox
SENDER_EMAIL = os.environ["SENDER_EMAIL"]
RESEND_API_KEY = os.environ["RESEND_API_KEY"]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.environ["JWT_ALGORITHM"]
JWT_EXPIRATION_HOURS = int(os.environ["JWT_EXPIRATION_HOURS"])

resend.api_key = RESEND_API_KEY

# ---------------- DB ----------------

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ---------------- APP ----------------

app = FastAPI()
api = APIRouter(prefix="/api")
security = HTTPBearer()
logging.basicConfig(level=logging.INFO)

# ---------------- MODELS ----------------

class Register(BaseModel):
    name: str
    email: EmailStr
    password: str

class Login(BaseModel):
    email: EmailStr
    password: str

class Contact(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

# ---------------- HELPERS ----------------

def hash_pw(pw):
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def check_pw(pw, h):
    return bcrypt.checkpw(pw.encode(), h.encode())

def make_token(data):
    data["exp"] = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except:
        raise HTTPException(401, "Invalid token")

async def current_user(auth: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(auth.credentials)
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(401, "User not found")
    return user

def clickable(text):
    return re.sub(r"(https?://[^\s]+)", r'<a href="\1">\1</a>', text)

# ---------------- EMAIL ----------------

async def send_email(data: Contact):
    html = f"""
    <h2>New Contact – Teamacy</h2>
    <p><b>Name:</b> {data.name}</p>
    <p><b>Email:</b> {data.email}</p>
    <p><b>Subject:</b> {data.subject}</p>
    <p>{clickable(data.message)}</p>
    """

    resend.Emails.send({
        "from": SENDER_EMAIL,
        "to": [ADMIN_EMAIL],
        "subject": "New Contact – Teamacy",
        "html": html
    })

# ---------------- ROUTES ----------------

@api.get("/")
def root():
    return {"status": "ok"}

@api.post("/auth/register")
async def register(data: Register):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(400, "Email exists")

    user = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password": hash_pw(data.password),
        "role": "user"
    }

    await db.users.insert_one(user)
    token = make_token({"sub": user["id"], "role": "user"})

    return {"access_token": token, "user": user}

@api.post("/auth/login")
async def login(data: Login):
    user = await db.users.find_one({"email": data.email})
    if not user or not check_pw(data.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = make_token({"sub": user["id"], "role": user["role"]})
    return {"access_token": token, "user": user}

# 🔥 MAIN CONTACT ENDPOINT
@api.post("/contact")
async def contact(data: Contact):
    msg = data.dict()
    msg["created_at"] = datetime.now(timezone.utc)
    await db.messages.insert_one(msg)
    await send_email(data)
    return {"status": "ok"}

# 🔐 ADMIN MESSAGES
@api.get("/admin/messages")
async def messages(user=Depends(current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, "Admin only")

    data = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return data

# ---------------- ADMIN CREATE ----------------

@app.on_event("startup")
async def create_admin():
    await db.users.delete_many({"role": "admin"})
    await db.users.insert_one({
        "id": str(uuid.uuid4()),
        "name": "Teamacy Admin",
        "email": ADMIN_LOGIN_EMAIL,
        "password": hash_pw(ADMIN_PASSWORD),
        "role": "admin"
    })

# ---------------- CORS ----------------

app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
