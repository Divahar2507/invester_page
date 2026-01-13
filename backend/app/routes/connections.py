from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.database import Base # Removed get_db from here
from app.dependencies import get_db # Added get_db from dependencies
from app.models.core import Connection, User, StartupProfile, InvestorProfile
from app.schemas import ConnectionCreate, ConnectionResponse, ConnectionRespond, ConnectionStatus
from app.routes.auth import get_current_user

router = APIRouter(prefix="/connections", tags=["connections"])

@router.post("/request", response_model=ConnectionResponse)
def send_connection_request(request: ConnectionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    receiver = db.query(User).filter(User.id == request.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
        
    if receiver.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")

    # Check existing
    existing = db.query(Connection).filter(
        or_(
            and_(Connection.requester_id == current_user.id, Connection.receiver_id == receiver.id),
            and_(Connection.requester_id == receiver.id, Connection.receiver_id == current_user.id)
        )
    ).first()
    
    if existing:
        # If rejected, maybe allow re-request? For now, let's treat it as a final state or require distinct logic.
        # User requirement: "Rejected -> message NOT allowed".
        return {
            "id": existing.id,
            "requester_id": existing.requester_id,
            "receiver_id": existing.receiver_id,
            "status": existing.status,
            "created_at": existing.created_at
        }

    new_connection = Connection(
        requester_id=current_user.id,
        receiver_id=receiver.id,
        status="pending"
    )
    db.add(new_connection)
    db.commit()
    db.refresh(new_connection)
    return new_connection

@router.get("/requests", response_model=List[ConnectionResponse])
def get_incoming_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    requests = db.query(Connection).filter(
        Connection.receiver_id == current_user.id,
        Connection.status == "pending"
    ).all()
    
    # Enrich with details
    results = []
    for req in requests:
        # Get requester name
        requester = db.query(User).filter(User.id == req.requester_id).first()
        name = "Unknown"
        if requester.role == "startup":
            # Using uselist=False in relationship, so it is a single object
            if requester.startup_profile:
                name = requester.startup_profile.company_name
        elif requester.role == "investor":
            if requester.investor_profile:
                name = requester.investor_profile.firm_name
        
        # Manually construct generic dict to fit response model
        req_item = {
            "id": req.id,
            "requester_id": req.requester_id,
            "receiver_id": req.receiver_id,
            "status": req.status,
            "created_at": req.created_at,
            "requester_name": name,
            "requester_role": requester.role
        }
        results.append(req_item)
        
    return results

@router.post("/respond", response_model=ConnectionResponse)
def respond_to_request(response: ConnectionRespond, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    connection = db.query(Connection).filter(Connection.id == response.connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
        
    if connection.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to respond to this request")
        
    if connection.status != "pending":
        raise HTTPException(status_code=400, detail=f"Connection is already {connection.status}")
    
    # The action is "accept" or "reject" (mapped to 'accepted' | 'rejected')
    new_status = "accepted" if response.action == "accept" else "rejected"
    connection.status = new_status
    db.commit()
    db.refresh(connection)
    
    return connection

@router.get("/my", response_model=List[ConnectionResponse])
def get_my_connections(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    connections = db.query(Connection).filter(
        or_(
            Connection.requester_id == current_user.id,
            Connection.receiver_id == current_user.id
        )
    ).all()
    
    results = []
    for conn in connections:
        # Determine the "other" user
        other_id = conn.receiver_id if conn.requester_id == current_user.id else conn.requester_id
        other_user = db.query(User).filter(User.id == other_id).first()
        
        name = "Unknown"
        if other_user:
            if other_user.role == "startup" and other_user.startup_profile:
                name = other_user.startup_profile.company_name
            elif other_user.role == "investor" and other_user.investor_profile:
                name = other_user.investor_profile.firm_name
            else:
                name = other_user.email.split('@')[0]
        
        # Construct response
        # Note: ConnectionResponse expects requester_role but we serve a generic "my connection".
        # Let's map "requester_name" to the OTHER person's name for UI convenience,
        # or better, use a specific schema? 
        # For simplicity, reusing ConnectionResponse but treating 'requester_name' as 'partner_name'.
        
        results.append({
            "id": conn.id,
            "requester_id": conn.requester_id,
            "receiver_id": conn.receiver_id,
            "status": conn.status,
            "created_at": conn.created_at,
            "requester_name": name, # Overloading this field for UI display of "Contact Name"
            "requester_role": other_user.role if other_user else "unknown"
        })
        
    return results

@router.get("/check", response_model=ConnectionStatus)
def check_connection_status(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    connection = db.query(Connection).filter(
        or_(
            and_(Connection.requester_id == current_user.id, Connection.receiver_id == user_id),
            and_(Connection.requester_id == user_id, Connection.receiver_id == current_user.id)
        )
    ).first()
    
    if not connection:
        return {"status": "not_connected", "request_sent_by_me": False}
        
    request_sent_by_me = (connection.requester_id == current_user.id)
    return {
        "status": connection.status,
        "request_sent_by_me": request_sent_by_me,
        "connection_id": connection.id
    }
