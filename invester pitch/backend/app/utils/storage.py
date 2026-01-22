import os
import shutil
import logging
import uuid
from fastapi import UploadFile

logger = logging.getLogger(__name__)

# Config
USE_S3 = os.getenv("USE_S3", "false").lower() == "true"
UPLOAD_DIR = "uploads"
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# Create local dir if needed
if not USE_S3:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def upload_file(file: UploadFile) -> str:
    """
    Upload file to storage (Local or S3).
    Returns the URL or path to the file.
    """
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    if USE_S3 and S3_BUCKET_NAME and AWS_ACCESS_KEY_ID:
        try:
            import boto3
            s3_client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_REGION
            )
            s3_client.upload_fileobj(
                file.file,
                S3_BUCKET_NAME,
                unique_filename,
                ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
            )
            # Return S3 URL
            return f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
        except Exception as e:
            logger.error(f"S3 Upload failed: {e}")
            raise e
    else:
        # Local Storage
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Determine base URL (hacky for now, better to use environment var)
        # Assuming static mount at /uploads
        return f"/uploads/{unique_filename}"

def delete_file(file_url: str):
    # Logic to delete file if needed
    pass
