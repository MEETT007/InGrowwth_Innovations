import os
import sqlite3
import datetime
import glob
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("db_backup")

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "site.db")
BACKUP_DIR = os.path.join(BASE_DIR, "backups")

# Configuration
RETENTION_COUNT = 7

def perform_backup():
    """
    Safely backs up the SQLite database using the SQLite Online Backup API.
    """
    if not os.path.exists(DB_PATH):
        logger.error(f"Database file not found at {DB_PATH}")
        return False

    # Ensure backup directory exists
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        logger.info(f"Created backup directory at {BACKUP_DIR}")

    # Generate timestamped filename
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d")
    backup_filename = f"site_{timestamp}.db"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)

    try:
        # Use sqlite3 backup API for atomic, safe backup of live DB
        source_conn = sqlite3.connect(DB_PATH)
        dest_conn = sqlite3.connect(backup_path)
        
        with source_conn, dest_conn:
            source_conn.backup(dest_conn)
        
        source_conn.close()
        dest_conn.close()
        
        logger.info(f"Successfully backed up database to {backup_path}")
        return True
    except Exception as e:
        logger.exception(f"Backup failed: {e}")
        return False

def rotate_backups():
    """
    Retains only the latest RETENTION_COUNT backups and deletes the rest.
    """
    try:
        # Find all backup files matching the pattern
        backup_pattern = os.path.join(BACKUP_DIR, "site_*.db")
        backups = glob.glob(backup_pattern)
        
        # Sort by modification time (newest first)
        backups.sort(key=os.path.getmtime, reverse=True)
        
        if len(backups) <= RETENTION_COUNT:
            logger.info("No rotation needed (count within limits).")
            return

        # Identify files to delete
        files_to_delete = backups[RETENTION_COUNT:]
        
        for file_path in files_to_delete:
            os.remove(file_path)
            logger.info(f"Deleted old backup: {os.path.basename(file_path)}")
            
        logger.info(f"Cleanup complete. Retained latest {RETENTION_COUNT} backups.")
        
    except Exception as e:
        logger.exception(f"Rotation failed: {e}")

if __name__ == "__main__":
    logger.info("Starting database backup process...")
    if perform_backup():
        rotate_backups()
    logger.info("Process finished.")
