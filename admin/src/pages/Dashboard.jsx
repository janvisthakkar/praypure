import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, Image, Star, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        subscribers: 0,
        testimonials: 0,
        slides: 0
    });
    const [settings, setSettings] = useState({
        hidePrices: false
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [prodRes, subRes, testRes, heroRes, settingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/products`),
                    axios.get(`${API_BASE}/api/subscribers`),
                    axios.get(`${API_BASE}/api/testimonials`),
                    axios.get(`${API_BASE}/api/content/hero`),
                    axios.get(`${API_BASE}/api/settings`)
                ]);

                setStats({
                    products: prodRes.data.pagination?.total || prodRes.data.count || 0,
                    subscribers: subRes.data.count || 0,
                    testimonials: testRes.data.count || 0,
                    slides: heroRes.data.count || 0
                });

                if (settingsRes.data.success) {
                    setSettings(settingsRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchDashboardData();
    }, []);

    const togglePriceVisibility = async () => {
        try {
            const newValue = !settings.hidePrices;
            const res = await axios.put(`${API_BASE}/api/settings/hidePrices`, { value: newValue });
            if (res.data.success) {
                setSettings(prev => ({ ...prev, hidePrices: newValue }));
                toast.success('Store visibility updated');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        }
    };

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

            <div className="card store-settings" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Store Visibility Settings</h3>
                        <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Manage global visibility of prices and buttons.</p>
                    </div>
                    <div>
                        <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <span style={{ fontWeight: 500 }}>Hide Prices & Buy Options</span>
                            <div
                                style={{
                                    width: '50px',
                                    height: '26px',
                                    background: settings.hidePrices ? '#d4af37' : '#333',
                                    borderRadius: '13px',
                                    position: 'relative',
                                    transition: '0.3s'
                                }}
                                onClick={togglePriceVisibility}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '3px',
                                    left: settings.hidePrices ? '27px' : '3px',
                                    transition: '0.3s'
                                }} />
                            </div>
                        </label>
                    </div>
                </div>
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
