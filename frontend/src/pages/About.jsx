import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-banner" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url('/assets/images/about_banner_gau_maiya.png')" }}>
                <div className="container">
                    <h1 className="page-title">The Purity of Gau Maiya</h1>
                    <p className="page-subtitle">Sacred Cow Dung Incense for the Modern Soul</p>
                </div>
            </section>

            <section className="section journey-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Roots: A Journey Back to Tradition</h2>
                    </div>
                    <div className="journey-content">
                        <div className="journey-image">
                            <img src="/assets/images/temple_cow_illustration.png" alt="Cow walking towards temple" className="founded-image" />
                        </div>
                        <div className="journey-text">
                            <p className="lead">Praypure was founded in 2025 with a single, profound mission: to restore the sacred atmosphere of Indian homes through the spiritual purity of indigenous Cow Dung.</p>
                            <p>We noticed that traditional incense was being replaced by charcoal, wood dust, and synthetic chemicals. We set out to bring back the "Gau Maiya" (Cow Dung) tradition—the heartbeat of Vedic purification—merging ancient wisdom with modern standards of quality.</p>
                            <p>Today, Praypure stands as a symbol of authentic spiritual wellness, helping modern seekers find deep connection in their daily rituals.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section core-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Core: Sacred Gau Maiya</h2>
                    </div>
                    <div className="vision-card">
                        <div className="vision-icon">🐄</div>
                        <div className="vision-content">
                            <h3>The Power of Indigenous Cow Dung</h3>
                            <p>At Praypure, Cow Dung is not just a base—it is a spiritual cleanser mentioned in our ancient scriptures. By using pure indigenous Desi Cow Dung, our products go beyond fragrance. They purify the air, balance the energy of your space, and create a sanctuary for peace and prayer.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section craft-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">The Craft: Tradition Meets Science</h2>
                    </div>
                    <div className="mission-grid">
                        <div className="mission-item">
                            <div className="mission-icon">🌿</div>
                            <h3>The Vedic Base</h3>
                            <p>Starting with pure Gau Maiya and sacred herbs, we have eliminated charcoal for a truly spiritual burn</p>
                        </div>
                        <div className="mission-item">
                            <div className="mission-icon">✨</div>
                            <h3>Artisan Spirit</h3>
                            <p>Hand-rolled with devotion, every stick preserves the ancient tactile heritage of Indian incense-making</p>
                        </div>
                        <div className="mission-item">
                            <div className="mission-icon">🔬</div>
                            <h3>Scientific Purity</h3>
                            <p>Our low-smoke formulas are refined for modern homes, ensuring a healthy atmosphere without compromising tradition</p>
                        </div>
                        <div className="mission-item">
                            <div className="mission-icon">🕉️</div>
                            <h3>Soulful Rituals</h3>
                            <p>We craft a bridge between your daily prayers and the timeless, purifying energy of Gau Maiya</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section values-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Sacred Values</h2>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Purity</h3>
                            <p>Absolute purity in our ingredients, our processes, and our intentions. Every product reflects this commitment</p>
                        </div>
                        <div className="value-card">
                            <h3>Authenticity</h3>
                            <p>We honor traditional recipes, ensuring every product carries the genuine essence of Indian spirituality</p>
                        </div>
                        <div className="value-card">
                            <h3>Reverence</h3>
                            <p>We approach our craft with deep respect for the sacred nature of the rituals we serve</p>
                        </div>
                        <div className="value-card">
                            <h3>Excellence</h3>
                            <p>From sourcing the finest herbs to delivering a premium experience, we strive for perfection</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
