# app.py (full updated version with Firebase Admin + Firestore + Storage integration)
import os
import re
import logging
import base64
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, make_response, send_from_directory
from flask_mail import Mail, Message
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from services.email_service import EmailService

# Firebase Admin imports
import firebase_admin
from firebase_admin import credentials, firestore, storage as fb_storage
from google.cloud import storage as gcs_storage

# ---------- Logging ----------
# Define BASE_DIR early for logging setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, "app.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ingrowwth_backend")

# ---------- Validation Helpers ----------
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------- Load env ----------
load_dotenv()

# ---------- If on Render (or similar) decode base64 service account (if provided) ----------
# This writes a temporary file to /tmp and sets FIREBASE_SERVICE_ACCOUNT env var
sa_b64 = os.getenv("FIREBASE_SA_BASE64")
if sa_b64 and not os.getenv("FIREBASE_SERVICE_ACCOUNT"):
    try:
        sa_path = "/tmp/firebase-service-account.json"
        with open(sa_path, "wb") as f:
            f.write(base64.b64decode(sa_b64))
        try:
            os.chmod(sa_path, 0o600)
        except Exception:
            pass
        os.environ["FIREBASE_SERVICE_ACCOUNT"] = sa_path
        logger.info("Wrote Firebase service account to %s from FIREBASE_SA_BASE64", sa_path)
    except Exception as e:
        logger.exception("Failed to write service account JSON from FIREBASE_SA_BASE64: %s", e)

# ---------- Firebase Admin initialization (best-effort) ----------
FIREBASE_SA = os.getenv("FIREBASE_SERVICE_ACCOUNT")  # path to service account JSON
FIREBASE_BUCKET = os.getenv("FIREBASE_BUCKET")      # e.g. ingrowwth-dashboard.appspot.com
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")  # optional

fs_db = None
admin_bucket = None
gcs_bucket = None

if FIREBASE_SA:
    try:
        sa_cred = credentials.Certificate(FIREBASE_SA)
        firebase_admin.initialize_app(sa_cred, {
            'storageBucket': FIREBASE_BUCKET if FIREBASE_BUCKET else None
        })
        fs_db = firestore.client()
        admin_bucket = fb_storage.bucket()  # firebase-admin storage bucket object
        # create google-cloud-storage client from same service account (useful for signed URLs)
        try:
            gcs_client = gcs_storage.Client.from_service_account_json(FIREBASE_SA)
            gcs_bucket = gcs_client.bucket(FIREBASE_BUCKET) if FIREBASE_BUCKET else None
        except Exception:
            logger.warning("Failed to initialize google-cloud-storage client for signed urls; signed url generation may fail.")
            gcs_bucket = None

        if not FIREBASE_PROJECT_ID:
            try:
                FIREBASE_PROJECT_ID = sa_cred.project_id
            except Exception:
                pass

        logger.info("Firebase Admin initialized for project: %s (bucket=%s)", FIREBASE_PROJECT_ID, FIREBASE_BUCKET)
    except Exception:
        logger.exception("Failed to initialize Firebase Admin SDK. Firestore/storage writes will be disabled.")
        fs_db = None
        admin_bucket = None
        gcs_bucket = None
else:
    logger.warning("No FIREBASE_SERVICE_ACCOUNT set — Firestore/storage will be disabled.")

# ---------- Paths ----------
# BASE_DIR already defined above for logging
# BASE_DIR already defined above for logging
# On Vercel, we must use /tmp for temporary files
if os.environ.get("VERCEL"):
    TEMPLATES_FOLDER = os.path.join(BASE_DIR, "templates")
    RESUMES_FOLDER = "/tmp" 
    ASSETS_FOLDER = os.path.join(BASE_DIR, "assets", "images")
else:
    TEMPLATES_FOLDER = os.path.join(BASE_DIR, "templates")
    RESUMES_FOLDER = os.path.join(BASE_DIR, "resumes")
    ASSETS_FOLDER = os.path.join(BASE_DIR, "assets", "images")

os.makedirs(RESUMES_FOLDER, exist_ok=True)
# map /tmp/templates if needed or just keep standard for read-only templates


# ---------- Flask app ----------
app = Flask(__name__, template_folder=TEMPLATES_FOLDER)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-in-prod")


