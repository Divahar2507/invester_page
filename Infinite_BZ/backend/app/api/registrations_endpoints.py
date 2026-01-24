
# --- 10. MY REGISTRATIONS ENDPOINTS ---

@router.get("/user/registrations")
async def get_user_registrations(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get all events the user has registered for.
    """
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
                "status": reg.status, # SUCCESS, PENDING, etc.
                "confirmation_id": reg.confirmation_id,
                "ticket_type": (
                    ", ".join([f"{t.get('selectedQty')} x {t.get('name')}" for t in reg.raw_data.get("tickets", []) if t.get("selectedQty", 0) > 0])
                    if reg.raw_data and "tickets" in reg.raw_data else "Standard Entry"
                )
            })
            
    return {"registrations": events_list}

@router.get("/user/registrations/{event_id}/qr")
async def get_registration_qr(
    event_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get QR code for a specific registration.
    """
    stmt = select(UserRegistration).where(
        UserRegistration.event_id == event_id,
        UserRegistration.user_email == current_user.email,
        UserRegistration.status == "SUCCESS"
    ).options(selectinload(UserRegistration.event))
    
    result = await session.execute(stmt)
    registration = result.scalars().first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
        
    # Generate QR Data
    event = registration.event
    qr_data = f"Ticket ID: {registration.confirmation_id}\nEvent: {event.title}\nUser: {current_user.email}\nValid: {event.start_time}"
    
    # Generate QR Image (using existing utility if available or inline)
    # We imported generate_qr_code from app.core.email_utils earlier
    qr_base64 = generate_qr_code(qr_data)
    
    return {
        "qr_code": qr_base64,
        "event_title": event.title,
        "ticket_id": registration.confirmation_id
    }
