from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func

from ..models import Lead

async def analyze_icp_with_dataset_and_groq(icp: Any, db: AsyncSession, sort_by: str = "relevance", limit: int = 1000, industry_filter: str = None) -> List[Dict[str, Any]]:
    """
    Analyzes the ICP and finds matching leads from the database.
    This effectively uses the imported CSV data (now in DB) as the dataset.
    """
    
    # Base query for all active leads that are NOT the ICP definition itself
    query = select(Lead).where(
        Lead.status == "Active",
        Lead.id != icp.id  # Don't match self
    )
    
    # 1. Industry Filter (Loose match) - Use logic: UserOverride > MatchAll > ICP Default
    target_industry = industry_filter if industry_filter and industry_filter.lower() != "all" else icp.industry
    
    if target_industry and target_industry.lower() != "all":
        term = f"%{target_industry}%"
        query = query.where(Lead.industry.ilike(term))

    # 2. Location Filter
    if icp.location and icp.location.lower() not in ["global", "all"]:
        loc_term = f"%{icp.location}%"
        query = query.where(Lead.location.ilike(loc_term))
        
    # 3. Revenue Filter
    if icp.revenue and icp.revenue.lower() not in ["all", "any"]:
        query = query.where(Lead.revenue == icp.revenue)

    # Sorting
    if sort_by == "created_desc":
        query = query.order_by(Lead.created_at.desc())
    elif sort_by == "created_asc":
        query = query.order_by(Lead.created_at.asc())
    elif sort_by == "relevance":
        # Sort by Industry match first if possible
        # We can order by length of industry string or exact match? 
        # For now, just order by created_at desc as tie breaker, 
        # but relying on the filter (WHERE clause) to already narrow down "Relevance".
        # If we want to prioritize "Exact Match" vs "Partial", we need CASE.
        # Simple approach: standard DB order is usually fine if filtered.
        # But user explicitly asked to "sort by industry". 
        query = query.order_by(Lead.industry.asc(), Lead.created_at.desc())

    
    query = query.limit(limit) 
    
    result = await db.execute(query)
    matches = result.scalars().all()

    # FALLBACK: If no matches found, return latest/sorted leads from the entire dataset
    if not matches:
        # Fallback query
        fallback_query = select(Lead).where(
            Lead.status == "Active",
            Lead.id != icp.id
        )
        # Apply sorting to fallback as well
        if sort_by == "created_desc":
            fallback_query = fallback_query.order_by(Lead.created_at.desc())
        elif sort_by == "created_asc":
            fallback_query = fallback_query.order_by(Lead.created_at.asc())
        else:
            # Default fallback sort - maybe just latest
            fallback_query = fallback_query.order_by(Lead.created_at.desc())
            
        fallback_query = fallback_query.limit(limit)
        
        res_fallback = await db.execute(fallback_query)
        matches = res_fallback.scalars().all()
    
    # Format for frontend
    formatted_leads = []
    
    for lead in matches:
        # Parse location
        city = ""
        state = ""
        if lead.location and "," in lead.location:
            parts = lead.location.split(",")
            city = parts[0].strip()
            if len(parts) > 1:
                state = parts[1].strip()
        else:
            city = lead.location
            
        formatted_leads.append({
            "businessName": lead.profile_name,
            "email": lead.email,
            "city": city,
            "state": state,
            "salesVolume": lead.revenue,
            "employees": "N/A" 
        })
        
    return formatted_leads

async def ensure_persona_insights_for_icp(icp_id: int, persona: str, db: AsyncSession, force: bool = False):
    from ..models import PersonaInsight, ICP
    from .groq_service import create_chat_completion, extract_json
    from sqlalchemy import select, delete
    
    # 1. Check if insights already exist for this ICP + Persona
    if not force:
        result = await db.execute(
            select(PersonaInsight).where(
                PersonaInsight.icp_id == icp_id,
                PersonaInsight.persona == persona
            ).limit(1)
        )
        if result.scalars().first():
            return  # Already exists
    else:
        # Delete existing insights for this persona+icp
        await db.execute(
            delete(PersonaInsight).where(
                PersonaInsight.icp_id == icp_id,
                PersonaInsight.persona == persona
            )
        )
        await db.commit()
        
    # 2. Get ICP details
    icp_result = await db.execute(select(ICP).where(ICP.id == icp_id))
    icp = icp_result.scalars().first()
    
    if not icp:
        # If no ICP found, we can't generate specific insights. 
        # But to avoid breaking, maybe we try to default or just return?
        # Let's assume the icp_id is valid or we just return.
        return

    # 3. Construct Prompt for Groq
    prompt = f"""
    You are a B2B Go-To-Market Strategist.
    
    Context:
    Target Audience (ICP): {icp.profile_name}
    Industry: {icp.industry}
    Persona: {persona}
    
    Task:
    Generate 5 "Pain Points" and 5 "Desired Outcomes" that are highly relevant to this persona in this industry.
    
    Output Format (JSON only):
    {{
      "pain_points": [
        {{ "title": "...", "description": "...", "relevance_score": 90 }},
        ...
      ],
      "outcomes": [
        {{ "title": "...", "description": "...", "relevance_score": 90 }},
        ...
      ]
    }}
    """
    
    try:
        completion = await create_chat_completion(prompt)
        content = completion.choices[0].message.content
        data = extract_json(content)
        
        examples = []
        
        # Process Pain Points
        for pp in data.get("pain_points", []):
            examples.append(PersonaInsight(
                icp_id=icp_id,
                industry=icp.industry,
                persona=persona,
                title=pp.get("title", "Unknown Pain"),
                description=pp.get("description", ""),
                relevance_score=pp.get("relevance_score", 80),
                type="pain_point",
                is_custom=False,
                status="unassigned"
            ))
            
        # Process Outcomes
        for out in data.get("outcomes", []):
             examples.append(PersonaInsight(
                icp_id=icp_id,
                industry=icp.industry,
                persona=persona,
                title=out.get("title", "Unknown Outcome"),
                description=out.get("description", ""),
                relevance_score=out.get("relevance_score", 80),
                type="outcome",
                is_custom=False,
                status="unassigned"
            ))
            
        db.add_all(examples)
        await db.commit()
        
    except Exception as e:
        print(f"Error generating insights with Groq: {e}")
        # Optionally log or re-raise

