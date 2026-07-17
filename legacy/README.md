# InGrowwth Innovations - Corporate Website
![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Python](https://img.shields.io/badge/python-3.9+-blue.svg) ![Flask](https://img.shields.io/badge/flask-2.3+-green.svg)

A professional corporate website for **InGrowwth Innovations**, featuring a high-performance frontend, a secure Flask backend, and a comprehensive Admin Dashboard for business management.

## 🚀 Features

### 🌐 Public Website
*   **Modern Design:** Responsive UI with glassmorphism, animations, and cross-device compatibility.
*   **Services Module:** showcased detailed service offerings.
*   **Contact System:** Real-time inquiries with email notifications, database logging, and auto-replies.
*   **Careers Portal:** Job application system with **Resume Upload** (Firebase Storage/GCP) and duplicate detection.

### 🛠 Admin Dashboard
*   **Role-Based Security:** Secure login with role separation (Super Admin vs. Standard Admin).
*   **User Management:** "MeetCEO" (Super Admin) can provision new admin accounts.
*   **Applicant Tracking:** View, filter, and download resumes for job applicants.
*   **Inquiry Management:** Track and respond to client messages.
*   **Analytics:** Real-time count of total inquiries and applications.

---

## 🏗 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JS | Lightweight, vanilla implementation for max performance. |
| **Backend** | Python (Flask) | RESTful API, Email Services, Auth Logic. |
| **Database** | PostgreSQL (Prod) / SQLite (Dev) | Data persistence for users, contacts, and applications. |
| **Storage** | Firebase Storage / GCP | Secure cloud storage for applicant resumes. |
| **Cloud** | Firebase Admin SDK | Firestore backup and advanced features. |

---

## 📂 Project Structure

```bash
InGrowwth_Innovations/
├── Backend/
│   ├── app.py                 # Core API & Application Logic
│   ├── site.db                # Local Development Database (SQLite)
│   ├── requirements.txt       # Python Dependencies
│   ├── services/              # Email & Notification Services
│   └── templates/             # Email HTML Templates
├── Frontend/
│   ├── index.html             # Landing Page
│   ├── admin-dashboard.html   # Admin Portal
│   ├── assets/                # Static Assets (Images, CSS, JS)
│   └── js/                    # Frontend Logic (API Calls)
├── vercel.json                # Deployment Config
└── README.md                  # Project Documentation
```

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup
1.  **Navigate to Backend:**
    ```bash
    cd Backend
    ```
2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment:**
    Create a `.env` file in the `Backend/` folder with the following:
    ```ini
    SECRET_KEY=dev-secret-key
    SENDER_EMAIL=your-email@gmail.com
    SENDER_PASSWORD=your-app-password
    # Optional: Leave empty for local SQLite
    # DATABASE_URL=
    ```
4.  **Run Server:**
    ```bash
    python app.py
    ```
    Server runs at: `http://localhost:5000`

### 2. Frontend Setup
1.  Open `Frontend/index.html` via Live Server (VS Code) or open directly in browser.
2.  Update `config.js` or API base URLs to point to `http://localhost:5000`.

---

## 🚀 Deployment (Vercel)

This project is optimized for deployment on **Vercel** (both Frontend & Backend).

### Prerequisites
1.  **Vercel Account**
2.  **PostgreSQL Database** (e.g., Vercel Postgres, Neon) - *Required for data persistence on serverless.*

### Steps
1.  Push code to GitHub.
2.  Import project into Vercel.
3.  **Environment Variables:** Add the following in Vercel Settings:
    *   `DATABASE_URL`: Connection string to your Postgres DB.
    *   `FIREBASE_SA_BASE64`: Base64 encoded Firebase Service Account JSON (See `Instruction for Server.txt` for generation).
    *   `SENDER_EMAIL` & `SENDER_PASSWORD`: For email functionality.
4.  Deploy!

For detailed deployment steps, see **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)**.

---

## 🔐 Security
*   **Rate Limiting:** Protects API endpoints against abuse.
*   **Input Sanitization:** Prevents XSS and Injection attacks.
*   **Secure Headers:** CORS configuration restricted to trusted domains.