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
                        <li><Link to="/incense-sticks" className={isActive('/incense-sticks') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Incense Sticks</Link></li>
                        <li><Link to="/dhoop-sticks" className={isActive('/dhoop-sticks') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dhoop Sticks</Link></li>
                        <li><Link to="/dhoop-cones" className={isActive('/dhoop-cones') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dhoop Cones</Link></li>
                        <li><Link to="/havan-cups" className={isActive('/havan-cups') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Havan Cups</Link></li>

                        <li><Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
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
