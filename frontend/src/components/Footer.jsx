import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import {
    AMAZON_SHOP,
    FLIPKART_SHOP,
    CONTACT_EMAIL,
    CONTACT_PHONE,
    CONTACT_PHONE_TEL,
    CONTACT_WHATSAPP,
} from '../data/shop';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="/assets/logo-white.png" alt="Praypure" className="logo-img"
                                onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <p className="footer-desc">Charcoal-free gomay agarbatti and dhoop sticks, made with desi cow dung for daily puja.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Visit</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/impact">Our Impact</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/feedback">Feedback</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Shop</h3>
                        <ul className="footer-links">
                            <li><Link to="/incense">Agarbatti</Link></li>
                            <li><Link to="/dhoop">Dhoop sticks</Link></li>
                            <li><Link to="/dhoop-cups">Dhoop Cups</Link></li>
                            <li><Link to="/launching-soon">Coming Soon</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Shop Online</h3>
                        <ul className="footer-links">
                            <li><a href={AMAZON_SHOP} target="_blank" rel="noopener noreferrer">Amazon</a></li>
                            <li><a href={FLIPKART_SHOP} target="_blank" rel="noopener noreferrer">Flipkart</a></li>
                        </ul>
                        <h3 style={{ marginTop: '24px' }}>Talk to us</h3>
                        <div className="social-links">
                            <a href="https://www.instagram.com/praypure.in" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
                            <a href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
                        </div>
                        <div className="contact-info">
                            <p><a href={`mailto:${CONTACT_EMAIL}`}><FaEnvelope style={{ marginRight: '8px' }} /> {CONTACT_EMAIL}</a></p>
                            <p><a href={`tel:${CONTACT_PHONE_TEL}`}><FaPhoneAlt style={{ marginRight: '8px' }} /> {CONTACT_PHONE}</a></p>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Praypure. All rights reserved.</p>
                    <div className="footer-legal">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
