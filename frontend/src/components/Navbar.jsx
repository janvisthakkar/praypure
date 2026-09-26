import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
            <div className="container">
                <div className="nav-wrapper">
                    <Link to="/" className="logo">
                        {!logoError ? (
                            <img
                                src="/assets/logo.png"
                                alt="Praypure Logo"
                                className="logo-img"
                                onError={() => setLogoError(true)}
                            />
                        ) : null}
                        {logoError && (
                            <span className="logo-text">PRAYPURE</span>
                        )}
                    </Link>
                    <ul className={`nav-menu ${isMenuOpen ? 'mobile-active' : ''}`}>
                        <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/incense-zipper-pouches" className={isActive('/incense-zipper-pouches') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Zip Pouches</Link></li>
                        <li><Link to="/incense-sticks-100g" className={isActive('/incense-sticks-100g') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Incense 100g</Link></li>
                        <li><Link to="/incense-sticks-33" className={isActive('/incense-sticks-33') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Incense 33</Link></li>
                        <li><Link to="/incense-packs-10" className={isActive('/incense-packs-10') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Incense 10</Link></li>
                        <li><Link to="/dhoop-sticks-100g" className={isActive('/dhoop-sticks-100g') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dhoop 100g</Link></li>
                        <li><Link to="/dhoop-sticks-10" className={isActive('/dhoop-sticks-10') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dhoop 10</Link></li>
                        <li><Link to="/dhoop-packs-90" className={isActive('/dhoop-packs-90') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dhoop 90g</Link></li>
                        <li><Link to="/dhoop-cups" className={isActive('/dhoop-cups') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dhoop Cups</Link></li>
                        <li><Link to="/launching-soon" className={isActive('/launching-soon') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Coming Soon</Link></li>
                        <li><Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                        <li><Link to="/impact" className={isActive('/impact') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Our Impact</Link></li>
                    </ul>
                    <div className="nav-actions">
                        <button
                            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Menu"
                        >
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
