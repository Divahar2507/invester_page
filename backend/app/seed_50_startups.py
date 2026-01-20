from app.database import SessionLocal
from app.models.core import User, StartupProfile, Pitch
from app.utils.security import get_password_hash
import datetime

def seed_custom_startups():
    db = SessionLocal()
    try:
        startup_data = [
            (1, 'AgroNext', 'Karthik', 'AgriTech', 'Coimbatore', '₹25 Lakhs', 'MVP', 'Smart irrigation + crop prediction using AI'),
            (2, 'MediConnect', 'Priya', 'HealthTech', 'Chennai', '₹50 Lakhs', 'Seed', 'Online doctor consultation + medicine delivery'),
            (3, 'EduSpark', 'Arun', 'EdTech', 'Madurai', '₹20 Lakhs', 'Idea', 'Skill-based learning platform for college students'),
            (4, 'GreenWatt', 'Nithya', 'CleanTech', 'Bangalore', '₹1 Crore', 'Prototype', 'Affordable solar power storage solution'),
            (5, 'FinBuddy', 'Ravi', 'FinTech', 'Hyderabad', '₹75 Lakhs', 'Seed', 'Micro-investing app for beginners'),
            (6, 'FoodFleet', 'Suresh', 'FoodTech', 'Chennai', '₹60 Lakhs', 'MVP', 'Cloud kitchen delivery network'),
            (7, 'ShopSmart', 'Meena', 'E-commerce', 'Salem', '₹30 Lakhs', 'Idea', 'Local product marketplace for small sellers'),
            (8, 'SafeRide', 'Vignesh', 'Mobility', 'Trichy', '₹80 Lakhs', 'Prototype', 'Women safety cab booking with live monitoring'),
            (9, 'Farm2Home', 'Deepa', 'AgriTech', 'Erode', '₹40 Lakhs', 'Seed', 'Direct farmer-to-customer organic delivery'),
            (10, 'SkillForge', 'Manoj', 'EdTech', 'Bangalore', '₹1.2 Crore', 'Growth', 'Job-ready training + placement support'),
            (11, 'AutoCareX', 'Sanjay', 'AutoTech', 'Chennai', '₹55 Lakhs', 'MVP', 'Doorstep car servicing subscription'),
            (12, 'PetNest', 'Divya', 'PetCare', 'Coimbatore', '₹15 Lakhs', 'Idea', 'Pet grooming + vet booking app'),
            (13, 'WasteWise', 'Kavin', 'CleanTech', 'Bangalore', '₹90 Lakhs', 'Prototype', 'Smart waste collection and recycling management'),
            (14, 'LoanLink', 'Sathya', 'FinTech', 'Chennai', '₹70 Lakhs', 'Seed', 'Instant loans for MSMEs using digital scoring'),
            (15, 'EventHive', 'Harish', 'EventTech', 'Madurai', '₹25 Lakhs', 'MVP', 'Event booking + ticketing platform'),
            (16, 'HomeEase', 'Anitha', 'HomeServices', 'Trichy', '₹45 Lakhs', 'Seed', 'Home services like electrician, plumber, cleaning'),
            (17, 'DocuSafe', 'Prakash', 'LegalTech', 'Chennai', '₹35 Lakhs', 'Prototype', 'Digital document storage + e-sign solutions'),
            (18, 'QuickKart', 'Naveen', 'Logistics', 'Bangalore', '₹1 Crore', 'Growth', 'Hyperlocal delivery in 30 minutes'),
            (19, 'TravelMint', 'Keerthi', 'TravelTech', 'Ooty', '₹30 Lakhs', 'MVP', 'Budget travel packages + local guides'),
            (20, 'RetailPulse', 'Akash', 'RetailTech', 'Chennai', '₹65 Lakhs', 'Seed', 'POS + inventory management for small stores'),
            (21, 'FitTrack', 'Sandhya', 'HealthTech', 'Bangalore', '₹50 Lakhs', 'MVP', 'Personalized fitness plan with AI coach'),
            (22, 'PaySwift', 'Gokul', 'FinTech', 'Hyderabad', '₹1.5 Crore', 'Growth', 'Fast payment gateway for SMEs'),
            (23, 'GreenPlate', 'Ranjith', 'FoodTech', 'Chennai', '₹40 Lakhs', 'Prototype', 'Healthy meal subscription service'),
            (24, 'TutorMate', 'Lakshmi', 'EdTech', 'Madurai', '₹20 Lakhs', 'Idea', 'Online tutoring for school kids'),
            (25, 'SmartBuild', 'Suresh Kumar', 'ConstructionTech', 'Coimbatore', '₹85 Lakhs', 'Seed', 'Construction planning & costing software'),
            (26, 'CityFix', 'Bala', 'GovTech', 'Chennai', '₹60 Lakhs', 'MVP', 'Civic complaint reporting + tracking app'),
            (27, 'WaterGuard', 'Preethi', 'CleanTech', 'Trichy', '₹55 Lakhs', 'Prototype', 'Water quality testing device + mobile app'),
            (28, 'EduVault', 'Hari', 'EdTech', 'Bangalore', '₹1 Crore', 'Seed', 'Digital library and exam preparation app'),
            (29, 'FarmLens', 'Karthika', 'AgriTech', 'Erode', '₹30 Lakhs', 'MVP', 'Crop disease detection using phone camera'),
            (30, 'MarketGuru', 'Madhan', 'MarTech', 'Chennai', '₹45 Lakhs', 'Seed', 'Marketing automation for small businesses'),
            (31, 'JobBridge', 'Rekha', 'HRTech', 'Bangalore', '₹70 Lakhs', 'MVP', 'Hiring platform for freshers & internships'),
            (32, 'SafeHome', 'Girish', 'SecurityTech', 'Chennai', '₹90 Lakhs', 'Prototype', 'Smart home security system with app'),
            (33, 'CloudInvoice', 'Saravanan', 'FinTech', 'Coimbatore', '₹35 Lakhs', 'MVP', 'GST billing and invoicing software'),
            (34, 'RecyclePay', 'Anjali', 'CleanTech', 'Bangalore', '₹50 Lakhs', 'Seed', 'Rewards for recycling through partner network'),
            (35, 'CarePlus', 'Vishnu', 'HealthTech', 'Chennai', '₹65 Lakhs', 'Seed', 'Home nursing + elderly care service'),
            (36, 'FleetOps', 'Sathish', 'Logistics', 'Hyderabad', '₹1 Crore', 'Growth', 'Fleet tracking + fuel monitoring solution'),
            (37, 'SmartRent', 'Divakar', 'PropTech', 'Bangalore', '₹80 Lakhs', 'MVP', 'Rental management for owners & tenants'),
            (38, 'BioFresh', 'Nandhini', 'FoodTech', 'Trichy', '₹25 Lakhs', 'Prototype', 'Organic food preservation system'),
            (39, 'StudySphere', 'Ramesh', 'EdTech', 'Chennai', '₹55 Lakhs', 'Seed', 'Online learning + mock tests + analytics'),
            (40, 'AIShopper', 'Kiran', 'E-commerce', 'Bangalore', '₹1.2 Crore', 'Growth', 'AI-based product recommendation engine'),
            (41, 'MedTrack', 'Shalini', 'HealthTech', 'Madurai', '₹40 Lakhs', 'MVP', 'Patient record management for small clinics'),
            (42, 'FarmPay', 'Suresh B', 'FinTech', 'Erode', '₹60 Lakhs', 'Seed', 'Payments & loans for farmers'),
            (43, 'EcoMove', 'Aravind', 'Mobility', 'Chennai', '₹90 Lakhs', 'Prototype', 'Electric scooter rental and charging points'),
            (44, 'SkillSprint', 'Malar', 'EdTech', 'Coimbatore', '₹30 Lakhs', 'MVP', 'Fast upskilling courses with projects'),
            (45, 'HospEase', 'Ragul', 'HealthTech', 'Bangalore', '₹1 Crore', 'Seed', 'Hospital appointment scheduling + queue system'),
            (46, 'CloudKitchenPro', 'Sangeetha', 'FoodTech', 'Chennai', '₹75 Lakhs', 'Growth', 'Restaurant management for cloud kitchens'),
            (47, 'GreenCart', 'Nithish', 'E-commerce', 'Trichy', '₹35 Lakhs', 'MVP', 'Eco-friendly product marketplace'),
            (48, 'BuildMate', 'Rithika', 'ConstructionTech', 'Bangalore', '₹80 Lakhs', 'Seed', 'Construction worker hiring + task tracking'),
            (49, 'RetailBoost', 'Arun Kumar', 'RetailTech', 'Chennai', '₹50 Lakhs', 'Prototype', 'AI sales prediction for shops'),
            (50, 'AgroChain', 'Praveen', 'AgriTech', 'Coimbatore', '₹1 Crore', 'Growth', 'Supply chain for farmers to export markets')
        ]

        count = 0
        for data in startup_data:
            idx, company, founder, industry, location, funding, stage, pitch_text = data
            
            # Create Unique Email
            email = f"founder{idx}_{company.lower().replace(' ', '')}@example.com"
            
            # 1. Check/Create User
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    password_hash=get_password_hash("password"),
                    role="startup"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                
            # 2. Check/Create Profile
            profile = db.query(StartupProfile).filter(StartupProfile.user_id == user.id).first()
            if not profile:
                profile = StartupProfile(
                    user_id=user.id,
                    company_name=company,
                    founder_name=founder,
                    industry=industry,
                    funding_stage=stage,
                    description=pitch_text,
                    city=location,
                    vision="To revolutionize the industry.",
                    problem="Current solutions are inefficient.",
                    solution=pitch_text
                )
                db.add(profile)
                db.commit()
                db.refresh(profile)
                
            # 3. Check/Create Pitch
            pitch = db.query(Pitch).filter(Pitch.startup_id == profile.id).first()
            if not pitch:
                
                # Convert funding string to integer roughly (e.g. ₹25 Lakhs -> 2500000)
                amount_int = 0
                if "Crore" in funding:
                    val = float(funding.replace("₹", "").replace("Crore", "").strip())
                    amount_int = int(val * 10000000)
                elif "Lakhs" in funding:
                    val = float(funding.replace("₹", "").replace("Lakhs", "").strip())
                    amount_int = int(val * 100000)
                
                pitch = Pitch(
                    startup_id=profile.id,
                    title=f"{company} - {stage} Round",
                    description=pitch_text,
                    industry=industry,
                    funding_stage=stage,
                    amount_seeking=amount_int,
                    raising_amount=funding,
                    status="active",
                    location=location,
                    tags=f"{industry}, {stage}, {location}",
                    pitch_file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                )
                db.add(pitch)
                count += 1
        
        db.commit()
        print(f"✅ Successfully seeded {count} new startups from list.")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_custom_startups()
