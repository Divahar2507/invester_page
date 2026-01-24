import React from 'react';
import { Quote } from 'lucide-react';

const SuccessStoriesPage = () => {
    const stories = [
        {
            id: 1,
            title: "From Garage to Unicorn",
            author: "Sarah Jenkins, CEO TechNova",
            content: "FundHub provided the critical early-stage capital we needed when VCs turned us down. The community support was overwhelming.",
            metric: "₹4.5Cr Raised"
        },
        {
            id: 2,
            title: "Saving the Oceans",
            author: "David Chen, GreenEarth",
            content: "Our research on plastic-eating bacteria got fully funded in 3 months. We are now deploying pilots across 5 countries.",
            metric: "Research Grant"
        },
        {
            id: 3,
            title: "Scaling EdTech in Rural India",
            author: "Priya Sharma, Vidya",
            content: "The growth funding allowed us to hire 50 local teachers and buy tablets for 1000 students.",
            metric: "10k+ Students Impacted"
        }
    ];

    return (
        <div className="page-container fade-in">
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
                <p className="text-muted">Real impact created by our community of investors.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {stories.map(story => (
                    <div key={story.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Quote size={32} className="text-primary" style={{ opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{story.title}</h3>
                        <p style={{ color: '#a0a0a0', lineHeight: '1.6', flex: 1 }}>"{story.content}"</p>
                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                            <div style={{ fontWeight: 'bold' }}>{story.author}</div>
                            <div className="text-gradient" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{story.metric}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuccessStoriesPage;
