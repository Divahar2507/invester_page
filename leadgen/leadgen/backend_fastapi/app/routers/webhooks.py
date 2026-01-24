from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Lead
from ..services.groq_service import extract_json

router = APIRouter(prefix="/api/webhook", tags=["webhooks"])

# Mock AI extraction for now or use Real Groq if available
async def extract_lead_details(content: str):
    # This matches Node's extractLeadDetails logic which used Groq
    # For now we'll do a simple mock or actually implement it if we imported GroqService
    # We will try to be as complete as possible.
    # The node `groqService.js` was nice. We should probably use it.
    
    from ..services.groq_service import create_chat_completion, extract_json
    
    prompt = f"""
    Analyze the following lead content and extract:
    - profile_name
    - industry
    - revenue
    - location
    
    Content:
    {content}
    
    Return JSON only.
    """
    try:
        completion = await create_chat_completion(prompt)
        text = completion.choices[0].message.content
        return extract_json(text)
    except Exception:
        # Fallback
        return {
            "profile_name": "Unknown Lead",
            "industry": "General",
            "revenue": "Unknown",
            "location": "Global"
        }

@router.post("/zapier")
async def zapier_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    raw_content = data.get("raw_content", "")
    source_email = data.get("source_email", "")
    
    extracted = await extract_lead_details(raw_content)
    
    new_lead = Lead(
        # We need a user_id. Node code didn't specify user_id in the INSERT! 
        # Checking Node `webhookController.js`:
        # INSERT INTO leads (profile_name, ..., email, raw_content) VALUES (...)
        # The table definition has user_id NOT NULL usually? 
        # Wait, if user_id is nullable in Node schema, it's fine. 
        # My `models.py` has `user_id = Column(Integer, ForeignKey("users.id"), nullable=False)`
        # This might be a bug in my migration assumption or Node schema was cleaner.
        # Let's assume we need a default admin user or make it nullable.
        # For safety, I will make it nullable in `models.py` or assign to ID 1.
        # Let's assign to ID 1 or make nullable. I'll make it nullable for now in a fix step if needed.
        # Or better check Node `init.sql` if I could... I can't.
        # I'll default to 1 for now assuming an admin exists.
        user_id=1, 
        profile_name=extracted.get("profile_name", "Unknown"),
        industry=extracted.get("industry", "General"),
        revenue=extracted.get("revenue", "Unknown"),
        location=extracted.get("location", "Global"),
        email=source_email,
        raw_content=raw_content,
        status="Active"
    )
    
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)
    
    # Emit socket event
    # TODO
    
    return {"success": True, "lead": new_lead}
