import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, Image, Star, LogOut } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        subscribers: 0,
        testimonials: 0,
        slides: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [prodRes, subRes, testRes, heroRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/products`),
                    axios.get(`${API_BASE}/api/subscribers`),
                    axios.get(`${API_BASE}/api/testimonials`),
                    axios.get(`${API_BASE}/api/content/hero`)

                ]);

                setStats({
                    products: prodRes.data.pagination?.total || prodRes.data.count || 0,
                    subscribers: subRes.data.count || 0,
                    testimonials: testRes.data.count || 0,
                    slides: heroRes.data.count || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Products', value: stats.products, icon: Package, color: '#4cc9f0' },
        { label: 'Total Subscribers', value: stats.subscribers, icon: Users, color: '#ff006e' },
        { label: 'Testimonials', value: stats.testimonials, icon: Star, color: '#ffbe0b' },
        { label: 'Hero Slides', value: stats.slides, icon: Image, color: '#7209b7' },
    ];

    return (
        <div className="dashboard-page">
            <div className="stats-grid">
                {statCards.map((card, idx) => (
                    <div key={idx} className="stat-card">
                        <div className="stat-icon" style={{ color: card.color, backgroundColor: `${card.color}15` }}>
                            <card.icon size={30} />
                        </div>
                        <div className="stat-info">
                            <h3>{card.label}</h3>
                            <p>{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-welcome card">
                <h2>Welcome back to Praypure Admin</h2>
                <p>From here, you can manage all aspects of your digital store. Select a module from the sidebar to get started.</p>
                <div className="quick-actions">
                    <button className="btn btn-primary" onClick={() => window.location.href = '/content'} style={{ background: '#d4af37', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Update Home Content</button>
                    <button className="btn btn-secondary" onClick={() => window.location.href = '/products'} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginLeft: '10px' }}>Manage Catalog</button>
                </div>
            </div>

            <style>{`
                .card {
                    background: var(--card-bg);
                    padding: 3rem;
                    border-radius: 1.25rem;
                    border: 1px solid var(--border);
                }
                .dashboard-welcome h2 {
                    margin-top: 0;
                    font-size: 2rem;
                    background: linear-gradient(to right, #d4af37, #f9e29d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .dashboard-welcome p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    line-height: 1.6;
                    max-width: 600px;
                    margin-bottom: 2rem;
                }
                .quick-actions button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
