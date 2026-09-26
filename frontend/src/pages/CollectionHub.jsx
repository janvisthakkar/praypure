import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { SHOP_FAMILIES } from '../data/shop';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './CollectionHub.css';
import './ProductCategory.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CollectionHub = ({ familyKey }) => {
    const family = SHOP_FAMILIES.find((item) => item.key === familyKey);
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!family) return;
        setFilter('All');
        setLoading(true);

        const load = async () => {
            try {
                const prodRes = await axios.get(`${API_BASE}/api/products?limit=100`);
                const names = new Set(family.lines.map((line) => line.name));
                setProducts((prodRes.data.data || []).filter((product) => names.has(product.category)));
            } catch (error) {
                console.error('Error fetching collection:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [familyKey]);

    if (!family) return null;

    const sidebarItems = [
        { key: 'All', label: 'All' },
        ...family.lines.map((line) => ({
            key: line.name,
            label: `${line.label} · ${line.pack}`,
        })),
    ];

    const filteredProducts = filter === 'All'
        ? products
        : products.filter((product) => product.category === filter);

    return (
        <div className="collection-hub product-category-page">
            <Helmet>
                <title>{family.title} | Praypure</title>
                <meta name="description" content={family.description} />
            </Helmet>
            <section className="hub-header">
                <div className="container">
                    <p className="hub-kicker">Praypure collection</p>
                    <h1>{family.title}</h1>
                    <p>{family.description}</p>
                </div>
            </section>
            <div className="container product-layout">
                <select
                    className="mobile-filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    {sidebarItems.map((item) => (
                        <option key={item.key} value={item.key}>{item.label}</option>
                    ))}
                </select>

                <aside className="filters-sidebar">
                    <h3 className="filter-title">Packs</h3>
                    <div className="filter-list">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.key}
                                className={`filter-btn ${filter === item.key ? 'active' : ''}`}
                                onClick={() => setFilter(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>

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
                            <p>We could not find products in this collection yet.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CollectionHub;
