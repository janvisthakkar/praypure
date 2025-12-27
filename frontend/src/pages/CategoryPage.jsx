import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './ProductCategory.css';

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState(['All']);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ title: '', subtitle: '' });

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Reset state when slug changes
    useEffect(() => {
        setProducts([]);
        setFilters(['All']);
        setFilter('All');
        setLoading(true);
    }, [slug]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch dynamic category info using slug
                const catRes = await axios.get(`${API_BASE}/api/categories`);
                const currentCat = catRes.data.data?.find(c => c.slug === slug);

                if (currentCat) {
                    const categoryName = currentCat.name;
                    setPageData({
                        title: currentCat.title,
                        subtitle: currentCat.subtitle,
                        image: currentCat.image
                    });

                    // Fetch products using the internal name
                    const productRes = await axios.get(`${API_BASE}/api/products?category=${encodeURIComponent(categoryName)}`);
                    setProducts(productRes.data.data || []);

                    // Fetch filters dynamically
                    const filterRes = await axios.get(`${API_BASE}/api/products/fragrances?category=${encodeURIComponent(categoryName)}`);
                    if (filterRes.data.success) {
                        setFilters(['All', ...filterRes.data.data]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, API_BASE]);

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
                    <h3 className="filter-title">Categories</h3>
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
            </div>
        </div>
    );
};

export default CategoryPage;