# ---------- Mail config ----------
app.config["MAIL_SERVER"] = os.getenv("SMTP_SERVER", "smtp.gmail.com")
app.config["MAIL_PORT"] = int(os.getenv("SMTP_PORT", 587) or 587)
app.config["MAIL_USE_TLS"] = True if os.getenv("MAIL_USE_TLS", "true").lower() in ("true", "1", "yes") else False
app.config["MAIL_USE_SSL"] = True if os.getenv("MAIL_USE_SSL", "false").lower() in ("true", "1", "yes") else False
app.config["MAIL_USERNAME"] = os.getenv("SENDER_EMAIL")
app.config["MAIL_PASSWORD"] = os.getenv("SENDER_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER") or os.getenv("SENDER_EMAIL")
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5 MB limit


# instantiate Mail
mail = Mail(app)
email_service = EmailService(mail)

# ---------- Rate Limiter ----------
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"success": False, "message": f"Rate limit exceeded: {e.description}"}), 429

# ---------- CORS ----------
# Build allowed origins from env or use sensible defaults (no '*' since credentials are enabled)
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS")
if CORS_ALLOWED_ORIGINS:
    origins = [o.strip() for o in CORS_ALLOWED_ORIGINS.split(",") if o.strip()]
else:
    origins = [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:3000",
        "http://127.0.0.1:5000",
        "http://localhost:5000",
        # your deployed frontend hosts (ensure exact spelling)
        "https://in-growwth-innovations-uqml.vercel.app",
        "https://www.ingrowwthinnovations.in"
    ]

# initialize CORS for the app (must be done before routes)
CORS(app,
     resources={r"/*": {
         "origins": origins,
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
     }},
     supports_credentials=True)

logger.info("CORS configured. Allowed origins: %s", origins)

# Add after_request hook to ensure preflight & responses include the expected headers for allowed origins
@app.after_request
def add_cors_headers(response):
    try:
        origin = request.headers.get("Origin")
        # Only echo origin when it is explicitly allowed
        if origin and origin in origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-Requested-With,Accept"
            response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    except Exception:
        logger.exception("Error in after_request CORS header injection")
    return response

# ---------- Database ----------
# ---------- Database ----------
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url or "sqlite:///" + os.path.join(BASE_DIR, "site.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Create tables if they don't exist (Runs on Vercel cold start)
with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        logger.warning(f"DB create_all failed (might be build time): {e}")

# ---------- Models ----------
class CareerApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    work_exp = db.Column(db.String(100), nullable=False)
    applying_for = db.Column(db.String(100), nullable=False)
    github_link = db.Column(db.String(255), nullable=False)
    linkedin_link = db.Column(db.String(255), nullable=False)
    intro = db.Column(db.Text, nullable=True)
    resume_filename = db.Column(db.String(255), nullable=False)
    date_submitted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<CareerApplication {self.first_name} {self.last_name} for {self.applying_for}>"

class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date_submitted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<ContactSubmission {self.name} ({self.subject})>"

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="admin")
    full_name = db.Column(db.String(100), nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.String(50), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "full_name": self.full_name,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "created_by": self.created_by
        }

# ---------- Auth Helper ----------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function


# ---------- Routes ----------
@app.route("/")
def home():
    return jsonify({"ok": True, "message": "Backend running"}), 200

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"ok": True, "msg": "pong"}), 200

# ---------- Auth Routes ----------

@app.route("/api/login", methods=["POST", "OPTIONS"])
@limiter.limit("20 per hour", methods=["POST"])
def login():
    if request.method == "OPTIONS":
        return make_response("", 204)
    
    # Rate limiting handled by Flask-Limiter decorator
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    employee = Employee.query.filter_by(username=username).first()

    if employee and employee.check_password(password):
        # Update last login
        employee.last_login = datetime.utcnow()
        db.session.commit()

        session.clear()
        session["user_id"] = employee.id
        session["username"] = employee.username
        session["role"] = employee.role
        logger.info("User %s logged in successfully", username)
        return jsonify({
            "success": True, 
            "message": "Login successful", 
            "user": employee.to_dict()
        }), 200
    
    logger.warning("Failed login attempt for user: %s", username)
    return jsonify({"success": False, "message": "Invalid credentials"}), 401
    
    LOGIN_ATTEMPTS[client_ip]["count"] += 1
    
    if LOGIN_ATTEMPTS[client_ip]["count"] >= MAX_LOGIN_ATTEMPTS:
        LOGIN_ATTEMPTS[client_ip]["blocked_until"] = datetime.utcnow() + LOCKOUT_TIME
        logger.warning("IP %s blocked due to too many failed login attempts", client_ip)
        return jsonify({"success": False, "message": "Too many failed attempts. Try again later."}), 429

    logger.warning("Failed login attempt for user: %s (IP: %s)", username, client_ip)
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route("/api/logout", methods=["POST", "GET"])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out"}), 200

