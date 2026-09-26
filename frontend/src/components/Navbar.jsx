import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { INCENSE_LINES, DHOOP_LINES } from '../data/shop';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState('');
    const [logoError, setLogoError] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;
    const incenseOpen = INCENSE_LINES.some((line) => isActive(`/${line.slug}`)) || isActive('/incense');
    const dhoopOpen = DHOOP_LINES.some((line) => isActive(`/${line.slug}`)) || isActive('/dhoop');

    const closeMenu = () => {
        setIsMenuOpen(false);
        setOpenMenu('');
    };

    const toggleSubmenu = (key) => {
        setOpenMenu((current) => (current === key ? '' : key));
    };

    return (
        <nav className="navbar">
            <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
            <div className="container">
                <div className="nav-wrapper">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        {!logoError ? (
                            <img
                                src="/assets/logo.png"
                                alt="Praypure"
                                className="logo-img"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <span className="logo-text">PRAYPURE</span>
                        )}
                    </Link>
                    <ul className={`nav-menu ${isMenuOpen ? 'mobile-active' : ''}`}>
                        <li>
                            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>Home</Link>
                        </li>
                        <li className={`has-submenu ${openMenu === 'incense' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className={`submenu-toggle ${incenseOpen ? 'active' : ''}`}
                                onClick={() => toggleSubmenu('incense')}
                                aria-expanded={openMenu === 'incense'}
                            >
                                Agarbatti
                            </button>
                            <ul className="submenu">
                                <li><Link to="/incense" onClick={closeMenu}>All agarbatti</Link></li>
                                {INCENSE_LINES.map((line) => (
                                    <li key={line.slug}>
                                        <Link to={`/${line.slug}`} className={isActive(`/${line.slug}`) ? 'active' : ''} onClick={closeMenu}>
                                            {line.label} · {line.pack}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className={`has-submenu ${openMenu === 'dhoop' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className={`submenu-toggle ${dhoopOpen ? 'active' : ''}`}
                                onClick={() => toggleSubmenu('dhoop')}
                                aria-expanded={openMenu === 'dhoop'}
                            >
                                Dhoop sticks
                            </button>
                            <ul className="submenu">
                                <li><Link to="/dhoop" onClick={closeMenu}>All dhoop sticks</Link></li>
                                {DHOOP_LINES.map((line) => (
                                    <li key={line.slug}>
                                        <Link to={`/${line.slug}`} className={isActive(`/${line.slug}`) ? 'active' : ''} onClick={closeMenu}>
                                            {line.label} · {line.pack}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li><Link to="/launching-soon" className={isActive('/launching-soon') ? 'active' : ''} onClick={closeMenu}>Coming Soon</Link></li>
                        <li><Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={closeMenu}>About</Link></li>
                        <li><Link to="/impact" className={isActive('/impact') ? 'active' : ''} onClick={closeMenu}>Our Impact</Link></li>
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
