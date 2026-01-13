import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Image,
    Users,
    LogOut,
    ChevronRight,
    Grid,
    QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Categories', icon: Grid, path: '/categories' },
        { name: 'Products', icon: Package, path: '/products' },
        { name: 'Home Content', icon: Image, path: '/content' },
        { name: 'Subscribers', icon: Users, path: '/subscribers' },
        { name: 'QR Codes', icon: QrCode, path: '/qrcodes' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>Praypure</h2>
                <span>Admin Panel</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                        <ChevronRight size={16} className="arrow" />
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="admin-profile">
                    <div className="avatar">{user?.username?.[0].toUpperCase()}</div>
                    <div className="info">
                        <p>{user?.username}</p>
                        <span>{user?.role}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