@app.route("/api/me", methods=["GET"])
@login_required
def get_current_user():
    user = Employee.query.get(session["user_id"])
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    return jsonify({"success": True, "user": user.to_dict()}), 200

# ---------- Super Admin Routes (MeetCEO Only) ----------

@app.route("/api/admin/users", methods=["GET"])
@login_required
def list_users():
    # Strict access control
    current_user_name = session.get("username")
    if current_user_name != "MeetCEO":
        return jsonify({"success": False, "message": "Access denied. Super Admin only."}), 403
    
    users = Employee.query.all()
    return jsonify({"success": True, "data": [u.to_dict() for u in users]}), 200

@app.route("/api/admin/users", methods=["POST"])
@login_required
def create_user():
    current_user_name = session.get("username")
    if current_user_name != "MeetCEO":
        return jsonify({"success": False, "message": "Access denied. Super Admin only."}), 403

    data = request.get_json()
    new_username = data.get("username")
    new_password = data.get("password")
    full_name = data.get("full_name")

    if not new_username or not new_password:
        return jsonify({"success": False, "message": "Username and password required"}), 400
    
    if Employee.query.filter_by(username=new_username).first():
        return jsonify({"success": False, "message": "Username already exists"}), 409
    
    try:
        new_emp = Employee(
            username=new_username, 
            full_name=full_name,
            created_by=current_user_name
        )
        new_emp.set_password(new_password)
        db.session.add(new_emp)
        db.session.commit()
        logger.info("Super Admin created user: %s", new_username)
        return jsonify({"success": True, "message": f"User {new_username} created successfully"}), 201
    except Exception:
        db.session.rollback()
        logger.exception("Failed to create user")
        return jsonify({"success": False, "message": "Database error"}), 500

# ---------- Profile Update (All Admins) ----------

@app.route("/api/admin/profile", methods=["PUT"])
@login_required
def update_profile():
    user = Employee.query.get(session["user_id"])
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    data = request.get_json()
    
    # Allow updating full_name (and essentially other non-sensitive fields in future)
    if "full_name" in data:
        user.full_name = data["full_name"]
    
    # Do NOT allow password update via this route for now (separate feature if requested)
    
    try:
        db.session.commit()
        return jsonify({"success": True, "message": "Profile updated", "user": user.to_dict()}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"success": False, "message": "Failed to update profile"}), 500

# ---------- Admin Routes ----------

