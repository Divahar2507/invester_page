import httpx
from typing import List, Dict, Any
from ..config import settings
from datetime import datetime, timedelta

async def send_personalized_emails(subject: str, body_template: str, leads: List[Dict[str, Any]]):
    if not settings.BREVO_API_KEY or not settings.BREVO_SENDER_EMAIL:
        raise ValueError("BREVO_API_KEY and BREVO_SENDER_EMAIL must be set in .env")

    sent = 0
    skipped = 0
    errors = []

    async with httpx.AsyncClient() as client:
        for lead in leads:
            email = (lead.get("email") or "").strip()
            if not email:
                skipped += 1
                continue

            company = lead.get("businessName") or "your company"
            first_name = lead.get("firstName") or ""
            last_name = lead.get("lastName") or ""

            # Simple template replacement
            personalized_body = body_template.replace("{{company}}", company)\
                .replace("{{firstName}}", first_name)\
                .replace("{{lastName}}", last_name)
            
            # Using simple regex-like case insensitive replacement would be better but this matches Node roughly
            # Making it robust for Case Insensitive replacement if needed, 
            # but standard python .replace is case sensitive. Node code used regex /gi.
            # strict port: python .replace is case-SENSITIVE. 
            # Given prompt "backend that fully supports existing frontend", functionality matches matters.
            # I will improve to regex replacement for fidelity.
            
            import re
            def ireplace(pattern, sub, text):
                return re.sub(pattern, sub, text, flags=re.IGNORECASE)

            personalized_body = ireplace(r"\{\{\s*company\s*\}\}", company, body_template)
            personalized_body = ireplace(r"\{\{\s*firstName\s*\}\}", first_name, personalized_body)
            personalized_body = ireplace(r"\{\{\s*lastName\s*\}\}", last_name, personalized_body)

            personalized_subject = ireplace(r"\{\{\s*company\s*\}\}", company, subject)

            html_content = f"<html><body>{'<br/>'.join([l.strip() for l in personalized_body.splitlines()])}</body></html>"

            payload = {
                "sender": {"email": settings.BREVO_SENDER_EMAIL, "name": settings.BREVO_SENDER_NAME},
                "to": [{"email": email, "name": f"{first_name} {last_name}".strip() or company}],
                "subject": personalized_subject,
                "htmlContent": html_content
            }

            try:
                resp = await client.post(
                    "https://api.brevo.com/v3/smtp/email",
                    json=payload,
                    headers={
                        "Content-Type": "application/json",
                        "api-key": settings.BREVO_API_KEY
                    }
                )
                resp.raise_for_status()
                sent += 1
            except Exception as e:
                err_msg = str(e)
                if isinstance(e, httpx.HTTPStatusError):
                     err_msg = e.response.text
                print(f"Brevo send error for {email}: {err_msg}")
                errors.append({"email": email, "error": err_msg})
    
    return {"sent": sent, "skipped": skipped, "errors": errors}

async def fetch_brevo_aggregated_stats(days: int = 1):
    now = datetime.now()
    start = now - timedelta(days=days)
    start_date = start.strftime("%Y-%m-%d")
    end_date = now.strftime("%Y-%m-%d")

    default_stats = {
        "range": {"from": start_date, "to": end_date},
        "events": 0,
        "delivered": 0,
        "opens": 0,
        "clicks": 0,
        "bounced": 0,
        "softBounces": 0,
        "hardBounces": 0,
        "raw": {}
    }

    if not settings.BREVO_API_KEY:
         print("BREVO_API_KEY not set, returning empty stats")
         return default_stats
    
    url = "https://api.brevo.com/v3/smtp/statistics/aggregatedReport"
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers={"api-key": settings.BREVO_API_KEY}, params={"startDate": start_date, "endDate": end_date}, timeout=5.0)
            if resp.status_code != 200:
                print(f"Brevo API error: {resp.status_code} - {resp.text}")
                return default_stats
            data = resp.json()
            
        events = data.get("requests", 0)
        delivered = data.get("delivered", 0)
        opens = data.get("uniqueOpens", data.get("opens", 0))
        clicks = data.get("uniqueClicks", data.get("clicks", 0))
        soft_bounces = data.get("softBounces", 0)
        hard_bounces = data.get("hardBounces", 0)
        bounced = soft_bounces + hard_bounces
        
        return {
            "range": data.get("range", {"from": start_date, "to": end_date}),
            "events": events,
            "delivered": delivered,
            "opens": opens,
            "clicks": clicks,
            "bounced": bounced,
            "softBounces": soft_bounces,
            "hardBounces": hard_bounces,
            "raw": data
        }
    except Exception as e:
        print(f"Exception fetching Brevo stats: {e}")
        return default_stats
