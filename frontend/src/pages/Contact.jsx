import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_WHATSAPP } from '../data/shop';

const Contact = () => {
    return (
        <section className="section contact-page">
            <Helmet>
                <title>Contact | Praypure</title>
                <meta name="description" content="Write to Praypure for product, trade, or prayer-shelf questions." />
            </Helmet>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Contact</h2>
                    <p className="section-subtitle">For shoppers, temples, and trade partners</p>
                </div>
                <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ marginBottom: '28px', color: 'var(--color-light-brown)' }}>
                        Ask about a fragrance, a pack size, or a bulk order. We reply on WhatsApp and email.
                    </p>
                    <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '18px' }}>
                        <p><strong>WhatsApp</strong><br /><a href={CONTACT_WHATSAPP} style={{ color: 'inherit' }}>{CONTACT_PHONE}</a></p>
                        <p><strong>Phone</strong><br /><a href={`tel:${CONTACT_PHONE_TEL}`} style={{ color: 'inherit' }}>{CONTACT_PHONE}</a></p>
                        <p><strong>Email</strong><br /><a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'inherit' }}>{CONTACT_EMAIL}</a></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
