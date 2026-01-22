from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from typing import List

router = APIRouter(prefix="/check-images", tags=["Check Images"])

# Directory where images are stored
# Since uvicorn runs from backend/, this path is relative to backend/
IMAGES_DIR = "images_check_api"

@router.get("/", response_model=List[str])
def list_images():
    """
    Get a list of all image filenames in the images_check_api folder.
    """
    if not os.path.exists(IMAGES_DIR):
        return []
    
    # Filter for image extensions if necessary, or just list all files
    valid_extensions = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
    images = [
        f for f in os.listdir(IMAGES_DIR) 
        if os.path.isfile(os.path.join(IMAGES_DIR, f)) and os.path.splitext(f)[1].lower() in valid_extensions
    ]
    return images

@router.get("/{filename}")
def get_image(filename: str):
    """
    Serve the specific image file.
    """
    # Sanitize filename to prevent directory traversal (basic check)
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = os.path.join(IMAGES_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
        
    return FileResponse(file_path)
