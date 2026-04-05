import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Module-level cache — persists across component remounts within the same session
const pageCache = {};
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './ProductCategory.css';

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState(['All']);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ title: '', subtitle: '', status: 'Live' });

    // Notify Me state
    const [notifyEmail, setNotifyEmail] = useState('');
    const [notifyStatus, setNotifyStatus] = useState('idle'); // idle | loading | success | error | exists
    const [notifyMsg, setNotifyMsg] = useState('');

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Reset state when slug changes
    React.useEffect(() => {
        setProducts([]);
        setFilters(['All']);
        setFilter('All');
        setLoading(true);
        setNotifyStatus('idle');
        setNotifyEmail('');
    }, [slug]);

    React.useEffect(() => {
        // Cache hit — restore immediately without any loading flicker
        if (pageCache[slug]) {
            const cached = pageCache[slug];
            setPageData(cached.pageData);
            setProducts(cached.products);
            setFilters(cached.filters);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const catRes = await axios.get(`${API_BASE}/api/categories`);
                const currentCat = catRes.data.data?.find(c => c.slug === slug);

                if (currentCat) {
                    const categoryName = currentCat.name;
                    const newPageData = {
                        title: currentCat.title,
                        subtitle: currentCat.subtitle,
                        image: currentCat.image,
                        status: currentCat.status || 'Live'
                    };
                    setPageData(newPageData);

                    let newProducts = [];
                    let newFilters = ['All'];

                    if ((currentCat.status || 'Live') === 'Live') {
                        const productRes = await axios.get(`${API_BASE}/api/products?category=${encodeURIComponent(categoryName)}`);
                        newProducts = productRes.data.data || [];
                        setProducts(newProducts);

                        const filterRes = await axios.get(`${API_BASE}/api/products/fragrances?category=${encodeURIComponent(categoryName)}`);
                        if (filterRes.data.success) {
                            newFilters = ['All', ...filterRes.data.data];
                            setFilters(newFilters);
                        }
                    }

                    // Store in cache for instant re-visits this session
                    pageCache[slug] = { pageData: newPageData, products: newProducts, filters: newFilters };
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, API_BASE]);

    const handleNotifyMe = async (e) => {
        e.preventDefault();
        if (!notifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
            setNotifyStatus('error');
            setNotifyMsg('Please enter a valid email address.');
            return;
        }
        setNotifyStatus('loading');
        try {
            await axios.post(`${API_BASE}/api/subscribers`, {
                email: notifyEmail,
                source: `coming-soon-${slug}`,
            });
            setNotifyStatus('success');
            setNotifyMsg("You're on the list! We'll let you know when it launches. 🙏");
        } catch (err) {
            const msg = err.response?.data?.message || '';
            if (msg.toLowerCase().includes('already')) {
                setNotifyStatus('exists');
                setNotifyMsg("You're already on the list! We'll notify you when it's ready.");
            } else {
                setNotifyStatus('error');
                setNotifyMsg('Something went wrong. Please try again later.');
            }
        }
    };

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.fragrance === filter);

    return (
        <div className="product-category-page">
            <section className="category-header-section" style={pageData.image ? { backgroundImage: `url(${pageData.image})` } : {}}>
                <div className="container">
                    <h1 className="page-title">{pageData.title}</h1>
                    <p className="page-subtitle">{pageData.subtitle}</p>
                </div>
            </section>

            <div className="container product-layout">
                {pageData.status === 'Coming Soon' ? (
                    <div className="coming-soon-container full-width">
                        <div className="coming-soon-banner">
                            {/* Left decorative panel */}
                            <div className="coming-soon-visual">
                                <div className="cs-float-orb orb-1"></div>
                                <div className="cs-float-orb orb-2"></div>
                                <div className="cs-float-orb orb-3"></div>
                                <div className="cs-diya-icon">🪔</div>
                                <div className="cs-scent-trail">
                                    <div className="scent s1"></div>
                                    <div className="scent s2"></div>
                                    <div className="scent s3"></div>
                                </div>
                            </div>

                            {/* Right content */}
                            <div className="coming-soon-content">
                                <span className="coming-soon-badge">
                                    <span className="badge-dot"></span>
                                    Launching Soon
                                </span>
                                <h2>Something Sacred is on its Way</h2>
                                <p>
                                    Our artisans are carefully crafting the finest <strong>{pageData.title}</strong>
                                    &nbsp;— blending ancient traditions with the purest ingredients. Each piece is made with love and intention.
                                </p>

                                <div className="stay-tuned">
                                    <div className="pulse-dot"></div>
                                    <span>Handcrafted with devotion • Preparing with Love</span>
                                </div>

                                {notifyStatus === 'success' || notifyStatus === 'exists' ? (
                                    <div className="notify-success-msg">
                                        <span className="notify-check">✓</span>
                                        {notifyMsg}
                                    </div>
                                ) : (
                                    <form className="notify-form" onSubmit={handleNotifyMe}>
                                        <div className="notify-input-group">
                                            <input
                                                type="email"
                                                placeholder="Enter your email to get notified"
                                                value={notifyEmail}
                                                onChange={e => { setNotifyEmail(e.target.value); setNotifyStatus('idle'); }}
                                                className={notifyStatus === 'error' ? 'notify-input error' : 'notify-input'}
                                                disabled={notifyStatus === 'loading'}
                                            />
                                            <button
                                                type="submit"
                                                className="notify-btn"
                                                disabled={notifyStatus === 'loading'}
                                            >
                                                {notifyStatus === 'loading' ? '...' : 'Notify Me 🔔'}
                                            </button>
                                        </div>
                                        {notifyStatus === 'error' && (
                                            <p className="notify-error">{notifyMsg}</p>
                                        )}
                                        <p className="notify-note">No spam, ever. Unsubscribe anytime.</p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Mobile Dropdown Filter */}
                        <select
                            className="mobile-filter-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {filters.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>

                        {/* Desktop Sidebar Filter */}
                        <aside className="filters-sidebar">
                            <h3 className="filter-title">Fragrances</h3>
                            <div className="filter-list">
                                {filters.map(f => (
                                    <button
                                        key={f}
                                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                                        onClick={() => setFilter(f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <main className="products-grid-container">
                            {loading ? (
                                <Loader />
                            ) : filteredProducts.length > 0 ? (
                                <div className="products-grid">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products-message">
                                    <h3>No items available</h3>
                                    <p>We couldn't find any {pageData.title} matching your selection.</p>
                                </div>
                            )}
                        </main>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
