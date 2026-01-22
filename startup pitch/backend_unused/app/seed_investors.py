from app.database import SessionLocal
from app.models import Investor

def seed_investors():
    db = SessionLocal()
    try:
        investor_data = [
            (1, 'Rohit Sharma', 'VentureRise Capital', 'Angel Investor', 'Chennai', '₹10 Lakhs - ₹50 Lakhs', 'FinTech, EdTech, HealthTech', 'rohit@venturerise.com', 'I invest in early-stage startups with strong founders and scalable ideas.'),
            (2, 'Ananya Menon', 'SparkGrowth Ventures', 'VC', 'Bangalore', '₹50 Lakhs - ₹2 Crore', 'SaaS, AI, CleanTech', 'ananya@sparkgrowth.in', 'Looking for innovative tech startups solving real-world problems.'),
            (3, 'Karthik Raj', 'FutureSeed Network', 'Angel Investor', 'Coimbatore', '₹5 Lakhs - ₹25 Lakhs', 'AgriTech, FoodTech, Logistics', 'karthik@futureseed.in', 'Interested in startups that improve rural and agriculture ecosystems.'),
            (4, 'Priya Kumar', 'BlueOcean Investments', 'Private Equity', 'Hyderabad', '₹1 Crore - ₹5 Crore', 'E-commerce, RetailTech, PropTech', 'priya@blueocean.com', 'I focus on growth-stage businesses with strong revenue potential.'),
            (5, 'Arjun Verma', 'NextWave Angels', 'Angel Investor', 'Chennai', '₹10 Lakhs - ₹1 Crore', 'HealthTech, EdTech, Consumer Apps', 'arjun@nextwaveangels.com', 'I mentor founders and help in scaling product and customer acquisition.'),
            (6, 'Meera Iyer', 'GreenImpact Capital', 'VC', 'Bangalore', '₹30 Lakhs - ₹3 Crore', 'CleanTech, Mobility, Sustainability', 'meera@greenimpact.in', 'Supporting eco-friendly solutions and sustainable innovation startups.'),
            (7, 'Suresh Patel', 'ScaleUp Fund', 'VC', 'Mumbai', '₹50 Lakhs - ₹10 Crore', 'FinTech, SaaS, AI', 'suresh@scaleupfund.in', 'Investing in high-growth startups with strong traction and market fit.'),
            (8, 'Divya Nair', 'WomenLead Angels', 'Angel Investor', 'Kerala', '₹5 Lakhs - ₹40 Lakhs', 'Women-led startups, HealthTech, EdTech', 'divya@womenlead.org', 'Passionate about supporting women founders and impactful startups.'),
            (9, 'Vikram Singh', 'TechBridge Partners', 'Corporate Investor', 'Delhi', '₹25 Lakhs - ₹5 Crore', 'AI, CyberSecurity, SaaS', 'vikram@techbridge.in', 'I invest in tech startups with enterprise-ready products.'),
            (10, 'Lavanya Ramesh', 'StartupBooster Ventures', 'Angel Investor', 'Madurai', '₹5 Lakhs - ₹30 Lakhs', 'AgriTech, EdTech, RetailTech', 'lavanya@startupbooster.in', 'Interested in supporting regional startups with innovative solutions.')
        ]

        count = 0
        for data in investor_data:
            id, name, firm, type, loc, range_val, ind, email, bio = data
            
            existing = db.query(Investor).filter(Investor.id == id).first()
            if not existing:
                inv = Investor(
                    id=id,
                    investor_name=name,
                    firm_name=firm,
                    investor_type=type,
                    location=loc,
                    investment_range=range_val,
                    preferred_industries=ind,
                    email=email,
                    bio=bio
                )
                db.add(inv)
                count += 1
            else:
                # Update existing
                existing.investor_name = name
                existing.firm_name = firm
                existing.investor_type = type
                existing.location = loc
                existing.investment_range = range_val
                existing.preferred_industries = ind
                existing.email = email
                existing.bio = bio
                
        db.commit()
        print(f"✅ Seeding Complete. Added/Updated {count} investors.")

    except Exception as e:
        print(f"❌ Error seeding investors: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_investors()
