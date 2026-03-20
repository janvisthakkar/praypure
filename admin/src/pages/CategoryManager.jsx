import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, X, Upload } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        subtitle: '',
        description: '',
        image: '',
        slug: '',
        isActive: true
    });

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${API_BASE}${path}`;
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/api/categories?includeInactive=true`);
            setCategories(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            title: category.title,
            subtitle: category.subtitle || '',
            description: category.description || '',
            image: category.image || '',
            slug: category.slug || '',
            isActive: category.isActive !== undefined ? category.isActive : true
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This won't delete products, but might break landing pages.")) {
            try {
                await api.delete(`/api/categories/${id}`);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/api/categories/${editingCategory._id}`, formData);
                toast.success('Category updated');
            } else {
                await api.post(`/api/categories`, formData);
                toast.success('Category added');
            }
            setShowModal(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);
        uploadData.append('folder', 'categories'); // Specify folder

        try {
            setLoading(true);
            const res = await api.post(`/api/upload`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.data.url;
            setFormData(prev => ({ ...prev, image: url }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manager-container">
            <div className="manager-header">
                <h2>Manage Categories</h2>
                <button className="btn-add" onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: '', title: '', subtitle: '', description: '', image: '', slug: '', isActive: true });
                    setShowModal(true);
                }}>
                    <Plus size={20} /> Add Category
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td><img src={getImageUrl(cat.image)} alt="" className="thumb" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                                <td>{cat.name}</td>
                                <td>{cat.title}</td>
                                <td><code>{cat.slug}</code></td>
                                <td>
                                    <span className={`status-pill ${cat.isActive ? 'active' : 'inactive'}`}>
                                        {cat.isActive ? 'Live' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="actions">
                                    <div className="actions-wrapper">
                                        <button className="btn-icon edit" onClick={() => handleEdit(cat)}><Edit2 size={16} /></button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(cat._id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Internal Name (for grouping)</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Incense Sticks" />
                                </div>
                                <div className="form-group">
                                    <label>Page Title (Display Title)</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Pure Incense Sticks" />
                                </div>
                                <div className="form-group">
                                    <label>URL Slug</label>
                                    <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required placeholder="e.g. incense-sticks" />
                                </div>
                                <div className="form-group">
                                    <label>Banner Image URL</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                                        <label className="btn-inline" style={{
                                            background: 'rgba(212, 175, 55, 0.1)',
                                            color: 'var(--accent)',
                                            border: '1px solid var(--accent)',
                                            padding: '0 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                            <Upload size={16} /> Upload
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group full-width">
                                    <label>Page Subtitle</label>
                                    <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Short tagline for the category page" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description (Meta/Page)</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Longer description..."></textarea>
                                </div>
                                <div className="form-group checkbox-wrapper">
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                        <span>Visible on Website?</span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
