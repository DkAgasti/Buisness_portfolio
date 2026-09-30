from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends, UploadFile, File, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
import time
import re
import io
import jwt
import bcrypt
import random
import smtplib
import httpx
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict
from datetime import datetime, timezone, timedelta
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Imported after load_dotenv(): the SDK reads CLOUDINARY_URL from the
# environment at import time, not when .config() is called, so importing it
# any earlier would silently leave api_key/cloud_name unset.
import cloudinary
import cloudinary.uploader
cloudinary.config(secure=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'portfolio-admin-secret-key-2024')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_HOURS = 24

# Create the main app
app = FastAPI(title="Portfolio API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Rate limiting storage
rate_limit_store = {}
RATE_LIMIT_MAX = 10
RATE_LIMIT_WINDOW = 3600

# ============ HELPERS ============
# ============ TEST ============

def get_ip_hash(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()[:16]

def check_rate_limit(ip_hash: str) -> bool:
    now = time.time()
    if ip_hash not in rate_limit_store:
        rate_limit_store[ip_hash] = []
    rate_limit_store[ip_hash] = [t for t in rate_limit_store[ip_hash] if now - t < RATE_LIMIT_WINDOW]
    if len(rate_limit_store[ip_hash]) >= RATE_LIMIT_MAX:
        return False
    rate_limit_store[ip_hash].append(now)
    return True

def strip_html(text: str) -> str:
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def serialize_doc(doc):
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == '_id':
            result['_id'] = str(value)
            result['id'] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        else:
            result[key] = value
    return result

def create_jwt(user_id: str, email: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_jwt(credentials.credentials)
    return payload

# ============ MODELS ============

class LoginRequest(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str = Field(..., min_length=6)

class TestimonialCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    rating: int = Field(..., ge=1, le=5)
    message: str = Field(..., min_length=10, max_length=500)
    avatar: Optional[str] = None
    @field_validator('name')
    @classmethod
    def clean_name(cls, v):
        return strip_html(v.strip())
    @field_validator('message')
    @classmethod
    def clean_message(cls, v):
        return strip_html(v.strip())

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=100)
    project_type: str = Field(default="general", max_length=50)
    message: str = Field(..., min_length=10, max_length=2000)
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v
    @field_validator('name', 'message')
    @classmethod
    def clean_field(cls, v):
        return strip_html(v.strip())

class VisitorTrack(BaseModel):
    page: str = "/"
    referrer: Optional[str] = None
    screen_width: Optional[int] = None
    screen_height: Optional[int] = None

# ============ SEED DEFAULT DATA ============

DEFAULT_SITE_CONFIG = {
    "key": "site_config",
    "name": "Alex Johnson",
    "role": "Full Stack Developer & Backend Engineer",
    "location": "Bhubaneswar, Odisha, India",
    "email": "alex@example.com",
    "whatsapp": "+91 98765 43210",
    "github": "https://github.com/alexjohnson",
    "linkedin": "https://linkedin.com/in/alexjohnson",
    "twitter": "https://twitter.com/alexjohnson",
    "instagram": "",
    "bio": "I'm a passionate Full Stack Developer with expertise in building robust, scalable backend systems and intuitive frontend interfaces. With years of experience working with startups and enterprises, I turn complex business requirements into elegant, performant code.",
    "responseTime": "Usually within 2 hours",
    "stats_projects": 50,
    "stats_clients": 30,
    "stats_experience": 4,
    "stats_satisfaction": 100,
    "about_tech_tags": "React, Next.js, Node.js, MongoDB, Expo, Figma",
    "hero_badge": "Available for new projects",
    "hero_headline": "I turn ideas into digital experiences.",
    "hero_subtext": "Websites, mobile apps and custom digital products \u2014 designed beautifully and built to perform.",
    "hero_trusted_text": "Trusted by 10+ happy clients",
    "cta_eyebrow": "Let's work together",
    "cta_headline": "Have an idea? Let's build something great.",
    "cta_text": "Get in touch and tell me about your project. I'll get back to you as soon as possible.",
    "ai_knowledge_base": "",
    "logo": "",
}

DEFAULT_SKILLS = [
    {"category": "Backend", "icon": "Server", "color": "from-blue-500/20 to-blue-600/10", "items": ["Node.js", "Express.js", "Python", "REST APIs", "GraphQL", "Microservices"], "order": 0},
    {"category": "Database", "icon": "Database", "color": "from-green-500/20 to-green-600/10", "items": ["MongoDB", "PostgreSQL", "Redis", "Mongoose"], "order": 1},
    {"category": "Frontend", "icon": "Monitor", "color": "from-purple-500/20 to-purple-600/10", "items": ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"], "order": 2},
    {"category": "DevOps & Tools", "icon": "Cloud", "color": "from-orange-500/20 to-orange-600/10", "items": ["Docker", "Git", "GitHub", "Vercel", "Linux", "JWT Auth", "WebSockets"], "order": 3},
]

DEFAULT_PROJECTS = [
    {"name": "Enterprise CRM System", "description": "A comprehensive customer relationship management system with role-based access, analytics dashboard, and automated workflows.", "category": "Full Stack", "tech": ["React", "Node.js", "MongoDB", "Redis", "Docker"], "github": "#", "live": "#", "order": 0},
    {"name": "E-Commerce REST API", "description": "Scalable REST API for e-commerce platform with cart management, payment integration, and order tracking.", "category": "Backend", "tech": ["Node.js", "Express", "PostgreSQL", "Stripe", "JWT"], "github": "#", "live": "#", "order": 1},
    {"name": "Sports Betting API", "description": "High-performance betting API handling real-time odds calculation and concurrent transactions.", "category": "API", "tech": ["Python", "FastAPI", "Redis", "WebSocket", "PostgreSQL"], "github": "#", "live": "#", "order": 2},
    {"name": "Real-time Chat App", "description": "Feature-rich messaging platform with real-time communication, file sharing, and group channels.", "category": "Full Stack", "tech": ["React", "Socket.io", "Node.js", "MongoDB", "AWS S3"], "github": "#", "live": "#", "order": 3},
    {"name": "Portfolio Website", "description": "Modern 3D portfolio with smooth animations, dark mode, and dynamic testimonials system.", "category": "Full Stack", "tech": ["Next.js", "Three.js", "Tailwind", "MongoDB", "Framer Motion"], "github": "#", "live": "#", "order": 4},
    {"name": "Redis Caching Service", "description": "Distributed caching microservice improving API response times by 10x with intelligent cache invalidation.", "category": "Backend", "tech": ["Node.js", "Redis", "Docker", "Prometheus", "Grafana"], "github": "#", "live": "#", "order": 5},
]

DEFAULT_SERVICES = [
    {"title": "Backend API Development", "description": "Robust, scalable REST and GraphQL APIs built with modern frameworks and best practices.", "icon": "Server", "order": 0},
    {"title": "Database Design & Optimization", "description": "Efficient database architecture with optimized queries, indexing, and caching strategies.", "icon": "Database", "order": 1},
    {"title": "Full Stack Web Applications", "description": "End-to-end web application development from database design to responsive frontend.", "icon": "Globe", "order": 2},
    {"title": "CRM & Enterprise Systems", "description": "Custom enterprise solutions with role-based access, workflows, and analytics dashboards.", "icon": "Monitor", "order": 3},
    {"title": "Performance Optimization & Caching", "description": "Speed up your applications with Redis caching, CDN setup, and code optimization.", "icon": "Zap", "order": 4},
    {"title": "Technical Consultation & Code Review", "description": "Expert guidance on architecture decisions, code quality, and technology stack selection.", "icon": "Search", "order": 5},
]

DEFAULT_PROCESS = [
    {"title": "Discovery", "description": "Understand goals, users and constraints before writing a line of code.", "icon": "Search", "order": 0},
    {"title": "Planning", "description": "Scope, architecture and a clear delivery roadmap we both agree on.", "icon": "ClipboardList", "order": 1},
    {"title": "UI / UX", "description": "Design flows and interfaces that are intuitive and on-brand.", "icon": "PenTool", "order": 2},
    {"title": "Development", "description": "Ship in focused iterations with clean, reviewed, production-grade code.", "icon": "Code2", "order": 3},
    {"title": "Testing", "description": "Validate behaviour, edge cases and performance before release.", "icon": "FlaskConical", "order": 4},
    {"title": "Deployment", "description": "Automated, reliable releases with monitoring from day one.", "icon": "Rocket", "order": 5},
    {"title": "Support", "description": "Post-launch iteration, maintenance and long-term partnership.", "icon": "Headphones", "order": 6},
]

async def seed_data():
    """Seed default data if collections are empty."""
    # NOTE: Admin users are NOT created here. Login checks the `admins` collection
    # directly — credentials must already exist in the DB. Create/manage admins in
    # the database itself (see create_admin.py helper), never in code.

    # Seed site config
    existing = await db.site_config.find_one({"key": "site_config"})
    if not existing:
        await db.site_config.insert_one(DEFAULT_SITE_CONFIG)
        logging.info("Site config seeded")

    # Seed skills
    count = await db.skills.count_documents({})
    if count == 0:
        await db.skills.insert_many(DEFAULT_SKILLS)
        logging.info("Skills seeded")

    # Seed projects
    count = await db.projects.count_documents({})
    if count == 0:
        await db.projects.insert_many(DEFAULT_PROJECTS)
        logging.info("Projects seeded")

    # Seed services
    count = await db.services.count_documents({})
    if count == 0:
        await db.services.insert_many(DEFAULT_SERVICES)
        logging.info("Services seeded")

    # Seed development process
    count = await db.process.count_documents({})
    if count == 0:
        await db.process.insert_many(DEFAULT_PROCESS)
        logging.info("Process seeded")

# ============ PUBLIC ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Public content endpoints
@api_router.get("/content/site-config")
async def get_site_config():
    doc = await db.site_config.find_one({"key": "site_config"}, {"_id": 0})
    return doc or DEFAULT_SITE_CONFIG

@api_router.get("/content/skills")
async def get_skills():
    docs = await db.skills.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return docs if docs else DEFAULT_SKILLS

@api_router.get("/content/projects")
async def get_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return docs if docs else DEFAULT_PROJECTS

@api_router.get("/content/services")
async def get_services():
    docs = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return docs if docs else DEFAULT_SERVICES

@api_router.get("/content/process")
async def get_process():
    docs = await db.process.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return docs if docs else DEFAULT_PROCESS

# Testimonials
@api_router.post("/testimonials/upload")
async def upload_testimonial_avatar(request: Request, file: UploadFile = File(...)):
    """Public, rate-limited avatar upload for visitors leaving a review."""
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else request.client.host
    ip_hash = get_ip_hash(ip)
    if not check_rate_limit(ip_hash):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="Image too large (max 8 MB)")
    url = _upload_to_cloudinary(contents, file.content_type, folder="portfolio/testimonials")
    return {"success": True, "url": url}

@api_router.post("/testimonials")
async def create_testimonial(testimonial: TestimonialCreate, request: Request):
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else request.client.host
    ip_hash = get_ip_hash(ip)
    if not check_rate_limit(ip_hash):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Maximum 10 reviews per hour.")
    doc = {
        "name": testimonial.name,
        "rating": testimonial.rating,
        "message": testimonial.message,
        "avatar": testimonial.avatar or None,
        "approved": True,
        "created_at": datetime.now(timezone.utc),
        "ip_hash": ip_hash,
    }
    result = await db.testimonials.insert_one(doc)
    doc['_id'] = result.inserted_id
    return {"success": True, "testimonial": serialize_doc(doc)}

@api_router.get("/testimonials")
async def get_testimonials():
    cursor = db.testimonials.find({"approved": True}).sort("created_at", -1)
    testimonials = []
    async for doc in cursor:
        testimonials.append(serialize_doc(doc))
    return {"testimonials": testimonials, "total": len(testimonials)}

# Contact
@api_router.post("/contact")
async def create_contact(contact: ContactCreate, request: Request):
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else request.client.host
    ip_hash = get_ip_hash(ip)
    doc = {"name": contact.name, "email": contact.email, "project_type": contact.project_type, "message": contact.message, "created_at": datetime.now(timezone.utc), "ip_hash": ip_hash, "read": False}
    await db.contact_messages.insert_one(doc)
    return {"success": True, "message": "Message sent successfully!"}

# ============ EMAIL GATE (LEADS) ============

class LeadCreate(BaseModel):
    email: str = Field(..., min_length=5, max_length=100)
    name: Optional[str] = None

    @field_validator('email')
    @classmethod
    def validate_lead_email(cls, v):
        v = v.strip().lower()
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v

@api_router.post("/leads")
async def create_lead(lead: LeadCreate, request: Request):
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else request.client.host
    user_agent = request.headers.get("user-agent", "")

    # Check if email already exists
    existing = await db.leads.find_one({"email": lead.email})
    if existing:
        return {"success": True, "message": "Welcome back!"}

    doc = {
        "email": lead.email,
        "name": lead.name,
        "ip": ip,
        "user_agent": user_agent[:300],
        "created_at": datetime.now(timezone.utc),
    }
    await db.leads.insert_one(doc)
    return {"success": True, "message": "Welcome!"}

# ============ AUTH ROUTES ============

@api_router.post("/auth/login")
async def admin_login(req: LoginRequest):
    admin = await db.admins.find_one({"email": req.email})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not bcrypt.checkpw(req.password.encode(), admin['password'].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_jwt(str(admin['_id']), admin['email'])
    return {"token": token, "email": admin['email']}

@api_router.get("/auth/me")
async def auth_me(admin=Depends(get_current_admin)):
    return {"email": admin['email'], "user_id": admin['user_id']}

# --- Forgot Password ---

def send_otp_email(to_email: str, otp: str) -> bool:
    """Try to send OTP via SMTP. Returns False if SMTP not configured."""
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_email = os.environ.get('SMTP_EMAIL', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    if not smtp_host or not smtp_email or not smtp_password:
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = to_email
        msg['Subject'] = 'Portfolio Admin - Password Reset OTP'
        body = f"""
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:30px;background:#0a0a0a;border-radius:16px;color:#f1f5f9;">
            <h2 style="color:#3b82f6;margin-bottom:10px;">Password Reset</h2>
            <p style="color:#94a3b8;">Your OTP for password reset is:</p>
            <div style="background:#111827;border:1px solid #1e293b;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
                <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#3b82f6;">{otp}</span>
            </div>
            <p style="color:#94a3b8;font-size:13px;">This OTP expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
        """
        msg.attach(MIMEText(body, 'html'))
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        logging.error(f"Failed to send OTP email: {e}")
        return False


@api_router.post("/auth/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    admin = await db.admins.find_one({"email": req.email})
    if not admin:
        raise HTTPException(status_code=404, detail="Email not found")

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Store OTP in DB
    await db.otp_codes.delete_many({"email": req.email})
    await db.otp_codes.insert_one({
        "email": req.email,
        "otp": otp,
        "expires_at": expires_at,
        "used": False,
    })

    # Try to send email
    email_sent = send_otp_email(req.email, otp)

    if email_sent:
        return {"success": True, "message": "OTP sent to your email", "email_sent": True}
    else:
        return {"success": True, "message": "OTP generated (email delivery failed - check SMTP config)", "email_sent": False}


@api_router.post("/auth/verify-otp")
async def verify_otp(req: VerifyOtpRequest):
    record = await db.otp_codes.find_one({
        "email": req.email,
        "otp": req.otp,
        "used": False,
    })
    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    expires = record['expires_at']
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires:
        raise HTTPException(status_code=400, detail="OTP expired")

    return {"success": True, "message": "OTP verified"}


@api_router.post("/auth/reset-password")
async def reset_password(req: ResetPasswordRequest):
    record = await db.otp_codes.find_one({
        "email": req.email,
        "otp": req.otp,
        "used": False,
    })
    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    expires = record['expires_at']
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires:
        raise HTTPException(status_code=400, detail="OTP expired")

    # Update password
    hashed = bcrypt.hashpw(req.new_password.encode(), bcrypt.gensalt())
    await db.admins.update_one(
        {"email": req.email},
        {"$set": {"password": hashed.decode()}}
    )

    # Mark OTP as used
    await db.otp_codes.update_one({"_id": record['_id']}, {"$set": {"used": True}})

    return {"success": True, "message": "Password updated successfully"}

# ============ ADMIN ROUTES ============

# Site Config
@api_router.get("/admin/site-config")
async def admin_get_site_config(admin=Depends(get_current_admin)):
    doc = await db.site_config.find_one({"key": "site_config"})
    return serialize_doc(doc) if doc else DEFAULT_SITE_CONFIG

@api_router.put("/admin/site-config")
async def admin_update_site_config(request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    # Never $set the immutable _id (serialize_doc adds it to the GET response).
    data.pop("_id", None)
    data.pop("id", None)
    data["key"] = "site_config"
    await db.site_config.update_one({"key": "site_config"}, {"$set": data}, upsert=True)
    return {"success": True}

# Skills
@api_router.get("/admin/skills")
async def admin_get_skills(admin=Depends(get_current_admin)):
    docs = await db.skills.find().sort("order", 1).to_list(100)
    return [serialize_doc(d) for d in docs]

@api_router.post("/admin/skills")
async def admin_create_skill(request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    count = await db.skills.count_documents({})
    data["order"] = count
    result = await db.skills.insert_one(data)
    data["_id"] = result.inserted_id
    return {"success": True, "skill": serialize_doc(data)}

@api_router.put("/admin/skills/{skill_id}")
async def admin_update_skill(skill_id: str, request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    data.pop("_id", None)
    data.pop("id", None)
    await db.skills.update_one({"_id": ObjectId(skill_id)}, {"$set": data})
    return {"success": True}

@api_router.delete("/admin/skills/{skill_id}")
async def admin_delete_skill(skill_id: str, admin=Depends(get_current_admin)):
    await db.skills.delete_one({"_id": ObjectId(skill_id)})
    return {"success": True}

# Projects
@api_router.get("/admin/projects")
async def admin_get_projects(admin=Depends(get_current_admin)):
    docs = await db.projects.find().sort("order", 1).to_list(100)
    return [serialize_doc(d) for d in docs]

@api_router.post("/admin/projects")
async def admin_create_project(request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    count = await db.projects.count_documents({})
    data["order"] = count
    result = await db.projects.insert_one(data)
    data["_id"] = result.inserted_id
    return {"success": True, "project": serialize_doc(data)}

@api_router.put("/admin/projects/{proj_id}")
async def admin_update_project(proj_id: str, request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    data.pop("_id", None)
    data.pop("id", None)
    await db.projects.update_one({"_id": ObjectId(proj_id)}, {"$set": data})
    return {"success": True}

@api_router.delete("/admin/projects/{proj_id}")
async def admin_delete_project(proj_id: str, admin=Depends(get_current_admin)):
    await db.projects.delete_one({"_id": ObjectId(proj_id)})
    return {"success": True}

# ============ MEDIA UPLOAD ============
# New uploads go straight to Cloudinary (images + videos). The legacy
# /api/media/{id} route below is kept so files uploaded before this change
# (stored as raw bytes in MongoDB) keep working.
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-matroska"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB, images
MAX_VIDEO_BYTES = 100 * 1024 * 1024  # 100 MB, videos

def _upload_to_cloudinary(contents: bytes, content_type: str, folder: str) -> str:
    result = cloudinary.uploader.upload(
        io.BytesIO(contents),
        resource_type="video" if content_type in ALLOWED_VIDEO_TYPES else "image",
        folder=folder,
    )
    return result["secure_url"]

@api_router.post("/admin/upload")
async def admin_upload_image(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    is_video = file.content_type in ALLOWED_VIDEO_TYPES
    if not is_video and file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image or video files are allowed")
    contents = await file.read()
    limit = MAX_VIDEO_BYTES if is_video else MAX_UPLOAD_BYTES
    if len(contents) > limit:
        raise HTTPException(status_code=400, detail=f"File too large (max {limit // (1024*1024)} MB)")
    url = _upload_to_cloudinary(contents, file.content_type, folder="portfolio")
    return {"success": True, "url": url}

@api_router.get("/media/{media_id}")
async def get_media(media_id: str):
    """Serve a pre-Cloudinary upload straight from MongoDB (public)."""
    try:
        oid = ObjectId(media_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.media.find_one({"_id": oid})
    if not doc or "data" not in doc:
        raise HTTPException(status_code=404, detail="Not found")
    return Response(
        content=bytes(doc["data"]),
        media_type=doc.get("content_type") or "application/octet-stream",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )

# Services
@api_router.get("/admin/services")
async def admin_get_services(admin=Depends(get_current_admin)):
    docs = await db.services.find().sort("order", 1).to_list(100)
    return [serialize_doc(d) for d in docs]

@api_router.post("/admin/services")
async def admin_create_service(request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    count = await db.services.count_documents({})
    data["order"] = count
    result = await db.services.insert_one(data)
    data["_id"] = result.inserted_id
    return {"success": True, "service": serialize_doc(data)}

@api_router.put("/admin/services/{svc_id}")
async def admin_update_service(svc_id: str, request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    data.pop("_id", None)
    data.pop("id", None)
    await db.services.update_one({"_id": ObjectId(svc_id)}, {"$set": data})
    return {"success": True}

@api_router.delete("/admin/services/{svc_id}")
async def admin_delete_service(svc_id: str, admin=Depends(get_current_admin)):
    await db.services.delete_one({"_id": ObjectId(svc_id)})
    return {"success": True}

# Development Process
@api_router.get("/admin/process")
async def admin_get_process(admin=Depends(get_current_admin)):
    docs = await db.process.find().sort("order", 1).to_list(100)
    return [serialize_doc(d) for d in docs]

@api_router.post("/admin/process")
async def admin_create_process(request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    count = await db.process.count_documents({})
    data["order"] = count
    result = await db.process.insert_one(data)
    data["_id"] = result.inserted_id
    return {"success": True, "process": serialize_doc(data)}

@api_router.put("/admin/process/{item_id}")
async def admin_update_process(item_id: str, request: Request, admin=Depends(get_current_admin)):
    data = await request.json()
    data.pop("_id", None)
    data.pop("id", None)
    await db.process.update_one({"_id": ObjectId(item_id)}, {"$set": data})
    return {"success": True}

@api_router.delete("/admin/process/{item_id}")
async def admin_delete_process(item_id: str, admin=Depends(get_current_admin)):
    await db.process.delete_one({"_id": ObjectId(item_id)})
    return {"success": True}

# Testimonials Admin
@api_router.get("/admin/testimonials")
async def admin_get_testimonials(admin=Depends(get_current_admin)):
    docs = await db.testimonials.find().sort("created_at", -1).to_list(500)
    return [serialize_doc(d) for d in docs]

@api_router.delete("/admin/testimonials/{test_id}")
async def admin_delete_testimonial(test_id: str, admin=Depends(get_current_admin)):
    await db.testimonials.delete_one({"_id": ObjectId(test_id)})
    return {"success": True}

# Contact Messages Admin
@api_router.get("/admin/messages")
async def admin_get_messages(admin=Depends(get_current_admin)):
    docs = await db.contact_messages.find().sort("created_at", -1).to_list(500)
    return [serialize_doc(d) for d in docs]

@api_router.delete("/admin/messages/{msg_id}")
async def admin_delete_message(msg_id: str, admin=Depends(get_current_admin)):
    await db.contact_messages.delete_one({"_id": ObjectId(msg_id)})
    return {"success": True}

# Leads Admin
@api_router.get("/admin/leads")
async def admin_get_leads(admin=Depends(get_current_admin)):
    docs = await db.leads.find().sort("created_at", -1).to_list(500)
    return [serialize_doc(d) for d in docs]

@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, admin=Depends(get_current_admin)):
    await db.leads.delete_one({"_id": ObjectId(lead_id)})
    return {"success": True}

# ============ APP SETUP ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    await seed_data()
    logger.info("Database seeded and ready")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
