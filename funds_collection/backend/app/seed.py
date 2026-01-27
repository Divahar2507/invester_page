from sqlalchemy.orm import Session
from . import models, schemas
from uuid import uuid4

def seed_data(db: Session):
    # Check if data exists
    if db.query(models.Fund).first():
        return

    dummy_funds = [
        {
            "title": "Eco-Friendly Urban Farm",
            "description": "A sustainable urban farming initiative to provide fresh produce to local communities. We are building vertical gardens in vacant lots to reduce food miles.",
            "target_amount": 500000,
            "current_amount": 120000,
            "category": "Growth",
            "image_url": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "AI for Early Disease Detection",
            "description": "Developing AI algorithms to detect diseases at an early stage for better treatment outcomes. Our pilot study shows 95% accuracy in early stage melanoma detection.",
            "target_amount": 1000000,
            "current_amount": 450000,
            "category": "Research",
            "image_url": "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "TechNova AI Solutions",
            "description": "Revolutionizing the way we interact with technology through advanced AI solutions. Building the next generation of conversational agents for enterprise.",
            "target_amount": 2000000,
            "current_amount": 1500000,
            "category": "Startup",
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Clean Oceans Initiative",
            "description": "Deploying autonomous drones to clean up plastic waste from our oceans. We have successfully tested our prototype in the Pacific.",
            "target_amount": 750000,
            "current_amount": 300000,
            "category": "Public",
            "image_url": "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "NextGen Solar Panels",
            "description": "High-efficiency solar panels for residential use. Cheaper, lighter, and more durable than current market options.",
            "target_amount": 1500000,
            "current_amount": 100000,
            "category": "Startup",
            "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Community Art Center",
            "description": "A space for local artists to collaborate and showcase their work. We offer free workshops for underprivileged youth.",
            "target_amount": 200000,
            "current_amount": 180000,
            "category": "Crowd",
            "image_url": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Quantum Computing Research",
            "description": "Pushing the boundaries of computing power with quantum mechanics. Partnering with top universities to build stable qubits.",
            "target_amount": 5000000,
            "current_amount": 2500000,
            "category": "Research",
            "image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Sustainable Fashion Line",
            "description": "Clothing made from 100% recycled materials. Fashionable, affordable, and good for the planet.",
            "target_amount": 300000,
            "current_amount": 50000,
            "category": "Growth",
            "image_url": "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Rural Education Fund",
            "description": "Building schools and providing resources for children in rural areas. Every child deserves quality education.",
            "target_amount": 400000,
            "current_amount": 350000,
            "category": "Public",
            "image_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Smart Home Assistant",
            "description": "An AI-powered assistant that manages your home energy usage to save money and reduce carbon footprint.",
            "target_amount": 600000,
            "current_amount": 550000,
            "category": "Startup",
            "image_url": "https://images.unsplash.com/photo-1558002038-1091a166111c?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Vertical Forest Residential",
            "description": "A luxury residential building covered in thousands of trees and plants to improve air quality and provide natural cooling.",
            "target_amount": 12000000,
            "current_amount": 8500000,
            "category": "Growth",
            "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Bio-Plastic Packaging Hub",
            "description": "Manufacturing plant for 100% biodegradable packaging made from seaweed. Aiming to replace all single-use plastics in the retail sector.",
            "target_amount": 3500000,
            "current_amount": 1200000,
            "category": "Startup",
            "image_url": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Renewable Energy storage Node",
            "description": "Next-generation battery storage facility for stabilizing the local grid with 100% renewable energy input.",
            "target_amount": 8000000,
            "current_amount": 2000000,
            "category": "Startup",
            "image_url": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        },
        {
            "title": "Desalination Tech Pilot",
            "description": "Low-energy seawater desalination system powered by wave energy. Providing clean drinking water to coastal arid regions.",
            "target_amount": 2500000,
            "current_amount": 950000,
            "category": "Research",
            "image_url": "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1000",
            "pdf_url": None
        }
    ]

    for fund_data in dummy_funds:
        fund = models.Fund(id=str(uuid4()), **fund_data)
        db.add(fund)
    
    db.commit()
    print("Seeding complete.")
