from app.database import engine
from sqlalchemy import text
import sys

def fix_schema():
    print("Starting DB Schema Fix...")
    try:
        with engine.connect() as conn:
            print("Checking messages table...")
            # Add attachment_url
            try:
                conn.execute(text("ALTER TABLE messages ADD COLUMN attachment_url VARCHAR"))
                print("Added attachment_url to messages")
            except Exception as e:
                print(f"attachment_url error (likely exists): {e}")
                
            # Add attachment_type
            try:
                conn.execute(text("ALTER TABLE messages ADD COLUMN attachment_type VARCHAR"))
                print("Added attachment_type to messages")
            except Exception as e:
                print(f"attachment_type error (likely exists): {e}")
            
            conn.commit()
            print("Schema fix completed.")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    fix_schema()
