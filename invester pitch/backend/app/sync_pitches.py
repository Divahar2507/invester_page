from app.database import SessionLocal
from app.models.core import StartupProfile, Pitch
import random

def sync_profiles_to_pitches():
    db = SessionLocal()
    try:
        profiles = db.query(StartupProfile).all()
        print(f"Found {len(profiles)} startup profiles.")
        
        count = 0
        for sp in profiles:
            # Check if this startup already has a pitch
            existing_pitch = db.query(Pitch).filter(Pitch.startup_id == sp.id).first()
            
            if not existing_pitch:
                print(f"Creating pitch for {sp.company_name}...")
                
                # Derive pitch data from profile
                new_pitch = Pitch(
                    startup_id=sp.id,
                    title=f"{sp.company_name} - Seed Round",
                    description=sp.description or sp.vision or "Innovative startup seeking funding.",
                    industry=sp.industry,
                    funding_stage=sp.funding_stage,
                    amount_seeking=500000, # Default
                    status="active", # IMPORTANT: Must be active to show in feed
                    location=sp.city or "India",
                    pitch_file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    tags=f"{sp.industry}, Tech, Startup",
                    raising_amount="$500,000",
                    equity_percentage="10%",
                    valuation="$5M"
                )
                db.add(new_pitch)
                count += 1
            else:
                # Ensure it is active
                if existing_pitch.status != 'active':
                    existing_pitch.status = 'active'
                    print(f"Activated existing pitch for {sp.company_name}")
                    count += 1
        
        db.commit()
        print(f"✅ Successfully synced {count} pitches from profiles.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    sync_profiles_to_pitches()
