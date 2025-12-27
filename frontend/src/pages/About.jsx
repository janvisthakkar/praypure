import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-banner">
                <div className="container">
                    <h1 className="page-title">About Praypure</h1>
                    <p className="page-subtitle">Your trusted partner in spiritual wellness</p>
                </div>
            </section>

            <section className="section journey-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Journey</h2>
                    </div>
                    <div className="journey-content">
                        <div className="journey-image">
                            <div className="placeholder-image">Journey Image</div>
                        </div>
                        <div className="journey-text">
                            <p className="lead">Praypure was born from a deep passion for preserving traditional Indian incense-making techniques and bringing authentic spiritual products to modern homes.</p>
                            <p>Founded in 2020, our journey began with a simple mission: to create incense products that honor centuries-old traditions while meeting the highest standards of quality and purity. We work directly with skilled artisans who have mastered the art of incense making, passed down through generations.</p>
                            <p>Today, Praypure stands as a trusted name in spiritual wellness, serving thousands of customers across India. We remain committed to our core values of purity, authenticity, and reverence for tradition.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section vision-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Vision</h2>
                    </div>
                    <div className="vision-card">
                        <div className="vision-icon">👁️</div>
                        <div className="vision-content">
                            <h3>To become India's most trusted brand for authentic spiritual products</h3>
                            <p>We envision a future where every home in India has access to pure, authentic incense products that enhance spiritual practices and create peaceful environments. Our vision extends beyond commerce—we aim to preserve and promote traditional Indian craftsmanship while bringing purity and peace to every household.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section mission-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Mission</h2>
                    </div>
                    <div className="mission-grid">
                        <div className="mission-item">
                            <div className="mission-icon">🌿</div>
                            <h3>Pure Ingredients</h3>
                            <p>Source only the finest natural ingredients from trusted suppliers across India</p>
                        </div>
                        <div className="mission-item">
                            <div className="mission-icon">✨</div>
                            <h3>Traditional Craftsmanship</h3>
                            <p>Preserve and promote age-old techniques of incense making</p>
                        </div>
                        <div className="mission-item">
                            <div className="mission-icon">💎</div>
                            <h3>Quality Assurance</h3>
                            <p>Maintain the highest standards in every product we create</p>
                        </div>
                        <div className="mission-item">
                            <div className="mission-icon">🤝</div>
                            <h3>Customer Satisfaction</h3>
                            <p>Ensure every customer experiences the purity and quality we promise</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section values-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Values</h2>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Purity</h3>
                            <p>We believe in absolute purity—in our ingredients, our processes, and our intentions. Every product reflects our commitment to purity.</p>
                        </div>
                        <div className="value-card">
                            <h3>Authenticity</h3>
                            <p>We honor traditional methods and authentic recipes, ensuring that every product carries the essence of genuine Indian spirituality.</p>
                        </div>
                        <div className="value-card">
                            <h3>Reverence</h3>
                            <p>We approach our craft with deep respect for tradition, spirituality, and the sacred nature of our products.</p>
                        </div>
                        <div className="value-card">
                            <h3>Excellence</h3>
                            <p>We strive for excellence in every aspect—from sourcing to crafting to delivering the best experience to our customers.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
