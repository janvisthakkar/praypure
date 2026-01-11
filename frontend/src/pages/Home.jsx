import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import HeroCarousel from '../components/HeroCarousel';
import TestimonialCarousel from '../components/TestimonialCarousel';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import './Home.css';

const FALLBACK_IMAGES = [
    {
        id: 'fb1',
        media_url: '/assets/images/collection_dhoop_sticks_1764862353813.png',
        permalink: 'https://www.instagram.com/praypure/',
        caption: 'Pure Dhoop Sticks for your daily prayers',
        media_type: 'IMAGE'
    },
    {
        id: 'fb2',
        media_url: '/assets/images/collection_incense_sticks_1764862333586.png',
        permalink: 'https://www.instagram.com/praypure/',
        caption: 'Handcrafted Incense Sticks',
        media_type: 'IMAGE'
    },
    {
        id: 'fb3',
        media_url: '/assets/images/collection_havan_cups_1764862408665.png',
        permalink: 'https://www.instagram.com/praypure/',
        caption: 'Traditional Havan Cups',
        media_type: 'IMAGE'
    },
    {
        id: 'fb4',
        media_url: '/assets/images/collection_dhoop_cones_1764862379070.png',
        permalink: 'https://www.instagram.com/praypure/',
        caption: 'Natural Dhoop Cones',
        media_type: 'IMAGE'
    }
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const [instagramImages, setInstagramImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collectionSections, setCollectionSections] = useState([]);
    const [featureSections, setFeatureSections] = useState([]);

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [instaRes, prodRes, sectRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/content/instagram`).catch(() => ({ data: { success: false } })),
                    axios.get(`${API_BASE}/api/products`).catch(() => ({ data: { success: false } })),
                    axios.get(`${API_BASE}/api/content/sections`).catch(() => ({ data: { success: false } }))
                ]);

                // Handle Instagram
                if (instaRes.data.success && instaRes.data.data.length > 0) {
                    setInstagramImages(instaRes.data.data);
                } else {
                    setInstagramImages(FALLBACK_IMAGES);
                }

                // Handle Products
                setProducts(prodRes.data.data || []);

                // Handle Sections
                if (sectRes.data.success) {
                    const sections = sectRes.data.data;
                    setCollectionSections(sections.filter(s => s.sectionType === 'collection'));
                    setFeatureSections(sections.filter(s => s.sectionType === 'feature'));
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleSubscribe = async (e) => {
        e.preventDefault();
        setSubscribing(true);
        try {
            await axios.post(`${API_BASE}/api/subscribers`, { email });
            toast.success('Thank you for subscribing! We will keep you updated.');
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
        } finally {
            setSubscribing(false);
        }
    };

    const latestProducts = products.filter(p => p.isNew).slice(0, 4);

    return (
        <div className="home">
            <HeroCarousel />

            {/* Our Collection */}
            {collectionSections.length > 0 && (
                <section className="section our-collection">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Our Collection</h2>
                            <p className="section-subtitle">Discover our range of premium spiritual products</p>
                        </div>
                        <div className="collection-grid">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div className="collection-card skeleton" key={i} style={{ height: '400px', borderRadius: '12px' }}></div>
                                ))
                            ) : (
                                collectionSections.map((section) => (
                                    <div className="collection-card" key={section._id}>
                                        <div className="card-image">
                                            <img src={section.image} alt={section.title} className="collection-img" loading="lazy" />
                                        </div>
                                        <div className="card-content">
                                            <h3>{section.title}</h3>
                                            <p>{section.description}</p>
                                            <Link to={section.link} className="btn btn-secondary">Explore</Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </section>
            )}

            {/* Why Us */}
            {featureSections.length > 0 && (
                <section className="section why-us">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Why Choose Praypure?</h2>
                            <p className="section-subtitle">Quality, purity, and tradition in every product</p>
                        </div>
                        <div className="features-grid">
                            {featureSections.map((feature) => (
                                <div className="feature-card" key={feature._id}>
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Arrivals */}
            {latestProducts.length > 0 && (
                <section className="section latest-arrivals">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Latest Arrivals</h2>
                            <p className="section-subtitle">New additions to our collection</p>
                        </div>
                        <div className="products-grid">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div className="product-card skeleton" key={i} style={{ height: '450px', borderRadius: '12px' }}></div>
                                ))
                            ) : (
                                latestProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            )}
                        </div>

                    </div>
                </section>
            )}

            {/* Testimonials */}
            <TestimonialCarousel />

            {/* Glimpses */}
            <section className="section glimpses">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Glimpses of Praypure</h2>
                        <p className="section-subtitle">Follow us on Instagram for more updates</p>
                    </div>
                    <div className="gallery-grid">
                        {instagramImages.map((img, index) => (
                            <a
                                key={img.id}
                                href={img.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`gallery-item ${index === 0 ? 'large' : ''}`}
                            >
                                <img
                                    src={img.media_type === 'VIDEO' ? img.thumbnail_url : img.media_url}
                                    alt={img.caption || 'Praypure Instagram'}
                                    className="gallery-img"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                                <div className="gallery-overlay">
                                    <span className="instagram-icon">📷</span>
                                    {index === 0 && <span>View on Instagram</span>}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscribe */}
            <section className="section subscribe">
                <div className="container">
                    <div className="subscribe-box">
                        <h2>Stay Connected</h2>
                        <p>Subscribe to get updates on new products and exclusive offers</p>
                        <form className="subscribe-form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={subscribing}
                            >
                                {subscribing ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        <p className="subscribe-note">We respect your privacy. Unsubscribe at any time.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
