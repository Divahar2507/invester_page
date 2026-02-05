from app.db.session import SessionLocal, Base, engine
from app.models.business_logic import (
    ResearchProject, Mentor, Seminar, TechPark, Pitch,
    Startup, Competitor, TargetCustomer, MarketSize, ProblemSolutionFit, ResearchScore
)
from app.models.user import User
from sqlalchemy.orm import Session

def seed_database():
    # Create tables even if they exist (drop first for schema updates in dev)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    print("Seeding database...")

    # Research Projects
    research_data = [
        {
            'title': 'Neural Plasticity in AI Cognitive Models',
            'institution': 'Stanford University',
            'location': 'Stanford, CA',
            'description': 'Investigating how deep learning architectures can mimic human brain plasticity for more efficient training and reduced forgetting.',
            'field': 'AI & ML',
            'status': 'Active',
            'stage': 'Phase II',
            'progress': 65,
            'image': '/images/neural_plasticity.png'
        },
        {
            'title': 'Quantum Cryptography Networking',
            'institution': 'OXFORD UNIVERSITY',
            'location': 'Oxford, UK',
            'description': 'Implementing unbreakable communication channels using quantum key distribution over existing fiber optic infrastructure.',
            'field': 'Quantum',
            'status': 'Active',
            'stage': 'Phase I - Design',
            'progress': 15,
            'image': '/images/innovation_center.png'
        },
        {
            'title': 'Autonomous Medical Diagnostic Robotics',
            'institution': 'ETH ZURICH',
            'location': 'Zurich, CH',
            'description': 'Developing miniature surgical robots capable of autonomous navigation within soft tissues for targeted drug delivery.',
            'field': 'Robotics',
            'status': 'New',
            'stage': 'Conceptual',
            'progress': 5,
            'image': '/images/neural_plasticity.png'
        }
    ]
    
    for item in research_data:
        if not db.query(ResearchProject).filter(ResearchProject.title == item['title']).first():
            db.add(ResearchProject(**item))

    # Mentors
    mentor_data = [
        {
            'name': 'Sarah Chen',
            'role': 'Managing Partner',
            'company': 'InnoSphere VC',
            'expertise': ['Venture Capital', 'Scaling', 'AI & ML'],
            'rating': 4.9,
            'reviews': 128,
            'tags': ['Top Mentor 2024', 'AI Expert'],
            'avatar': '/images/sarah_chen.png',
            'status': 'top',
            'bio': 'Sarah Chen is a highly accomplished Managing Partner within the InnoSphere Portal. With over 15 years in venture capital, she has successfully guided 50+ startups through Series A and B funding rounds with a primary focus on DeepTech and Fintech disruption.'
        },
        {
            'name': 'Dr. Marcus Vane',
            'role': 'Policy Advisor',
            'company': 'Ministry of Edu',
            'expertise': ['Education Policy', 'Grants', 'IP Protection'],
            'rating': 5.0,
            'reviews': 84,
            'tags': ['15+ Years Experience', 'Policy'],
            'avatar': '/images/marcus_vane.png',
            'status': 'regular',
            'bio': 'Dr. Marcus Vane serves as a senior advisor specializing in educational grant frameworks. His expertise lies in bridge-funding academic research into viable commercial prototypes, ensuring policy compliance at every stage.'
        },
        {
            'name': 'Elena Rodriguez',
            'role': 'Founder',
            'company': 'ScaleUp Systems',
            'expertise': ['IP Protection', 'Operations', 'Scaling'],
            'rating': 4.8,
            'reviews': 42,
            'tags': ['Ex-Founder', 'Operations'],
            'avatar': '/images/elena_rodriguez.png',
            'status': 'top',
            'bio': 'Elena Rodriguez is an operational powerhouse who scaled three enterprise SaaS platforms to global exits. She now focuses on IP protection strategies and helping first-time founders navigate international market entry.'
        },
        {
            'name': 'James Wilson',
            'role': 'TechPark CEO',
            'company': 'Nexus Hub',
            'expertise': ['Operations', 'Green Tech'],
            'rating': 4.7,
            'reviews': 55,
            'tags': ['Operations', 'Sustainability'],
            'avatar': '/images/innovation_center.png',
            'status': 'regular',
            'bio': 'James Wilson oversees operations at Nexus Hub, focusing on sustainable infrastructure for high-growth tech teams.'
        }
    ]
    
    for item in mentor_data:
        if not db.query(Mentor).filter(Mentor.name == item['name']).first():
            db.add(Mentor(**item))

    # Seminars
    seminar_data = [
        {
            'title': 'Commercializing University Tech',
            'date_str': 'Oct 24',
            'month': 'OCT',
            'day': '24',
            'time': '10:00 AM',
            'speaker': 'James Wilson',
            'role': 'TechPark CEO',
            'category': 'BUSINESS SEMINARS',
            'description': 'Learn the roadmap from lab to market: licensing, spin-offs, and industrial partnerships.',
            'img': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df'
        },
        {
            'title': 'Venture Capital for Biotech',
            'date_str': 'Oct 27',
            'month': 'OCT',
            'day': '27',
            'time': '02:30 PM',
            'speaker': 'Elena Rodriguez',
            'role': 'LifeFund Partners',
            'category': 'POLICY UPDATES',
            'description': 'Inside the mind of biotech investors: what they look for in clinical trials and early data.',
            'img': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f'
        },
        {
            'title': 'Scaling AI Infrastructure',
            'date_str': 'Nov 05',
            'month': 'NOV',
            'day': '05',
            'time': '09:00 AM',
            'speaker': 'Sarah Chen',
            'role': 'Managing Partner',
            'category': 'TECHNICAL WORKSHOPS',
            'description': 'Practical guide to building and managing GPU clusters for large-scale model training.',
            'img': 'https://images.unsplash.com/photo-1677442136019-21780ecad995'
        }
    ]
    
    for item in seminar_data:
        if not db.query(Seminar).filter(Seminar.title == item['title']).first():
            db.add(Seminar(**item))

    # Tech Parks
    tech_park_data = [
        {
            'name': 'Innovation Center @ MIT',
            'location': 'Cambridge, MA',
            'tags': ['Cleanrooms', 'Incubator', 'AI'],
            'status': 'Open Access',
            'coordinates': {'lat': 42.3601, 'lng': -71.0942},
            'image': '/images/innovation_center.png'
        },
        {
            'name': 'Silicon Oasis Hub',
            'location': 'Dubai, UAE',
            'tags': ['AI', 'Incubator'],
            'status': 'Optimized',
            'coordinates': {'lat': 25.1264, 'lng': 55.3857},
            'image': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
        },
        {
            'name': 'Nexus Research Park',
            'location': 'Cambridge, UK',
            'tags': ['Biotech', 'Cleanrooms'],
            'status': 'Active',
            'coordinates': {'lat': 52.2053, 'lng': 0.1218},
            'image': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623'
        }
    ]
    
    for item in tech_park_data:
        if not db.query(TechPark).filter(TechPark.name == item['name']).first():
            db.add(TechPark(**item))

    # Pitches
    pitch_data = [
        {
            'title': 'EcoStream AI',
            'founder': 'Alex Rivera',
            'description': 'AI-driven water management for industrial cooling systems.',
            'valuation': '$5M',
            'funding_needed': '$1.2M',
            'industry': 'Green Tech',
            'status': 'Approved'
        },
        {
            'title': 'QuantumLedger',
            'founder': 'Dr. Sarah Smith',
            'description': 'Blockchain secured by post-quantum cryptographic primitives.',
            'valuation': '$12M',
            'funding_needed': '$3M',
            'industry': 'Quantum',
            'status': 'Pending'
        }
    ]
    
    for item in pitch_data:
        if not db.query(Pitch).filter(Pitch.title == item['title']).first():
            db.add(Pitch(**item))

    # --- Research Engine Seeding ---
    
    # 1. Create a Sample Startup
    sample_startup_data = {
        'name': 'NeuroFlow Analytics',
        'industry': 'HealthTech',
        'description': 'AI-powered predictive analytics for early onset neurological disorders using non-invasive EEG data.'
    }
    
    startup = db.query(Startup).filter(Startup.name == sample_startup_data['name']).first()
    if not startup:
        startup = Startup(**sample_startup_data)
        db.add(startup)
        db.commit()
        db.refresh(startup)
        print(f"Seeded Startup: {startup.name}")
        
        # Initialize Score
        # Logic: Competitors (2*10=20) + Market (25) + Fit (25) + Customers (2*10=20) = 90
        db.add(ResearchScore(startup_id=startup.id, score=90))

        # 2. Competitors
        competitors = [
            {
                'name': 'DeepMind Health',
                'website': 'deepmind.com',
                'description': 'Google AI health division focusing on protein folding.',
                'strengths': 'Massive compute resources, top talent.',
                'weaknesses': 'Generalist approach, not specific to EEG.'
            },
            {
                'name': 'Neuralink',
                'website': 'neuralink.com',
                'description': 'Hardware BCI focus.',
                'strengths': 'High bandwidth data.',
                'weaknesses': 'Invasive surgery required.'
            }
        ]
        for comp in competitors:
            comp['startup_id'] = startup.id
            db.add(Competitor(**comp))

        # 3. Target Customers
        customers = [
            {
                'segment': 'Research Hospitals',
                'pain_points': 'Late diagnosis of Alzheimer\'s.',
                'current_solution': 'Subjective cognitive tests.'
            },
            {
                'segment': 'Pharma Trials',
                'pain_points': 'Difficulty measuring drug efficacy on brain.',
                'current_solution': 'Expensive MRI scans.'
            }
        ]
        for cust in customers:
            cust['startup_id'] = startup.id
            db.add(TargetCustomer(**cust))

        # 4. Market Size
        market = {
            'startup_id': startup.id,
            'tam': '$120 Billion (Global Mental Health)',
            'sam': '$15 Billion (US & EU Diagnostics)',
            'som': '$250 Million (Early Adopter Clinics)',
            'source': 'Gartner 2024 Report'
        }
        db.add(MarketSize(**market))

        # 5. Problem-Solution Fit
        fit = {
            'startup_id': startup.id,
            'problem': 'Diagnosing neurodegenerative diseases takes 10+ years of symptom progression.',
            'existing_solutions': 'MRI (Expensive), Cognitive Tests (Subjective).',
            'gap': 'No scalable, cheap, objective biomarker screening exists.',
            'proposed_solution': 'Wearable EEG headset + AI processing for 15-minute screening.'
        }
        db.add(ProblemSolutionFit(**fit))

    db.commit()
    db.close()
    print("Database seeding sync completed.")

if __name__ == "__main__":
    seed_database()
