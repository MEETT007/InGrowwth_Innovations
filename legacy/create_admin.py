import sys
import os

# Add Backend directory to sys.path so imports within app.py work
sys.path.append(os.path.join(os.path.dirname(__file__), 'Backend'))

from Backend.app import app, db, Employee
from werkzeug.security import generate_password_hash
from werkzeug.security import generate_password_hash

def create_admin(username, password):
    with app.app_context():
        # Check if user exists
        existing = Employee.query.filter_by(username=username).first()
        if existing:
            print(f"User '{username}' already exists.")
            return

        # Create new user
        hashed_pw = generate_password_hash(password)
        new_admin = Employee(username=username, password_hash=hashed_pw)
        db.session.add(new_admin)
        db.session.commit()
        print(f"Successfully created admin user: {username}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <username> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    create_admin(username, password)
