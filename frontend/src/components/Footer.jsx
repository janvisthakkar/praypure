import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="/assets/logo-white.png" alt="Praypure Logo" className="logo-img"
                                onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <p className="footer-desc">Your trusted partner in spiritual wellness and authentic incense products.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/offers">Offers</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Products</h3>
                        <ul className="footer-links">
                            <li><Link to="/incense-sticks">Incense Sticks</Link></li>
                            <li><Link to="/dhoop-sticks">Dhoop Sticks</Link></li>
                            <li><Link to="/dhoop-cones">Dhoop Cones</Link></li>
                            <li><Link to="/havan-cups">Havan Cups</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Shop Online</h3>
                        <ul className="footer-links">
                            <li><a href="https://www.amazon.in/s?k=praypure" target="_blank" rel="noopener noreferrer">Shop on Amazon</a></li>
                            <li><a href="https://www.flipkart.com/search?q=praypure" target="_blank" rel="noopener noreferrer">Shop on Flipkart</a></li>
                        </ul>
                        <h3 style={{ marginTop: '24px' }}>Connect With Us</h3>
                        <div className="social-links">
                            <a href="https://www.facebook.com/praypure" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="https://www.instagram.com/praypure.in" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
                            <a href="https://twitter.com/praypure" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter"><FaTwitter /></a>
                            <a href="https://www.linkedin.com/company/praypure" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
                            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
                        </div>
                        <div className="contact-info">
                            <p><a href="mailto:support@praypure.com"><FaEnvelope style={{ marginRight: '8px' }} /> support@praypure.com</a></p>
                            <p><a href="tel:+919726012936"><FaPhoneAlt style={{ marginRight: '8px' }} /> +91 97260 12936</a></p>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Praypure. All rights reserved.</p>
                    <div className="footer-legal">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;

