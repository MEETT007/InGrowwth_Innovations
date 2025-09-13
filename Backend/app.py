import os
import json
import uuid
import re
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from werkzeug.utils import secure_filename
from email.mime.image import MIMEImage
import logging

# --- Configure logging to see detailed errors ---
logging.basicConfig(level=logging.INFO)
app = Flask(__name__)

# --- Load environment variables ---
load_dotenv()

# IMPORTANT: In a production environment, set specific origins (e.g., your domain: "https://www.yourdomain.com")
CORS(app, origins="*")  # Enables Cross-Origin Resource Sharing

# --- Email configuration from environment variables ---
# NOTE: If you are using Gmail, you MUST use a specific "App Password" instead of your regular
# Google Account password. Google blocks sign-in attempts from applications like this by default.
# Generate an App Password here: https://myaccount.google.com/apppasswords
# If you are still seeing an error, double-check your SENDER_EMAIL and SENDER_PASSWORD in the .env file.
app.config['MAIL_SERVER'] = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('SMTP_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('SENDER_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('SENDER_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('SENDER_EMAIL')

mail = Mail(app)

# --- Folders for data & uploads ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESUMES_FOLDER = os.path.join(BASE_DIR, 'resumes')
APPLICATIONS_DB = os.path.join(BASE_DIR, 'applications.json')
TEMPLATES_FOLDER = os.path.join(BASE_DIR, 'templates')
ASSETS_FOLDER = os.path.join(BASE_DIR, 'assets', 'images')

os.makedirs(RESUMES_FOLDER, exist_ok=True)
os.makedirs(os.path.join(TEMPLATES_FOLDER), exist_ok=True)

# --- Helper functions ---

def save_application_data(data):
    """Appends application data to a JSON file."""
    try:
        if not os.path.exists(APPLICATIONS_DB) or os.path.getsize(APPLICATIONS_DB) == 0:
            applications = []
        else:
            with open(APPLICATIONS_DB, 'r', encoding='utf-8') as f:
                applications = json.load(f)
        
        applications.append(data)
        
        with open(APPLICATIONS_DB, 'w', encoding='utf-8') as f:
            json.dump(applications, f, indent=4)
        return True
    except Exception as e:
        app.logger.error(f"Failed to save application data: {e}")
        return False

def send_career_reply_email(recipient, first_name, last_name, role_name):
    msg = Message(
        subject=f"Application Received for {role_name} - InGrowwth Innovations!",
        recipients=[recipient],
        sender=app.config['MAIL_DEFAULT_SENDER']
    )

    try:
        # Read template
        with open(os.path.join(TEMPLATES_FOLDER, 'reply_email.html'), 'r', encoding='utf-8') as f:
            html_body = f.read()

        # Update to replace all new placeholders
        html_body = html_body.replace('{first_name}', first_name)
        html_body = html_body.replace('{last_name}', last_name)
        html_body = html_body.replace('{role_name}', role_name)

        logo_path = os.path.join(ASSETS_FOLDER, 'company_logo.png')
        if not os.path.exists(logo_path) or os.path.getsize(logo_path) == 0:
            app.logger.error(f"Failed to find or read company logo at path: {logo_path}. Sending email without logo.")
            msg.html = html_body
            mail.send(msg)
            app.logger.info(f"Confirmation email for career sent to {recipient} (no logo).")
            return True

        with open(logo_path, 'rb') as fp:
            img_data = fp.read()

        # Attach image properly for Flask-Mail: filename, content_type, data, headers=dict
        msg.attach(
            filename='company_logo.png',
            content_type='image/png',
            data=img_data,
            headers={
                'Content-ID': '<company_logo>',
                'Content-Disposition': 'inline'
            }
        )

        msg.html = html_body
        mail.send(msg)
        app.logger.info(f"Confirmation email for career sent to {recipient}")
        return True

    except Exception as e:
        app.logger.error(f"Failed to send career email to {recipient}: {e}")
        return False


def send_contact_reply_email(recipient, name, subject):
    """Sends a simple, text-based confirmation email for a contact form submission."""
    msg = Message(
        subject=f"Inquiry Received: {subject} - InGrowwth Innovations",
        recipients=[recipient],
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    
    msg.body = f"""
Dear {name},

Thank you for contacting InGrowwth Innovations! We have successfully received your inquiry regarding: {subject}.

We appreciate you reaching out and will review your message promptly. Our team will contact you very soon, typically within 24-48 business hours.

In the meantime, feel free to explore more about our services on our website.

Best regards,

The Team at InGrowwth Innovations
"""
    try:
        mail.send(msg)
        app.logger.info(f"Confirmation email for contact sent to {recipient}")
        return True
    except Exception as e:
        app.logger.error(f"Failed to send contact email to {recipient}: {e}")
        return False


# --- Routes ---

@app.route('/')
def home():
    return "InGrowwth Innovations Backend is running!"

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        data = request.json

        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        # Basic validation
        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'message': 'All required fields (Name, Email, Subject, Message) are missing.'}), 400

        # Send email to company
        if os.getenv('RECEIVER_EMAIL'):
            msg_to_company = Message(
                subject=f"New Contact Form Submission: {subject}",
                recipients=[os.getenv('RECEIVER_EMAIL')],
                sender=app.config['MAIL_DEFAULT_SENDER']
            )
            msg_to_company.body = f"""
Hello InGrowwth Innovations Team,

You have received a new message from your website contact form:

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message}

---
This message was sent from your website.
"""
            try:
                mail.send(msg_to_company)
                app.logger.info(f"Email sent to company ({os.getenv('RECEIVER_EMAIL')}) from {email}.")
            except Exception as e:
                app.logger.error(f"Failed to send email to company: {e}")
                # We can still send the client confirmation even if this fails
        else:
            app.logger.info("Company email sending skipped: RECEIVER_EMAIL not configured.")
        
        # Send confirmation email to client
        client_email_sent = send_contact_reply_email(email, name, subject)

        # Determine overall success message
        response_message = "Your inquiry has been submitted successfully!"
        if client_email_sent:
            response_message += " You'll receive a confirmation email shortly."
        else:
            response_message += " There was an issue sending a confirmation email, but we received your message and will contact you soon."

        return jsonify({'success': True, 'message': response_message}), 200

    except Exception as e:
        app.logger.error(f"Error processing contact request: {e}")
        return jsonify({'success': False, 'message': f'An unexpected error occurred on the server: {str(e)}'}), 500

@app.route('/submit_application', methods=['POST'])
def submit_application():
    try:
        # Use a dictionary to store form data
        data = request.form.to_dict()
        resume_file = request.files.get('resume')

        # Basic server-side validation
        required_fields = ['firstName', 'lastName', 'email', 'phone', 'workExp', 'applyingFor', 'github', 'linkedin']
        if not all(field in data and data[field].strip() for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'All required fields must be filled.'
            }), 400

        # Validate email and phone formats
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]{2,}$', data['email']):
            return jsonify({'success': False, 'message': 'Invalid email format.'}), 400
        if not re.match(r'^[6-9]\d{9}$', data['phone']):
            return jsonify({'success': False, 'message': 'Invalid phone number format.'}), 400

        # Handle resume file upload
        if not resume_file or resume_file.filename == '':
            return jsonify({'success': False, 'message': 'Resume file is required.'}), 400
        
        filename = secure_filename(resume_file.filename)
        # Create a unique filename to prevent conflicts
        unique_filename = f"{uuid.uuid4()}-{filename}"
        resume_path = os.path.join(RESUMES_FOLDER, unique_filename)
        resume_file.save(resume_path)

        # Prepare data for storage
        application_data = {
            'id': str(uuid.uuid4()),
            'date': datetime.now().isoformat(),
            'firstName': data.get('firstName'),
            'lastName': data.get('lastName'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'workExp': data.get('workExp'),
            'applyingFor': data.get('applyingFor'),
            'github': data.get('github'),
            'linkedin': data.get('linkedin'),
            'intro': data.get('intro'),
            'resume_path': resume_path
        }
        
        # Save to database file
        if not save_application_data(application_data):
            return jsonify({
                'success': False,
                'message': 'Failed to save application. Please try again later.'
            }), 500

        # Send confirmation email (non-blocking) - Updated arguments
        send_career_reply_email(
            application_data['email'],
            application_data['firstName'],
            application_data['lastName'],
            application_data['applyingFor']
        )

        return jsonify({
            'success': True,
            'status': 'ok',
            'message': 'Thank you for your application! We will review it and get back to you soon.'
        }), 200

    except Exception as e:
        app.logger.error(f"Application submission failed: {e}")
        return jsonify({
            'success': False,
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)