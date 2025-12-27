import React from 'react';

const Contact = () => {
    return (
        <section className="section contact-page">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Contact Us</h2>
                    <p className="section-subtitle">We'd love to hear from you</p>
                </div>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h3>Reach Out</h3>
                        <p>Have questions about our products or need assistance? Our team is here to help.</p>
                    </div>
                    <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '18px' }}>
                        <p><strong>Email:</strong> <a href="mailto:support@praypure.com" style={{ color: 'inherit', textDecoration: 'none' }}>support@praypure.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+919726012936" style={{ color: 'inherit', textDecoration: 'none' }}>+91 97260 12936</a></p>
                        <p><strong>Address:</strong> 123 Spiritual Way, Serenity City, India</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
