import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Trash2, Mail, Calendar, Search, Power, PowerOff } from 'lucide-react';


const SubscriberManager = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSubscribers = async () => {
        try {
            const response = await api.get(`/api/subscribers`);

            setSubscribers(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch subscribers');
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleToggle = async (id, currentStatus) => {
        try {
            await api.patch(`/api/subscribers/${id}/toggle`);
            toast.success(`Subscriber ${currentStatus ? 'deactivated' : 'reactivated'}`);
            fetchSubscribers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('PERMANENTLY DELETE this subscriber? This action cannot be undone.')) {
            try {
                await api.delete(`/api/subscribers/${id}`);
                toast.success('Subscriber deleted permanently');
                fetchSubscribers();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const filtered = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manager-container">
            <div className="manager-header">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search email list..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="stats-mini">
                    <span>Total Leads: <strong>{subscribers.length}</strong></span>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th><Mail size={16} /> Email</th>
                            <th><Calendar size={16} /> Date Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(sub => (
                            <tr key={sub._id}>
                                <td className="email-cell">{sub.email}</td>
                                <td>{new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}</td>
                                <td><span className={`status-pill ${sub.isActive ? 'active' : 'inactive'}`}>{sub.isActive ? 'Active' : 'Unsubscribed'}</span></td>
                                <td className="actions">
                                    <div className="actions-wrapper">
                                        <button
                                            className={`btn-icon status ${sub.isActive ? 'deactivate' : 'activate'}`}
                                            onClick={() => handleToggle(sub._id, sub.isActive)}
                                            title={sub.isActive ? 'Deactivate' : 'Reactivate'}
                                        >
                                            {sub.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                                        </button>
                                        <button
                                            className="btn-icon delete"
                                            onClick={() => handleDelete(sub._id)}
                                            title="Delete Permanently"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .manager-container { padding: 0; }
        .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; gap: 2rem; }
        .search-bar { flex: 1; position: relative; display: flex; align-items: center; max-width: 400px; }
        .search-bar input { width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.75rem; color: white; transition: 0.3s; }
        .search-bar input:focus { border-color: var(--accent); outline: none; }
        .search-bar svg { position: absolute; left: 1rem; color: var(--text-secondary); }
        .stats-mini { background: rgba(255,255,255,0.05); padding: 0.85rem 1.5rem; border-radius: 0.75rem; border: 1px solid var(--border); font-size: 0.95rem; }
        .stats-mini strong { color: var(--accent); margin-left: 0.5rem; font-size: 1.1rem; }

        .email-cell { font-weight: 500; color: var(--text-primary); }
        .status-pill { padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-pill.active { background: rgba(52, 199, 89, 0.15); color: #34c759; }
        .status-pill.inactive { background: rgba(255, 59, 48, 0.15); color: #ff3b30; }

        .actions-wrapper { display: flex; gap: 0.5rem; justify-content: center; }
        .btn-icon.status { color: var(--text-secondary); background: rgba(255,255,255,0.05); }
        .btn-icon.status.activate:hover { background: rgba(52, 199, 89, 0.15); color: #34c759; border-color: #34c759; }
        .btn-icon.status.deactivate:hover { background: rgba(255, 159, 10, 0.15); color: #ff9f0a; border-color: #ff9f0a; }
        .btn-icon.delete:hover { background: rgba(255, 59, 48, 0.15); color: #ff3b30; border-color: #ff3b30; }

      `}</style>
        </div>
    );
};

export default SubscriberManager;
