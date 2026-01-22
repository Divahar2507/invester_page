from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.database import SessionLocal
from app.dependencies import get_db
from app.utils.security import SECRET_KEY, ALGORITHM
from app.models.core import User, Message, Connection
from datetime import datetime
import json

router = APIRouter(tags=["Chat WebSocket"])

class ConnectionManager:
    def __init__(self):
        # active_connections: user_id -> WebSocket
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"User {user_id} connected via WebSocket")

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected")

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

manager = ConnectionManager()

async def get_current_user_ws(
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None
    
    user = db.query(User).filter(User.email == email).first()
    return user

@router.websocket("/ws/chat")
async def websocket_endpoint(
    websocket: WebSocket, 
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    # Verify User
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    except Exception as e:
        print(f"WS Auth Error: {e}")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Connect
    await manager.connect(user.id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            """
            Expected format:
            {
                "receiver_id": 123,
                "content": "Hello",
                "temp_id": "optional-client-side-id-for-optimistic-ui"
            }
            """
            receiver_id = data.get("receiver_id")
            content = data.get("content")
            
            if not receiver_id or not content:
                continue
                
            # Save to DB
            new_message = Message(
                sender_id=user.id,
                receiver_id=receiver_id,
                content=content,
                timestamp=datetime.now()
            )
            # We need a fresh session or ensure commited
            # Warning: Using the 'db' dependency inside the loop might be tricky if it closes? 
            # Actually, Depends(get_db) creates a session that lasts for the scope of the request/handler.
            # But in a long running WS, we might want to commit repeatedly.
            try:
                db.add(new_message)
                
                # Create Notification
                from app.models.core import Notification
                sender_name = user.email.split('@')[0]
                if user.role == "startup" and user.startup_profile:
                    sender_name = user.startup_profile.company_name
                elif user.role == "investor" and user.investor_profile:
                    sender_name = user.investor_profile.firm_name
                    
                new_notif = Notification(
                    user_id=receiver_id,
                    title=f"New message from {sender_name}",
                    description=content[:50] + "..." if len(content) > 50 else content,
                    type="message",
                    related_id=new_message.id
                )
                db.add(new_notif)

                db.commit()
                db.refresh(new_message)
            except Exception as e:
                print(f"DB Error saving message: {e}")
                db.rollback()
                continue
            
            # Prepare Payload
            # We need to construct the message in the format frontend expects
            
            # Resolve sender name logic (similar to messaging.py)
            sender_name = user.email.split('@')[0]
            if user.role == "startup" and user.startup_profile:
                sender_name = user.startup_profile.company_name
            elif user.role == "investor" and user.investor_profile:
                sender_name = user.investor_profile.firm_name
                
            msg_payload = {
                "id": new_message.id,
                "sender_id": user.id,
                "receiver_id": receiver_id,
                "content": content,
                "timestamp": new_message.timestamp.isoformat(),
                "sender_name": sender_name,
                "type": "new_message",
                "temp_id": data.get("temp_id")
            }

            # Send Notification Update to Receiver
            await manager.send_personal_message({"type": "notification_update"}, receiver_id)

            # Send to Receiver
            await manager.send_personal_message(msg_payload, receiver_id)
            
            # Send Ack/Echo back to Sender (so they know it's saved/delivered)
            # Frontend might deduce this from their own optimistic UI, but nice to assume confirmation
            await manager.send_personal_message(msg_payload, user.id)

    except WebSocketDisconnect:
        manager.disconnect(user.id)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        manager.disconnect(user.id)
