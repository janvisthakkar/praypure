import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, MoveUp, MoveDown, X, Star, StarHalf, Upload } from 'lucide-react';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ContentManager = () => {

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${API_BASE}${path}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    const [activeTab, setActiveTab] = useState('hero');
    const [heroSlides, setHeroSlides] = useState([]);
    const [sections, setSections] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({});

    const fetchData = async () => {
        try {
            const [heroRes, sectionRes, testimonialRes] = await Promise.all([
                axios.get(`${API_BASE}/api/content/hero?includeInactive=true`),
                axios.get(`${API_BASE}/api/content/sections?includeInactive=true`),
                axios.get(`${API_BASE}/api/testimonials?includeInactive=true`)
            ]);
            setHeroSlides(heroRes.data.data);
            setSections(sectionRes.data.data);
            setTestimonials(testimonialRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch content');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData(item);
        } else {
            setFormData(activeTab === 'hero' ? {
                title: '', subtitle: '', image: '', amazonLink: '', flipkartLink: '', order: heroSlides.length + 1, isActive: true
            } : activeTab === 'collections' ? {
                sectionType: 'collection', title: '', description: '', image: '', icon: '🌿', link: '', order: sections.filter(s => s.sectionType === 'collection').length + 1, isActive: true
            } : activeTab === 'features' ? {
                sectionType: 'feature', title: '', description: '', image: '', icon: '🌿', link: '', order: sections.filter(s => s.sectionType === 'features').length + 1, isActive: true
            } : {
                name: '', location: '', text: '', rating: 5, avatar: '', isActive: true
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const url = activeTab === 'hero' ? `/api/content/hero/${id}`
                : ['collections', 'features'].includes(activeTab) ? `/api/content/sections/${id}`
                    : `/api/testimonials/${id}`;
            await axios.delete(`${API_BASE}${url}`);

            toast.success('Deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = activeTab === 'hero' ? '/api/content/hero'
                : ['collections', 'features'].includes(activeTab) ? '/api/content/sections'
                    : '/api/testimonials';
            if (editingItem) {
                await axios.put(`${API_BASE}${url}/${editingItem._id}`, formData);

                toast.success('Updated successfully');
            } else {
                await axios.post(`${API_BASE}${url}`, formData);

                toast.success('Added successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleFileUpload = async (e, field = 'image') => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        // Determine folder based on active tab
        const folder = activeTab === 'hero' ? 'hero'
            : activeTab === 'testimonials' ? 'testimonials'
                : 'content';

        uploadData.append('folder', folder);

        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE}/api/upload`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.data.url;
            setFormData(prev => ({ ...prev, [field]: url }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} size={16} fill="var(--accent)" color="var(--accent)" />);
        }
        if (hasHalfStar) {
            stars.push(<StarHalf key="half" size={16} fill="var(--accent)" color="var(--accent)" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={16} color="var(--accent)" />);
        }
        return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
    };

    return (
        <div className="content-manager">
            <div className="tabs">
                <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Hero Carousel</button>
                <button className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>Collections</button>
                <button className={activeTab === 'features' ? 'active' : ''} onClick={() => setActiveTab('features')}>Features</button>
                <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>Testimonials</button>
            </div>

            <div className="tab-content">
                <div className="action-bar">
                    <button className="btn-add" onClick={() => handleOpenModal()}><Plus size={20} /> Add {activeTab === 'hero' ? 'Slide' : activeTab === 'collections' ? 'Collection' : activeTab === 'features' ? 'Feature' : 'Testimonial'}</button>
                </div>

                {activeTab === 'hero' ? (
                    <div className="grid">
                        {heroSlides.map(slide => (
                            <div key={slide._id} className="content-card">
                                <img src={getImageUrl(slide.image)} alt="" className="card-img" />
                                <div className="card-info">
                                    <h4>{slide.title}</h4>
                                    <p>{slide.subtitle}</p>
                                    <div className="update-info" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        Updated: {formatDate(slide.updatedAt)}
                                        {slide.updatedBy && <span style={{ color: 'var(--accent)' }}> by {slide.updatedBy.username}</span>}
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => handleOpenModal(slide)}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(slide._id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (activeTab === 'collections' || activeTab === 'features') ? (
                    <div className="grid">
                        {sections
                            .filter(s => s.sectionType === (activeTab === 'collections' ? 'collection' : 'feature'))
                            .map(section => (
                                <div key={section._id} className="content-card">
                                    {section.image ? <img src={getImageUrl(section.image)} alt="" className="card-img" /> : <div className="icon-placeholder">{section.icon}</div>}
                                    <div className="card-info">
                                        <h4>{section.title} <span className="type-badge">{section.sectionType}</span></h4>
                                        <p>{section.description}</p>
                                        <div className="update-info" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                            Updated: {formatDate(section.updatedAt)}
                                            {section.updatedBy && <span style={{ color: 'var(--accent)' }}> by {section.updatedBy.username}</span>}
                                        </div>
                                        <div className="card-actions">
                                            <button onClick={() => handleOpenModal(section)}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(section._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="grid">
                        {testimonials.map(t => (
                            <div key={t._id} className="content-card testimonial-card">
                                <div className="card-info">
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div className="avatar-placeholder" style={{ width: '50px', height: '50px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>
                                            {t.avatar ? <img src={t.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : t.name[0]}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{t.name}</h4>
                                            <small style={{ color: 'var(--text-secondary)' }}>{t.location}</small>
                                        </div>
                                    </div>
                                    <p style={{ height: 'auto', WebkitLineClamp: 3 }}>"{t.text}"</p>
                                    <div className="rating" style={{ color: 'var(--accent)', margin: '1rem 0' }}>
                                        {renderStars(t.rating)}
                                    </div>
                                    <div className="update-info" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        Updated: {formatDate(t.updatedAt)}
                                        {t.updatedBy && <span style={{ color: 'var(--accent)' }}> by {t.updatedBy.username}</span>}
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => handleOpenModal(t)}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(t._id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {
                showModal && (
                    <div className="modal-overlay">
                        <div className="modal-card">
                            <div className="modal-header">
                                <h3>{editingItem ? 'Edit Item' : 'Add Item'}</h3>
                                <button className="btn-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {activeTab === 'hero' ? (
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Slide Title</label>
                                            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Subtitle</label>
                                            <input type="text" placeholder="Subtitle" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required style={{ flex: 1 }} />
                                                <label className="btn-inline" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e)} />
                                                    <Upload size={16} /> Upload
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Amazon Link</label>
                                            <input type="text" placeholder="Amazon Product/Search Link" value={formData.amazonLink} onChange={e => setFormData({ ...formData, amazonLink: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Flipkart Link</label>
                                            <input type="text" placeholder="Flipkart Product/Search Link" value={formData.flipkartLink} onChange={e => setFormData({ ...formData, flipkartLink: e.target.value })} />
                                        </div>
                                        <div className="form-group checkbox-wrapper">
                                            <label className="checkbox-label">
                                                <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                                <span>Active (Visible on Website)</span>
                                            </label>
                                        </div>
                                    </div>
                                ) : (activeTab === 'collections' || activeTab === 'features') ? (
                                    <div className="form-grid">
                                        {/* Hidden Section Type as it's determined by tab */}
                                        <input type="hidden" value={formData.sectionType} />

                                        <div className="form-group">
                                            <label>Title</label>
                                            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                        {activeTab === 'collections' ? (
                                            <>
                                                <div className="form-group">
                                                    <label>Image URL</label>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} style={{ flex: 1 }} />
                                                        <label className="btn-inline" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                                            <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e)} />
                                                            <Upload size={16} /> Upload
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Section Link</label>
                                                    <input type="text" placeholder="Link" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="form-group">
                                                <label>Icon (Emoji)</label>
                                                <input type="text" placeholder="Icon (Emoji)" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                                            </div>
                                        )}
                                        <div className="form-group full-width checkbox-wrapper">
                                            <label className="checkbox-label">
                                                <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                                <span>Active (Visible on Website)</span>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Customer Name</label>
                                            <input type="text" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input type="text" placeholder="e.g. Mumbai, India" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Review Text</label>
                                            <textarea placeholder="Write the testimonial here..." value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', height: '100px', outline: 'none' }} />
                                        </div>
                                        <div className="form-group">
                                            <label>Rating (1-5)</label>
                                            <input type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Avatar URL (Optional)</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" placeholder="Image URL" value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} style={{ flex: 1 }} />
                                                <label className="btn-inline" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                                                    <Upload size={16} /> Upload
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group full-width checkbox-wrapper">
                                            <label className="checkbox-label">
                                                <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                                <span>Active (Visible on Website)</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {editingItem && (
                                    <div className="metadata-info" style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Created: {formatDate(editingItem.createdAt)}</span>
                                            <span>Last Update: {formatDate(editingItem.updatedAt)}</span>
                                        </div>
                                        {editingItem.updatedBy && (
                                            <div style={{ marginTop: '0.5rem', color: 'var(--accent)' }}>
                                                Modified by: <strong>{editingItem.updatedBy.username}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <style>{`
                .content-manager { padding: 0; }
                .tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--border); margin-bottom: 2.5rem; }
                .tabs button { background: none; border: none; padding: 1rem 0; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; transition: 0.3s; font-size: 1.1rem; font-weight: 500; }
                .tabs button:hover { color: var(--text-primary); }
                .tabs button.active { color: var(--accent); border-bottom-color: var(--accent); }
                
                .action-bar { margin-bottom: 2.5rem; display: flex; justify-content: flex-end; }
                .btn-add { background: var(--accent); color: black; border: none; padding: 0.85rem 2rem; border-radius: 0.75rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
                .btn-add:hover { background: var(--accent-hover); transform: translateY(-2px); }

                .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
                .content-card { background: var(--card-bg); border-radius: 1.25rem; border: 1px solid var(--border); overflow: hidden; transition: 0.3s; }
                .content-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-color: rgba(212, 175, 55, 0.3); }
                .card-img { width: 100%; height: 200px; object-fit: cover; }
                .icon-placeholder { height: 200px; display: flex; align-items: center; justify-content: center; font-size: 5rem; background: rgba(255,255,255,0.02); }
                .card-info { padding: 1.5rem; }
                .card-info h4 { margin: 0 0 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 1.2rem; }
                .type-badge { font-size: 0.65rem; color: var(--accent); text-transform: uppercase; border: 1px solid var(--accent); padding: 3px 8px; border-radius: 6px; letter-spacing: 1px; }
                .card-info p { margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; height: 3em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
                .card-actions { display: flex; gap: 0.75rem; }
                .card-actions button { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .card-actions button:hover { background: var(--accent); color: black; border-color: var(--accent); }
            `}</style>


        </div >
    );
};

export default ContentManager;
