from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, func
from typing import List, Optional, Dict, Any
import shutil
import os

from app.core.database import get_session
from app.models.schemas import (
    Event, UserRegistration, EventListResponse, User, EventCreate, Follow, 
    ContactForm, TicketClass, TicketClassCreate
)
from app.services.scraper import scrape_events_playwright # Async import
from app.auth import get_current_user
from app.core.email_utils import generate_qr_code, send_event_ticket_email, send_contact_form_email
from sqlmodel import SQLModel
import uuid

router = APIRouter()

# --- 1. SYNC (Admin Only / Debug) ---
@router.post("/sync")
async def sync_events(city: str = "chennai", session: AsyncSession = Depends(get_session)):
    """
    Triggers the Playwright Scraper
    """
    print(f"Starting Sync for {city}...")
    try:
        print("Calling scraper function...")
        events_data = await scrape_events_playwright(city)
        print("Scraper returned.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    saved_count = 0
    for data in events_data:
        # Check duplicates via eventbrite_id
        stmt = select(Event).where(Event.eventbrite_id == data["eventbrite_id"])
        result = await session.execute(stmt)
        existing = result.scalars().first()
        
        if not existing:
            new_event = Event(**data)
            session.add(new_event)
            saved_count += 1
            
    await session.commit()
    return {"status": "success", "added": saved_count, "total_found": len(events_data)}

# --- 1.5 CREATE EVENT (User Generated) ---

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Uploads an image file and returns the static URL.
    """
    try:
        # Create uploads directory if not exists
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Determine file path
        # Use simple filename sanitization or uuid
        filename = f"{uuid.uuid4()}-{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return URL (Assuming localhost for dev, needs env var for prod)
        # Using a relative path that frontend can prepend domain to, or full path if simple
        return {"url": f"http://localhost:8000/uploads/{filename}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.post("/events", response_model=Event)
async def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Allows authenticated users to create a new event with multiple ticket classes.
    """
    # Generate unique internal ID
    custom_id = f"chk-{uuid.uuid4()}"
    
    # Logic to handle Tickets
    total_capacity = 0
    min_price = None
    is_free_event = True
    
    # Process Tickets provided in payload
    if event_data.tickets:
        for t in event_data.tickets:
            total_capacity += t.quantity
            if t.price > 0:
                is_free_event = False
                if min_price is None or t.price < min_price:
                    min_price = t.price
            else:
                 if min_price is None:
                    min_price = 0
    
    # Override top-level fields based on tickets if tickets are present
    final_capacity = total_capacity if event_data.tickets else event_data.capacity
    final_is_free = is_free_event if event_data.tickets else event_data.is_free
    final_price_str = str(min_price) if min_price is not None else event_data.price

    # Create Event Object
    # Extract Pro fields for raw_data storage
    raw_data_dump = {
        "source": "InfiniteBZ", 
        "created_by": current_user.email,
        "organizer_email": event_data.organizer_email,
        "price": final_price_str,
        "capacity": final_capacity,
        "agenda": event_data.agenda,
        "speakers": event_data.speakers,
        "gallery_images": event_data.gallery_images,
        # Store ticket summary in raw_data for quick FE access without joins
        "tickets_meta": [t.dict() for t in event_data.tickets] if event_data.tickets else [] 
    }
    
    new_event = Event(
        **event_data.dict(exclude={"organizer_email", "price", "organizer_name", "agenda", "speakers", "tickets", "gallery_images", "capacity", "is_free"}), 
        eventbrite_id=custom_id,
        url=f"https://infinitebz.com/events/{custom_id}",
        organizer_name=event_data.organizer_name or current_user.full_name or "Community Member",
        organizer_email=current_user.email,
        capacity=final_capacity,
        is_free=final_is_free,
        raw_data=raw_data_dump
    )
    
    session.add(new_event)
    await session.commit()
    await session.refresh(new_event)
    
    # Now create TicketClass records linked to this event
    if event_data.tickets:
        for t in event_data.tickets:
            new_ticket = TicketClass(
                event_id=new_event.id,
                **t.dict()
            )
            session.add(new_ticket)
        await session.commit()
    
    return new_event

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Deletes an event given its ID. Only the creator should be able to delete.
    """
    event = await session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    creator_email = event.raw_data.get("created_by") if event.raw_data else None
    if creator_email != current_user.email:
         raise HTTPException(status_code=403, detail="Not authorized to delete this event")

    # Create manual cascade delete
    # 1. Delete associated tickets
    await session.execute(delete(TicketClass).where(TicketClass.event_id == event_id))
    
    # 2. Delete associated registrations
    await session.execute(delete(UserRegistration).where(UserRegistration.event_id == event_id))
    
    # Actually delete the event
    await session.delete(event)
    await session.commit()

    return {"status": "success", "message": "Event deleted"}

@router.put("/events/{event_id}", response_model=Event)
async def update_event(
    event_id: int,
    event_update: EventCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Updates an event.
    """
    event = await session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    creator_email = event.raw_data.get("created_by") if event.raw_data else None
    if creator_email != current_user.email:
         raise HTTPException(status_code=403, detail="Not authorized to update this event")

    event_dict = event_update.dict(exclude_unset=True)
    for key, value in event_dict.items():
        if key not in ["organizer_email", "price", "organizer_name", "agenda", "speakers"] and hasattr(event, key):
            setattr(event, key, value)
            
    current_raw = event.raw_data.copy() if event.raw_data else {}
    current_raw.update({
        "organizer_email": event_update.organizer_email,
        "price": event_update.price,
        "capacity": event_update.capacity,
        "agenda": event_update.agenda,
        "speakers": event_update.speakers
    })
    event.raw_data = current_raw
    
    if event_update.organizer_name:
        event.organizer_name = event_update.organizer_name
        
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event

@router.get("/events/my-events")
async def get_my_events(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Fetch events created by the current user.
    """
    stmt = select(Event).where(Event.raw_data.contains({"created_by": current_user.email}))
    result = await session.execute(stmt)
    my_events = result.scalars().all()
    
    active_count = len(my_events)
    pending_count = 0 
    total_registrations = 0
    
    events_with_stats = []
    for event in my_events:
        reg_stmt = select(func.count()).select_from(UserRegistration).where(UserRegistration.event_id == event.id)
        reg_res = await session.execute(reg_stmt)
        reg_count = reg_res.scalar()
        total_registrations += reg_count
        
        events_with_stats.append({
            **event.dict(),
            "registration_count": reg_count,
            "status": "Active"
        })
        
    return {
        "stats": {
            "active": active_count,
            "pending": pending_count,
            "total_registrations": total_registrations
        },
        "events": events_with_stats
    }

# --- 2. PUBLIC EVENTS API ---
from sqlalchemy import func, select, or_, desc, cast, Date
from datetime import datetime
@router.get("/events", response_model=EventListResponse)
async def list_events(
    city: str = None,
    category: str = None,
    search: str = None,
    source: str = None,
    is_free: str = None,
    mode: str = None,
    date: str = None,
    page: int = 1,
    limit: int = 10,
    session: AsyncSession = Depends(get_session)
):
    """
    Returns events with optional filtering and pagination.
    """
    offset = (page - 1) * limit
    filter_query = select(Event)
    
    if category and category.lower() != "all":
        keyword_map = {
            "startup": ["startup", "founder", "entrepreneur", "venture", "pitch", "funding", "incubator", "accelerator", "innovation"],
            "business": ["business", "networking", "marketing", "sales", "finance", "leadership", "management", "corporate", "career", "resume", "job", "interview", "workshop", "money", "income", "profit", "ecommerce", "trade", "expo", "exhibition", "organization", "team", "strategy", "communication"],
            "tech": ["tech", "software", "developer", "ai", "data", "code", "programming", "cloud", "security", "web", "digital", "cyber", "electronics", "engineering"],
            "music": ["music", "concert", "live", "dj", "band", "festival", "performance"],
            "sports": ["sport", "cricket", "football", "run", "marathon", "yoga", "fitness", "badminton"],
            "arts": ["art", "design", "creative", "gallery", "painting"]
        }
        search_keywords = keyword_map.get(category.lower(), [category.lower()])
        conditions = []
        for kw in search_keywords:
            kw_term = f"%{kw}%"
            conditions.append(Event.title.ilike(kw_term))
            conditions.append(Event.description.ilike(kw_term))
        filter_query = filter_query.where(or_(*conditions))
        
    if city and city.lower() != "all":
        filter_query = filter_query.where(Event.venue_address.ilike(f"%{city}%"))
        
    if search:
        search_term = f"%{search}%"
        filter_query = filter_query.where(
            or_(
                Event.title.ilike(search_term),
                Event.description.ilike(search_term),
                Event.venue_name.ilike(search_term),
                Event.venue_address.ilike(search_term),
                Event.organizer_name.ilike(search_term)
            )
        )
        
    if source and source.strip().lower() != "all":
        filter_query = filter_query.where(Event.url.ilike(f"%{source.strip()}%"))
        
    if is_free:
        if is_free.lower() == "free":
            filter_query = filter_query.where(Event.is_free == True)
        elif is_free.lower() == "paid":
            filter_query = filter_query.where(Event.is_free == False)
            
    if mode:
        if mode.lower() == "online":
            filter_query = filter_query.where(Event.online_event == True)
        elif mode.lower() == "offline":
            filter_query = filter_query.where(Event.online_event == False)
    
    if date:
        try:
            filter_date = datetime.strptime(date, "%Y-%m-%d").date()
            filter_query = filter_query.where(cast(Event.start_time, Date) == filter_date)
        except ValueError:
            pass
    
    count_stmt = select(func.count()).select_from(filter_query.subquery())
    count_result = await session.execute(count_stmt)
    total_events = count_result.scalar()

    query = filter_query.order_by(Event.url.ilike("%infinitebz.com%").desc(), Event.start_time).offset(offset).limit(limit)
    result = await session.execute(query)
    events = result.scalars().all()
    
    return EventListResponse(
        data=events,
        total=total_events,
        page=page,
        limit=limit
    )

@router.get("/events/{event_id}", response_model=Event)
async def get_event(
    event_id: int,
    session: AsyncSession = Depends(get_session)
):
    event = await session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# --- 4. REGISTRATION & TICKETS ---
from app.models.schemas import UserRegistration, User
from app.services.registrar import auto_register_playwright
from app.auth import get_current_user
from app.services.ticket_service import generate_ticket_pdf

class RegistrationPayload(SQLModel):
    tickets: List[Dict[str, Any]] = []
    attendee: Dict[str, Any] = {}
    total_amount: float = 0.0

@router.post("/events/{event_id}/register")
async def register_for_event(
    event_id: int, 
    payload: RegistrationPayload,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    event = await session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    stmt = select(UserRegistration).where(
        UserRegistration.user_email == current_user.email,
        UserRegistration.event_id == event_id
    )
    result = await session.execute(stmt)
    existing = result.scalars().first()
    if existing:
        return {"status": "ALREADY_REGISTERED", "message": "You are already registered for this event."}

    import time
    confirmation_id = f"SELF-{int(time.time())}"

    new_reg = UserRegistration(
        event_id=event_id,
        user_email=current_user.email,
        confirmation_id=confirmation_id,
        status="SUCCESS",
        raw_data=payload.dict()
    )
    session.add(new_reg)
    await session.commit()
    
    try:
        # 1. Generate PDF
        ticket_path = generate_ticket_pdf(
            registration_id=confirmation_id,
            event_title=event.title,
            user_name=current_user.full_name or current_user.email,
            event_date=event.start_time,
            event_location=event.venue_name or "Online"
        )
        
        # 2. Send Email (BACKGROUND TASK)
        background_tasks.add_task(
            send_ticket_email,
            email=current_user.email,
            name=current_user.full_name or "Attendee",
            event_title=event.title,
            ticket_path=ticket_path
        )
        
        email_status = "QUEUED_IN_BACKGROUND"
        
        email_status = "QUEUED_IN_BACKGROUND"
        
    except Exception as e:
        print(f"Ticket Gen Error: {str(e)}")
        email_status = f"ERROR: {str(e)}"

    return {
        "status": "SUCCESS",
        "message": "Registration verified and saved! Event ticket sent to your email.",
        "confirmation_id": confirmation_id,
        "email_status": email_status
    }

# --- 4.5 CHECK-IN ENDPOINT (Organizer Tool) ---
class CheckInRequest(SQLModel):
    ticket_id: str

@router.post("/events/check-in")
async def check_in_attendee(
    request: CheckInRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    stmt = select(UserRegistration).where(UserRegistration.confirmation_id == request.ticket_id)
    result = await session.execute(stmt)
    registration = result.scalars().first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Invalid Ticket ID. Access Denied.")
    
    if registration.status == "CHECKED_IN":
         raise HTTPException(status_code=400, detail="Ticket already used!")
    
    event = await session.get(Event, registration.event_id)
    
    registration.status = "CHECKED_IN"
    session.add(registration)
    await session.commit()
    
    return {
        "status": "SUCCESS",
        "message": "Check-in Successful!",
        "attendee": registration.user_email,
        "event": event.title if event else "Unknown Event",
        "ticket_id": registration.confirmation_id
    }

# --- 5. USER PROFILE ENDPOINT ---
class UserProfileUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None

class UserProfileResponse(SQLModel):
    id: int
    email: str
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None

@router.get("/user/profile", response_model=UserProfileResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        job_title=current_user.job_title,
        company=current_user.company,
        phone=current_user.phone,
        bio=current_user.bio,
        profile_image=current_user.profile_image
    )

@router.put("/user/profile")
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    user = await session.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    if profile_data.first_name is not None or profile_data.last_name is not None:
        first_name = profile_data.first_name if profile_data.first_name is not None else user.first_name or ""
        last_name = profile_data.last_name if profile_data.last_name is not None else user.last_name or ""
        user.full_name = f"{first_name} {last_name}".strip()

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return {"status": "success", "message": "Profile updated successfully"}

# --- 6. MY REGISTRATIONS ---
@router.get("/user/registrations")
async def get_user_registrations(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    from sqlalchemy.orm import selectinload
    stmt = select(UserRegistration).where(
        UserRegistration.user_email == current_user.email
    ).options(selectinload(UserRegistration.event))
    
    result = await session.execute(stmt)
    registrations = result.scalars().all()
    
    events_list = []
    for reg in registrations:
        if reg.event:
            events_list.append({
                "id": reg.event.id,
                "title": reg.event.title,
                "start_time": reg.event.start_time,
                "end_time": reg.event.end_time,
                "venue_name": reg.event.venue_name,
                "venue_address": reg.event.venue_address,
                "image_url": reg.event.image_url,
                "is_free": reg.event.is_free,
                "online_event": reg.event.online_event,
                "registration_date": reg.registered_at,
                "status": reg.status,
                "confirmation_id": reg.confirmation_id
            })
            
    return {"registrations": events_list}

@router.get("/user/registrations/{event_id}/qr")
async def get_registration_qr(
    event_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    from sqlalchemy.orm import selectinload
    stmt = select(UserRegistration).where(
        UserRegistration.event_id == event_id,
        UserRegistration.user_email == current_user.email,
        UserRegistration.status == "SUCCESS"
    ).options(selectinload(UserRegistration.event))
    
    result = await session.execute(stmt)
    registration = result.scalars().first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
        
    event = registration.event
    qr_data = f"Ticket ID: {registration.confirmation_id}\nEvent: {event.title}\nUser: {current_user.email}\nValid: {event.start_time.strftime('%Y-%m-%d %H:%M %p')}"
    
    qr_base64 = generate_qr_code(qr_data)
    
    return {
        "qr_code": qr_base64,
        "event_title": event.title,
        "ticket_id": registration.confirmation_id
    }

# --- 7. FOLLOWING SYSTEM ---
@router.post("/user/follow/{followed_identifier}")
async def follow_user(
    followed_identifier: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    stmt = select(User).where(or_(User.email == followed_identifier, User.full_name == followed_identifier))
    result = await session.execute(stmt)
    followed_user = result.scalars().first()

    if not followed_user:
        raise HTTPException(status_code=404, detail="User not found")

    if followed_user.email == current_user.email:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    new_follow = Follow(follower_email=current_user.email, followed_email=followed_user.email)
    session.add(new_follow)
    await session.commit()
    return {"status": "success", "message": f"Following {followed_user.full_name or followed_user.email}"}

@router.delete("/user/follow/{followed_identifier}")
async def unfollow_user(
    followed_identifier: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    stmt = select(User).where(or_(User.email == followed_identifier, User.full_name == followed_identifier))
    result = await session.execute(stmt)
    followed_user = result.scalars().first()

    if not followed_user:
        raise HTTPException(status_code=404, detail="User not found")

    stmt = select(Follow).where(Follow.follower_email == current_user.email, Follow.followed_email == followed_user.email)
    result = await session.execute(stmt)
    follow = result.scalars().first()
    
    if follow:
        await session.delete(follow)
        await session.commit()

    return {"status": "success", "message": "Unfollowed"}

@router.get("/user/following")
async def get_following(current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    stmt = select(Follow).where(Follow.follower_email == current_user.email)
    result = await session.execute(stmt)
    follows = result.scalars().all()
    return {"following": [f.followed_email for f in follows]}

# --- 10. CONTACT FORM ---
@router.post("/contact")
async def contact_form(form_data: ContactForm, background_tasks: BackgroundTasks):
    """
    Handle contact form submissions.
    """
    background_tasks.add_task(send_contact_form_email, form_data.dict())
    return {"status": "success", "message": "Message received!"}
