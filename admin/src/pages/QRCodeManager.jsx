import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import { Plus, Trash2, Download, ExternalLink, QrCode as QrIcon, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

const QRCodeManager = () => {
    const [qrcodes, setQrcodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        category: 'packaging'
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchQRCodes();
    }, []);

    const fetchQRCodes = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/qrcodes`);
            if (data.success) {
                setQrcodes(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch QR codes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/qrcodes/${editingId}`, formData);
                toast.success('QR Code updated successfully');
            } else {
                await api.post(`/api/qrcodes`, formData);
                toast.success('QR Code created successfully');
            }
            setIsModalOpen(false);
            setFormData({ name: '', url: '', description: '', category: 'packaging' });
            setEditingId(null);
            fetchQRCodes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this QR code?')) {
            try {
                await api.delete(`/api/qrcodes/${id}`);
                toast.success('QR Code deleted');
                fetchQRCodes();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const downloadQR = (id, name) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="qrcode-manager">
            <div className="page-header">
                <div>
                    <h2>QR Code Management</h2>
                    <p>Generate and manage QR codes for packaging and marketing.</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', url: '', description: '', category: 'packaging' });
                    setIsModalOpen(true);
                }}>
                    <Plus size={20} />
                    <span>Create New QR</span>
                </button>
            </div>

            {loading ? (
                <div className="loading-state">Loading QR codes...</div>
            ) : (
                <div className="qr-grid">
                    {qrcodes.map((qr) => (
                        <div key={qr._id} className="qr-card">
                            <div className="qr-preview">
                                <QRCodeCanvas
                                    id={qr._id}
                                    value={qr.url}
                                    size={180}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                            <div className="qr-info">
                                <h3>{qr.name}</h3>
                                <p className="qr-url">{qr.url}</p>
                                <span className={`qr-badge ${qr.category}`}>{qr.category}</span>
                            </div>
                            <div className="qr-actions">
                                <button className="action-btn download" title="Download PNG" onClick={() => downloadQR(qr._id, qr.name)}>
                                    <Download size={18} />
                                </button>
                                <button className="action-btn edit" title="Edit" onClick={() => {
                                    setEditingId(qr._id);
                                    setFormData({ name: qr.name, url: qr.url, description: qr.description, category: qr.category });
                                    setIsModalOpen(true);
                                }}>
                                    <Save size={18} />
                                </button>
                                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(qr._id)}>
                                    <Trash2 size={18} />
                                </button>
                                <a href={qr.url} target="_blank" rel="noreferrer" className="action-btn test" title="Test Link">
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    ))}
                    {qrcodes.length === 0 && (
                        <div className="empty-state">
                            <QrIcon size={48} />
                            <p>No QR codes generated yet.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit QR Code' : 'Create New QR Code'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Packaging Main, Instagram QR"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Target URL</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://praypure.com/..."
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="packaging">Packaging</option>
                                    <option value="social">Social Media</option>
                                    <option value="feedback">Feedback Form</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    rows="3"
                                    placeholder="Where is this QR used?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update QR' : 'Generate QR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeManager;
