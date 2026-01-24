from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional

from ..database import get_db
from ..models import EmailCampaign
from ..schemas import EmailPublish, EmailGenerationRequest
from ..services.email_service import send_personalized_emails, fetch_brevo_aggregated_stats

router = APIRouter(prefix="/api/email", tags=["email"])

@router.post("/publish")
async def publish_campaign(camp_in: EmailPublish, db: AsyncSession = Depends(get_db)):
    # Separate leads
    leads_with_email = [l for l in camp_in.leads if l.get("email")]
    leads_without_email_count = len(camp_in.leads) - len(leads_with_email)
    
    # Send via Brevo
    try:
        brevo_res = await send_personalized_emails(
            subject=camp_in.subject,
            body_template=camp_in.bodyTemplate,
            leads=leads_with_email
        )
    except Exception as e:
        print(f"Error sending Brevo: {e}")
        raise HTTPException(status_code=500, detail="Failed to send emails via Brevo")
        
    sent = brevo_res["sent"]
    skipped_inside = brevo_res["skipped"]
    total_skipped = leads_without_email_count + skipped_inside
    delivered = sent # Approximation as per Node code
    
    # Log to DB
    new_camp = EmailCampaign(
        user_id=camp_in.userId,
        subject=camp_in.subject,
        sent_count=sent,
        skipped_count=total_skipped,
        delivered_count=delivered,
        soft_bounce_count=0,
        hard_bounce_count=0,
        tracked_count=0
    )
    db.add(new_camp)
    await db.commit()
    
    return {
        "sent": sent,
        "skipped": total_skipped,
        "delivered": delivered,
        "softBounces": 0,
        "hardBounces": 0,
        "tracked": 0,
        "errors": brevo_res["errors"]
    }

@router.get("/stats")
async def email_stats(userId: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(
        func.count().label("campaigns"),
        func.sum(EmailCampaign.sent_count).label("sent"),
        func.sum(EmailCampaign.skipped_count).label("skipped"),
        func.sum(EmailCampaign.delivered_count).label("delivered"),
        func.sum(EmailCampaign.soft_bounce_count).label("soft"),
        func.sum(EmailCampaign.hard_bounce_count).label("hard"),
        func.sum(EmailCampaign.tracked_count).label("tracked"),
        func.max(EmailCampaign.created_at).label("last_at")
    )
    
    if userId:
        query = query.where(EmailCampaign.user_id == userId)
        
    result = await db.execute(query)
    row = result.first()
    
    return {
        "totalCampaigns": row.campaigns or 0,
        "totalSent": row.sent or 0,
        "totalSkipped": row.skipped or 0,
        "totalDelivered": row.delivered or 0,
        "totalSoftBounces": row.soft or 0,
        "totalHardBounces": row.hard or 0,
        "totalTracked": row.tracked or 0,
        "lastCampaignAt": row.last_at
    }

@router.get("/brevo-stats")
async def brevo_stats(days: int = 1):
    try:
        stats = await fetch_brevo_aggregated_stats(days=days)
        return stats
    except Exception as e:
        print(f"Brevo stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch Brevo stats")

@router.post("/generate")
async def generate_email(req: EmailGenerationRequest):
    from ..services.groq_service import create_chat_completion, extract_json
    
    prompt = f"""
    You are an expert B2B copywriter.
    
    Context:
    Target Audience: {req.icpName}
    Persona: {req.persona}
    User's Company: {req.companyName}
    
    Value Proposition Framework:
    Pain Point: {req.painPoint}
    Implication: {req.implication or "Negative impact if not solved"}
    Desired Outcome: {req.outcome or "Positive result"}
    
    Task:
    Write a cold outreach email using the provided framework.
    - Subject Line: High open rate, relevant.
    - Body: Conversational, concise (under 120 words). focus on the problem and solution.
    - Use placeholders {{firstName}} and {{company}} for the recipient.
    
    Output Format (JSON):
    {{
        "subject": "Re: ...",
        "body": "Hi {{firstName}}, ..."
    }}
    """
    
    try:
        completion = await create_chat_completion(prompt)
        content = completion.choices[0].message.content
        data = extract_json(content)
        return data
    except Exception as e:
        print(f"Error generating email: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate email content")
