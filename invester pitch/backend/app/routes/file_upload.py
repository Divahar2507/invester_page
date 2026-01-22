from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.core import Pitch, User
from app.dependencies import get_current_user
import os
import shutil
from pathlib import Path
from datetime import datetime

router = APIRouter(prefix="/pitches", tags=["File Upload"])

# Create uploads directory
UPLOAD_DIR = Path("uploads/pitch_documents")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".ppt", ".pptx", ".doc", ".docx", ".xlsx", ".xls"}

def validate_file(file: UploadFile) -> bool:
    """Validate file type and size"""
    # Check extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return True

def save_upload_file(upload_file: UploadFile, destination: Path) -> None:
    """Save uploaded file to destination"""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()

@router.post("/{pitch_id}/upload-pitch-deck")
async def upload_pitch_deck(
    pitch_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload pitch deck (PDF/PPT/DOCX)"""
    validate_file(file)
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    if pitch.startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to upload to this pitch")
    
    from app.utils.storage import upload_file
    url = upload_file(file)
    
    pitch.pitch_deck_url = url
    db.commit()
    
    return {
        "message": "Pitch deck uploaded successfully",
        "filename": file.filename,
        "url": url
    }

@router.post("/{pitch_id}/upload-financial-doc")
async def upload_financial_doc(
    pitch_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload financial projections/documents"""
    validate_file(file)
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    if pitch.startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.utils.storage import upload_file
    url = upload_file(file)
    
    pitch.financial_doc_url = url
    db.commit()
    
    return {
        "message": "Financial document uploaded successfully",
        "filename": file.filename,
        "url": url
    }

@router.post("/{pitch_id}/upload-business-plan")
async def upload_business_plan(
    pitch_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload business plan document"""
    validate_file(file)
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    if pitch.startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.utils.storage import upload_file
    url = upload_file(file)
    
    pitch.business_plan_url = url
    db.commit()
    
    return {
        "message": "Business plan uploaded successfully",
        "filename": file.filename,
        "url": url
    }

@router.get("/download/{filename}")
async def download_document(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    """Download a pitch document (for investors/startups)"""
    
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return file for download
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

@router.get("/{pitch_id}/data-room")
async def get_data_room(
    pitch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all documents for a pitch (Data Room)"""
    
    pitch = db.query(Pitch).filter(Pitch.id == pitch_id).first()
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")
    
    documents = []
    
    # Add pitch deck if exists
    if pitch.pitch_deck_url:
        filename = pitch.pitch_deck_url.split("/")[-1]
        documents.append({
            "type": "Pitch Deck",
            "filename": filename,
            "url": pitch.pitch_deck_url,
            "download_url": f"/pitches/download/{filename}"
        })
    
    # Add financial doc if exists
    if pitch.financial_doc_url:
        filename = pitch.financial_doc_url.split("/")[-1]
        documents.append({
            "type": "Financial Projections",
            "filename": filename,
            "url": pitch.financial_doc_url,
            "download_url": f"/pitches/download/{filename}"
        })
    
    # Add business plan if exists
    if pitch.business_plan_url:
        filename = pitch.business_plan_url.split("/")[-1]
        documents.append({
            "type": "Business Plan",
            "filename": filename,
            "url": pitch.business_plan_url,
            "download_url": f"/pitches/download/{filename}"
        })
    
    return {
        "pitch_id": pitch_id,
        "company_name": pitch.startup.company_name,
        "documents": documents,
        "total_documents": len(documents)
    }
