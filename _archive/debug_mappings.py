import sys
import os

# Set up paths
sys.path.append(os.getcwd())

try:
    from app.database import Base, engine
    from app.models.core import User, StartupProfile, InvestorProfile, Pitch, Match, Message, Notification, Investment, Watchlist, PitchComment, Meeting, Task
    from sqlalchemy.orm import configure_mappers
    
    print("Attempting to initialize SQLAlchemy mappings...")
    configure_mappers()
    
    print("\nSUCCESS: Mappings configured successfully.")
except Exception as e:
    print("\nFAILED: Error during mapping configuration:")
    import traceback
    traceback.print_exc()
