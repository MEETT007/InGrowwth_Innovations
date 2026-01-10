import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "Backend", "site.db")

def migrate():
    if not os.path.exists(DB_PATH):
        print("Database not found, skipping migration (will be created by app).")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_to_add = [
        ("full_name", "VARCHAR(100)"),
        ("last_login", "DATETIME"),
        ("created_by", "VARCHAR(50)")
    ]

    print(f"Migrating database at {DB_PATH}...")

    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE employee ADD COLUMN {col_name} {col_type}")
            print(f"Added column: {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e).lower():
                print(f"Column already exists: {col_name}")
            else:
                print(f"Error adding {col_name}: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
