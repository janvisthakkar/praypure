import React from 'react';

const PrivacyPolicy = () => {
    return (
        <section className="section privacy-page">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Privacy Policy</h2>
                </div>
                <div className="content" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    <p>At Praypure, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Information We Collect</h3>
                    <p>We may collect personal information such as your name, email address, phone number, and shipping address when you make a purchase or subscribe to our newsletter.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>How We Use Your Information</h3>
                    <p>We use your information to process orders, provide customer support, and send you updates about our products and offers. We do not sell your personal information to third parties.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Security</h3>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Contact Us</h3>
                    <p>If you have any questions about our Privacy Policy, please contact us at info@praypure.com.</p>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
