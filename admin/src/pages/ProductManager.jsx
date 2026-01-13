import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, Search, Filter, X, Upload } from 'lucide-react';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductManager = () => {

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // Ensure starting slash
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


    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        mrp: '',
        image: '',
        images: [], // Gallery
        fragrance: '',
        stock: '',
        isNew: false,
        marketplaces: [], // Dynamic marketplaces
        slug: '',
        isActive: true,
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        }
    });

    const fetchCategories = async () => {
        try {
            const response = await api.get(`/api/categories`);
            setCategories(response.data.data);
            // Set default category if creating new
            if (!editingProduct && response.data.data.length > 0) {
                setFormData(prev => ({ ...prev, category: response.data.data[0].name }));
            }
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get(`/api/products?limit=100&includeInactive=true`);

            setProducts(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            mrp: product.mrp,
            image: product.image,
            images: product.images || [],
            fragrance: product.fragrance,
            stock: product.stock,
            isNew: product.isNew,
            marketplaces: product.marketplaces || [],
            slug: product.slug || '',
            isActive: product.isActive !== undefined ? product.isActive : true,
            seo: {
                metaTitle: product.seo?.metaTitle || '',
                metaDescription: product.seo?.metaDescription || '',
                keywords: Array.isArray(product.seo?.keywords) ? product.seo.keywords.join(', ') : (product.seo?.keywords || '')
            }
        });
        setShowModal(true);
    };

    const addMarketplace = () => {
        setFormData({
            ...formData,
            marketplaces: [...formData.marketplaces, { platform: 'Amazon', url: '', isActive: true, showButton: true }]
        });
    };

    const removeMarketplace = (index) => {
        const updated = [...formData.marketplaces];
        updated.splice(index, 1);
        setFormData({ ...formData, marketplaces: updated });
    };

    const updateMarketplace = (index, field, value) => {
        const updated = [...formData.marketplaces];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, marketplaces: updated });
    };

    const addGalleryImage = () => {
        setFormData({
            ...formData,
            images: [...formData.images, { url: '', altText: '', isPrimary: false }]
        });
    };

    const removeGalleryImage = (index) => {
        const updated = [...formData.images];
        updated.splice(index, 1);
        setFormData({ ...formData, images: updated });
    };

    const updateGalleryImage = (index, field, value) => {
        const updated = [...formData.images];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, images: updated });
    };

    const handleFileUpload = async (e, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setLoading(true); // diligent loading state
            const res = await api.post(`/api/upload`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.data.url;

            if (index !== null && field === 'images') {
                // Updating gallery image
                updateGalleryImage(index, 'url', url);
            } else {
                // Updating main image
                setFormData(prev => ({ ...prev, [field]: url }));
            }
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${id}`);

                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data for submission (convert keywords string to array)
            const submissionData = {
                ...formData,
                seo: {
                    ...formData.seo,
                    keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(k => k !== '')
                }
            };

            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, submissionData);
                toast.success('Product updated');
            } else {
                await api.post(`/api/products`, submissionData);
                toast.success('Product added');
            }
            setShowModal(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manager-container">
            <div className="manager-header">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-add" onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                        name: '', description: '', category: categories[0]?.name || '', price: '', mrp: '', image: '', images: [], fragrance: '', stock: '', isNew: false,
                        marketplaces: [], slug: '', isActive: true,
                        seo: { metaTitle: '', metaDescription: '', keywords: '' }
                    });
                    setShowModal(true);
                }}>
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Platforms</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id}>
                                <td><img src={getImageUrl(product.image)} alt="" className="thumb" /></td>
                                <td>{product.name}</td>
                                <td><span className="badge">{product.category}</span></td>
                                <td>₹{product.price} <small className="mrp">₹{product.mrp}</small></td>
                                <td>
                                    <div className="platform-badges">
                                        {(product.marketplaces || []).slice(0, 2).map((m, idx) => (
                                            <span key={idx} className="platform-tag" title={m.platform}>{m.platform[0]}</span>
                                        ))}
                                        {(product.marketplaces || []).length > 2 && <span className="platform-more">+{product.marketplaces.length - 2}</span>}
                                    </div>
                                </td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-pill ${product.isActive ? 'active' : 'inactive'}`}>
                                        {product.isActive ? 'Live' : 'Hidden'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {formatDate(product.updatedAt)}
                                        {product.updatedBy && <div style={{ color: 'var(--accent)', marginTop: '2px' }}>by {product.updatedBy.username}</div>}
                                    </div>
                                </td>
                                <td className="actions">
                                    <div className="actions-wrapper">
                                        <button className="btn-icon edit" onClick={() => handleEdit(product)}><Edit2 size={16} /></button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(product._id)}><Trash2 size={16} /></button>
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
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" placeholder="e.g. Lavender Sticks" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>MRP (₹)</label>
                                    <input type="number" placeholder="0.00" value={formData.mrp} onChange={e => setFormData({ ...formData, mrp: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Main Image URL</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required />
                                        <label className="btn-inline" style={{ cursor: 'pointer', margin: 0, height: 'auto' }}>
                                            <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                                            <Upload size={16} /> Upload
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Slug (URL handle)</label>
                                    <input type="text" placeholder="e.g. lavender-sticks" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                </div>

                                <div className="form-group full-width">
                                    <div className="section-header">
                                        <label>Product Gallery</label>
                                        <button type="button" className="btn-inline" onClick={addGalleryImage}><Plus size={14} /> Add Image</button>
                                    </div>
                                    <div className="dynamic-list">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="list-item" style={{ alignItems: 'flex-start' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input type="text" placeholder="Image URL" value={img.url} onChange={e => updateGalleryImage(idx, 'url', e.target.value)} style={{ flex: 1 }} />
                                                        <label className="btn-inline" style={{ cursor: 'pointer', margin: 0, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'images', idx)} />
                                                            <Upload size={14} />
                                                        </label>
                                                    </div>
                                                    <input type="text" placeholder="Alt Text" value={img.altText} onChange={e => updateGalleryImage(idx, 'altText', e.target.value)} />
                                                </div>
                                                <button type="button" className="btn-remove" onClick={() => removeGalleryImage(idx)} style={{ marginTop: '5px' }}><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <div className="section-header">
                                        <label>Purchase Links (Marketplaces)</label>
                                        <button type="button" className="btn-inline" onClick={addMarketplace}><Plus size={14} /> Add Platform</button>
                                    </div>
                                    <div className="dynamic-list">
                                        {formData.marketplaces.map((mp, idx) => (
                                            <div key={idx} className="list-item marketplace-row">
                                                <select
                                                    value={mp.platform}
                                                    onChange={e => updateMarketplace(idx, 'platform', e.target.value)}
                                                    style={{ maxWidth: '150px', padding: '0.6rem', background: 'var(--card-bg)', color: 'white', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                                                >
                                                    <option value="Amazon">Amazon</option>
                                                    <option value="Flipkart">Flipkart</option>
                                                    <option value="Zepto">Zepto</option>
                                                    <option value="Blinkit">Blinkit</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <input type="text" placeholder="Product URL" value={mp.url} onChange={e => updateMarketplace(idx, 'url', e.target.value)} />
                                                <div className="checkbox-mini">
                                                    <input type="checkbox" checked={mp.showButton} onChange={e => updateMarketplace(idx, 'showButton', e.target.checked)} id={`show-btn-${idx}`} />
                                                    <label htmlFor={`show-btn-${idx}`}>Show Button</label>
                                                </div>
                                                <button type="button" className="btn-remove" onClick={() => removeMarketplace(idx)}><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="help-text">Check "Show Button" for the top 2-3 platforms you want featured on the product card.</p>
                                </div>

                                <div className="form-group">
                                    <label>Fragrance</label>
                                    <input type="text" placeholder="e.g. Floral" value={formData.fragrance} onChange={e => setFormData({ ...formData, fragrance: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div className="form-group checkbox-wrapper" style={{ flexDirection: 'row', gap: '2rem' }}>
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={formData.isNew} onChange={e => setFormData({ ...formData, isNew: e.target.checked })} />
                                        <span>Mark as New Arrival?</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                        <span>Show on Website?</span>
                                    </label>
                                </div>
                                <div className="form-group full-width">
                                    <label>Product Description</label>
                                    <textarea placeholder="Write a detailed description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                                </div>

                                <div className="form-section-title full-width" style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>SEO Settings</div>
                                <div className="form-group">
                                    <label>Meta Title</label>
                                    <input type="text" placeholder="SEO Title" value={formData.seo.metaTitle} onChange={e => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Keywords (comma separated)</label>
                                    <input type="text" placeholder="incense, lavender, pure" value={formData.seo.keywords} onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Meta Description</label>
                                    <textarea placeholder="Brief summary for search engines" value={formData.seo.metaDescription} onChange={e => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}></textarea>
                                </div>
                            </div>

                            {editingProduct && (
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
                                        <span>Created: {formatDate(editingProduct.createdAt)}</span>
                                        <span>Last Update: {formatDate(editingProduct.updatedAt)}</span>
                                    </div>
                                    {editingProduct.updatedBy && (
                                        <div style={{ marginTop: '0.5rem', color: 'var(--accent)' }}>
                                            Modified by: <strong>{editingProduct.updatedBy.username}</strong>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .manager-container { padding: 0; }
        .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 2rem; }
        .search-bar { flex: 1; position: relative; display: flex; align-items: center; max-width: 500px; }
        .search-bar input { width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.75rem; color: white; transition: 0.3s; }
        .search-bar input:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1); }
        .search-bar svg { position: absolute; left: 1rem; color: var(--text-secondary); }
        .btn-add { background: var(--accent); color: black; border: none; padding: 0.85rem 2rem; border-radius: 0.75rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
        .btn-add:hover { background: var(--accent-hover); transform: translateY(-2px); }
        
        .mrp { color: var(--text-secondary); text-decoration: line-through; margin-left: 0.5rem; font-size: 0.8rem; opacity: 0.6; }

        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; }
        .status-pill.active { background: rgba(52, 199, 89, 0.15); color: #34c759; }
        .status-pill.inactive { background: rgba(255, 59, 48, 0.15); color: #ff3b30; }

        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .btn-inline { background: rgba(212, 175, 55, 0.1); color: var(--accent); border: 1px solid var(--accent); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .dynamic-list { display: flex; flex-direction: column; gap: 0.5rem; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--border); }
        .list-item { display: flex; gap: 0.5rem; align-items: center; }
        .list-item input { flex: 1; padding: 0.6rem; font-size: 0.85rem; }
        .btn-remove { background: rgba(255, 59, 48, 0.1); color: #ff3b30; border: 1px solid #ff3b30; padding: 6px; border-radius: 6px; cursor: pointer; }
        .checkbox-mini { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; white-space: nowrap; color: var(--text-secondary); }
        .help-text { font-size: 0.75rem; color: var(--text-secondary); margin-top: 5px; font-style: italic; }
        .marketplace-row { flex-wrap: wrap; }
        
        .platform-badges { display: flex; gap: 4px; }
        .platform-tag { background: var(--border); color: var(--text-secondary); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid var(--border); }
        .platform-more { font-size: 10px; color: var(--accent); align-self: center; }
      `}</style>


        </div>
    );
};

export default ProductManager;