@app.route("/api/admin/contacts", methods=["GET"])
@login_required
def get_admin_contacts():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("limit", 20, type=int)
        
        pagination = ContactSubmission.query.order_by(ContactSubmission.date_submitted.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        results = []
        for c in pagination.items:
            results.append({
                "id": c.id,
                "name": c.name,
                "email": c.email,
                "subject": c.subject,
                "message": c.message,
                "date_submitted": c.date_submitted.isoformat()
            })
            
        return jsonify({
            "success": True,
            "data": results,
            "meta": {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "pages": pagination.pages
            }
        }), 200
    except Exception:
        logger.exception("Error fetching admin contacts")
        return jsonify({"success": False, "message": "Failed to fetch data"}), 500

@app.route("/api/admin/careers", methods=["GET"])
@login_required
def get_admin_careers():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("limit", 20, type=int)
        
        pagination = CareerApplication.query.order_by(CareerApplication.date_submitted.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        results = []
        for c in pagination.items:
            results.append({
                "id": c.id,
                "first_name": c.first_name,
                "last_name": c.last_name,
                "email": c.email,
                "phone": c.phone,
                "work_exp": c.work_exp,
                "applying_for": c.applying_for,
                "github_link": c.github_link,
                "linkedin_link": c.linkedin_link,
                "resume_filename": c.resume_filename,
                "date_submitted": c.date_submitted.isoformat()
            })
            
        return jsonify({
            "success": True,
            "data": results,
            "meta": {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "pages": pagination.pages
            }
        }), 200
    except Exception:
        logger.exception("Error fetching admin careers")
        return jsonify({"success": False, "message": "Failed to fetch data"}), 500

@app.route("/api/admin/careers/<int:id>", methods=["GET"])
@login_required
def get_admin_career_detail(id):
    try:
        app_item = CareerApplication.query.get_or_404(id)
        return jsonify({
            "success": True,
            "data": {
                "id": app_item.id,
                "first_name": app_item.first_name,
                "last_name": app_item.last_name,
                "email": app_item.email,
                "phone": app_item.phone,
                "work_exp": app_item.work_exp,
                "applying_for": app_item.applying_for,
                "github_link": app_item.github_link,
                "linkedin_link": app_item.linkedin_link,
                "intro": app_item.intro,
                "resume_filename": app_item.resume_filename,
                "date_submitted": app_item.date_submitted.isoformat()
            }
        }), 200
    except Exception:
        return jsonify({"success": False, "message": "Application not found"}), 404

@app.route("/api/admin/resume/<filename>", methods=["GET"])
@login_required
def get_admin_resume(filename):
    try:
        # Security check: ensure strict filename to prevent traversal
        clean_filename = secure_filename(filename)
        if clean_filename != filename:
             logger.warning("Potential path traversal attempt: %s", filename)
             return jsonify({"success": False, "message": "Invalid filename format"}), 400

        if not allowed_file(clean_filename):
             return jsonify({"success": False, "message": "Invalid file extension"}), 400
        
        return send_from_directory(RESUMES_FOLDER, clean_filename)
    except Exception:
         return jsonify({"success": False, "message": "File not found"}), 404



# Allow OPTIONS together with POST so preflight requests don't 404
@app.route("/submit_contact", methods=["POST", "OPTIONS"])
@limiter.limit("5 per minute")
def submit_contact():
    # Handle preflight quickly
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        subject = (data.get("subject") or "").strip()
        message = (data.get("message") or "").strip()

        if not all([name, email, subject, message]):
            return jsonify({"success": False, "message": "All required fields must be filled."}), 400
        
        if not EMAIL_REGEX.match(email):
             return jsonify({"success": False, "message": "Invalid email format."}), 400

        # Deduplication: Check for recent submission (last 5 minutes) from same email with same subject
        cutoff = datetime.utcnow() - timedelta(minutes=5)
        existing = ContactSubmission.query.filter(
            ContactSubmission.email == email,
            ContactSubmission.subject == subject,
            ContactSubmission.date_submitted > cutoff
        ).first()

        if existing:
            return jsonify({"success": False, "message": "You have already submitted a similar inquiry recently."}), 409



        new_submission = ContactSubmission(name=name, email=email, subject=subject, message=message)
        db.session.add(new_submission)
        db.session.commit()
        logger.info("Saved contact submission from %s", email)

        # notify company (best-effort)
        email_service.notify_company_new_contact(new_submission)

        # send HTML reply using template
        client_email_sent = email_service.send_contact_reply_email(email, name, subject, message_text=message, phone=None)

        # --- write contact submission to Firestore (best-effort) ---
        try:
            if fs_db:
                contact_collection = f"artifacts/{FIREBASE_PROJECT_ID}/public/data/contact_submissions"
                fs_db.collection(contact_collection).add({
                    'name': name,
                    'email': email,
                    'subject': subject,
                    'message': message,
                    'timestamp': firestore.SERVER_TIMESTAMP
                })
                logger.info("Wrote contact submission to Firestore (%s)", contact_collection)
        except Exception:
            logger.exception("Failed to write contact submission to Firestore")

        resp_msg = "Your inquiry has been submitted successfully!"
        resp_msg += " You'll receive a confirmation email shortly." if client_email_sent else " (We couldn't send a confirmation email.)"

        return jsonify({"success": True, "message": resp_msg}), 200
    except Exception:
        db.session.rollback()
        logger.exception("Error processing contact request")
        return jsonify({"success": False, "message": "An unexpected error occurred processing your request."}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"success": False, "message": "File too large. Maximum size is 5MB."}), 413


@app.route("/submit_application", methods=["POST", "OPTIONS"])
@limiter.limit("5 per minute")
def submit_application():
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        logger.info("Received application form keys: %s; files: %s", list(request.form.keys()), list(request.files.keys()))
        data = request.form
        resume_file = request.files.get("resume")

        required_fields = ["firstName", "lastName", "email", "phone", "workExp", "applyingFor", "github", "linkedin"]
        required_fields = ["firstName", "lastName", "email", "phone", "workExp", "applyingFor", "github", "linkedin"]
        if not all(field in data and data[field].strip() for field in required_fields):
            return jsonify({"success": False, "message": "All required fields must be filled."}), 400
        
        if not EMAIL_REGEX.match(data["email"].strip()):
            return jsonify({"success": False, "message": "Invalid email format."}), 400

        if not resume_file or resume_file.filename == "":
            return jsonify({"success": False, "message": "Resume file is required."}), 400
        
        if not allowed_file(resume_file.filename):
            return jsonify({"success": False, "message": "Invalid file type. Only PDF, DOC, DOCX allowed."}), 400

        # Deduplication: Check for recent submission (last 24 hours) for same role
        cutoff = datetime.utcnow() - timedelta(hours=24)
        existing = CareerApplication.query.filter(
            CareerApplication.email == data["email"].strip(),
            CareerApplication.applying_for == data["applyingFor"].strip(),
            CareerApplication.date_submitted > cutoff
        ).first()

        if existing:
             return jsonify({"success": False, "message": "You have already applied for this position in the last 24 hours."}), 409


        filename = secure_filename(resume_file.filename)
        unique_filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{filename}"
        resume_path = os.path.join(RESUMES_FOLDER, unique_filename)
        resume_file.save(resume_path)

        new_application = CareerApplication(
            first_name=data["firstName"].strip(),
            last_name=data["lastName"].strip(),
            email=data["email"].strip(),
            phone=data["phone"].strip(),
            work_exp=data["workExp"].strip(),
            applying_for=data["applyingFor"].strip(),
            github_link=data["github"].strip(),
            linkedin_link=data["linkedin"].strip(),
            intro=(data.get("intro") or "").strip(),
            resume_filename=unique_filename,
        )
        db.session.add(new_application)
        db.session.commit()
        logger.info("Saved application for %s (%s)", data["email"], data["applyingFor"])

        # --- upload resume to Firebase Storage (best-effort) and write Firestore doc ---
        resume_url = None
        try:
            # upload file to Firebase Storage and produce a signed URL (v4)
            if admin_bucket and gcs_bucket:
                blob = admin_bucket.blob(f"resumes/{unique_filename}")
                blob.upload_from_filename(resume_path)

                # generate signed URL valid 7 days
                gcs_blob = gcs_bucket.blob(f"resumes/{unique_filename}")
                resume_url = gcs_blob.generate_signed_url(expiration=timedelta(days=7), version="v4")
                logger.info("Resume uploaded to storage; signed url created")
            elif admin_bucket:
                # fallback: upload and (optionally) make public (not recommended)
                blob = admin_bucket.blob(f"resumes/{unique_filename}")
                blob.upload_from_filename(resume_path)
                try:
                    blob.make_public()
                    resume_url = blob.public_url
                    logger.warning("Resume made public (consider using signed URLs instead).")
                except Exception:
                    logger.exception("Could not make resume public")
        except Exception:
            logger.exception("Resume upload to Firebase Storage failed; continuing without resumeUrl")

        # Write career doc to Firestore
        try:
            if fs_db:
                career_collection = f"artifacts/{FIREBASE_PROJECT_ID}/public/data/career_submissions"
                fs_db.collection(career_collection).add({
                    'firstName': new_application.first_name,
                    'lastName': new_application.last_name,
                    'email': new_application.email,
                    'phone': new_application.phone,
                    'workExp': new_application.work_exp,
                    'applyingFor': new_application.applying_for,
                    'github': new_application.github_link,
                    'linkedin': new_application.linkedin_link,
                    'intro': new_application.intro,
                    'resumeUrl': resume_url,
                    'timestamp': firestore.SERVER_TIMESTAMP
                })
                logger.info("Career submission written to Firestore (%s)", career_collection)
        except Exception:
            logger.exception("Failed to write career submission to Firestore")

        # Best-effort email to candidate
        email_service.send_career_reply_email(data["email"], data["firstName"], data["lastName"], data["applyingFor"])

        # Best-effort alert to company
        email_service.notify_company_new_application(new_application)

        return jsonify({"success": True, "status": "ok", "message": "Thank you for your application! We will review it and get back to you soon."}), 200
    except Exception:
        db.session.rollback()
        logger.exception("Application submission failed")
        return jsonify({"success": False, "message": "An unexpected error occurred. Please try again later."}), 500

# ---------- Run ----------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))