import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <h1>{window.location.pathname === '/' ? 'Dashboard' : window.location.pathname.slice(1).charAt(0).toUpperCase() + window.location.pathname.slice(2)}</h1>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
