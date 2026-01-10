import os
import logging
from flask import render_template, current_app
from flask_mail import Message

from threading import Thread

logger = logging.getLogger(__name__)

def _send_async_email(app, mail, msg):
    with app.app_context():
        try:
            mail.send(msg)
            # logger.info("Email sent successfully in background thread.")
        except Exception as e:
            logger.error(f"Failed to send email in background thread: {e}")

class EmailService:
    def __init__(self, mail):
        self.mail = mail

    def send_career_reply_email(self, recipient, first_name, last_name, role_name):
        try:
            template_context = {"first_name": first_name, "last_name": last_name, "role_name": role_name}
            html_body = render_template("reply_email.html", **template_context)
            
            sender = current_app.config.get("MAIL_DEFAULT_SENDER") or current_app.config.get("MAIL_USERNAME")
            msg = Message(
                subject=f"Application Received for {role_name} - InGrowwth Innovations!",
                recipients=[recipient],
                sender=sender,
            )
            msg.html = html_body

            # Attach logo if available
            # Note: We assume ASSETS_FOLDER path is available via config or we reconstruct it
            # To be safe, let's look it up from app config or relative path
            assets_folder = current_app.config.get("ASSETS_FOLDER") or os.path.join(current_app.root_path, '..', 'Frontend', 'assets')

            logo_path = os.path.join(assets_folder, "company_logo.png")
            if os.path.isfile(logo_path):
                try:
                    with open(logo_path, "rb") as f:
                        data = f.read()
                    msg.attach(
                        filename="company_logo.png",
                        content_type="image/png",
                        data=data,
                        disposition="inline",
                        headers={"Content-ID": "<company_logo>"},
                    )
                except Exception as e:
                    logger.warning("Could not attach logo inline: %s", e)
            
            # Send asynchronously
            app = current_app._get_current_object()
            thr = Thread(target=_send_async_email, args=[app, self.mail, msg])
            thr.start()
            
            logger.info("Confirmation email queued for %s", recipient)
            return True
        except Exception:
            logger.exception("Failed to send career confirmation email")
            return False

    def send_contact_reply_email(self, recipient, name, subject, message_text=None, phone=None):
        try:
            template_context = {
                "name": name,
                "email": recipient,
                "phone": phone or "",
                "subject": subject,
                "message": message_text or ""
            }

            html_body = None
            try:
                html_body = render_template("contact_reply.html", **template_context)
            except Exception as e:
                logger.warning("Failed to render contact_reply.html; falling back to plain text. Error: %s", e)

            sender = current_app.config.get("MAIL_DEFAULT_SENDER") or current_app.config.get("MAIL_USERNAME")
            msg = Message(
                subject=f"Inquiry Received: {subject} - InGrowwth Innovations",
                recipients=[recipient],
                sender=sender,
            )

            if html_body:
                msg.html = html_body
            else:
                msg.body = f"Dear {name},\n\nThank you for contacting us about: {subject}.\n\n{message_text or ''}\n\nBest,\nTeam"

            # Attach logo
            assets_folder = current_app.config.get("ASSETS_FOLDER") or os.path.join(current_app.root_path, '..', 'Frontend', 'assets')
            logo_path = os.path.join(assets_folder, "company_logo.png")
            if os.path.isfile(logo_path):
                try:
                    with open(logo_path, "rb") as f:
                        logo_data = f.read()
                    msg.attach(
                        filename="company_logo.png",
                        content_type="image/png",
                        data=logo_data,
                        disposition="inline",
                        headers={"Content-ID": "<company_logo>"},
                    )
                except Exception as e:
                    logger.warning("Could not attach logo inline to contact reply: %s", e)

            # Send asynchronously
            app = current_app._get_current_object()
            thr = Thread(target=_send_async_email, args=[app, self.mail, msg])
            thr.start()

            logger.info("Contact auto-reply queued for %s", recipient)
            return True
        except Exception:
            logger.exception("Failed to send contact reply email")
            return False

    def notify_company_new_application(self, app_record):
        try:
            receivers_env = os.getenv("RECEIVER_EMAIL")
            if not receivers_env:
                logger.warning("No RECEIVER_EMAIL configured. Skipping company alert.")
                return False

            recipients = [r.strip() for r in receivers_env.split(",") if r.strip()]
            sender = current_app.config.get("MAIL_DEFAULT_SENDER") or current_app.config.get("MAIL_USERNAME")
            
            subject = f"New Job Application: {app_record.first_name} {app_record.last_name} - {app_record.applying_for}"
            
            body = f"""
New Career Application Received!

Candidate: {app_record.first_name} {app_record.last_name}
Position: {app_record.applying_for}
Email: {app_record.email}
Phone: {app_record.phone}
Work Experience: {app_record.work_exp}

LinkedIn: {app_record.linkedin_link}
GitHub: {app_record.github_link}

Resume Filename: {app_record.resume_filename}
Submitted At: {app_record.date_submitted.strftime('%Y-%m-%d %H:%M:%S')}

Log in to the Admin Dashboard to view full details and download the resume.
"""
            msg = Message(subject=subject, recipients=recipients, sender=sender, body=body)
            # Send asynchronously
            app = current_app._get_current_object()
            thr = Thread(target=_send_async_email, args=[app, self.mail, msg])
            thr.start()

            logger.info("Company alert queued for new application from %s", app_record.email)
            return True
        except Exception:
            logger.exception("Failed to alert company about new application")
            return False

    def notify_company_new_contact(self, contact_record):
        try:
            receivers_env = os.getenv("RECEIVER_EMAIL")
            if not receivers_env:
                logger.warning("No RECEIVER_EMAIL configured. Skipping company alert.")
                return False

            recipients = [r.strip() for r in receivers_env.split(",") if r.strip()]
            sender = current_app.config.get("MAIL_DEFAULT_SENDER") or current_app.config.get("MAIL_USERNAME")
            
            subject = f"New Contact Inquiry: {contact_record.subject}"
            
            body = f"""
New Contact Form Submission!

Name: {contact_record.name}
Email: {contact_record.email}
Subject: {contact_record.subject}
Message:
{contact_record.message}

Timestamp: {contact_record.date_submitted.strftime('%Y-%m-%d %H:%M:%S')}

Log in to the Admin Dashboard to reply.
"""
            msg = Message(subject=subject, recipients=recipients, sender=sender, body=body)
            # Send asynchronously
            app = current_app._get_current_object()
            thr = Thread(target=_send_async_email, args=[app, self.mail, msg])
            thr.start()

            logger.info("Company alert queued for contact from %s", contact_record.email)
            return True
        except Exception:
            logger.exception("Failed to alert company about contact submission")
            return False
