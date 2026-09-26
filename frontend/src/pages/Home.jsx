import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';
import HeroCarousel from '../components/HeroCarousel';
import TestimonialCarousel from '../components/TestimonialCarousel';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { SHOP_FAMILIES } from '../data/shop';
import { HOME_SEO, HOME_FAQS } from '../data/seo';
import './Home.css';

const FALLBACK_IMAGES = [
    {
        id: 'fb1',
        media_url: '/assets/images/collection_dhoop_sticks_1764862353813.webp',
        permalink: 'https://www.instagram.com/praypure.in/',
        caption: 'Pure Dhoop Sticks for your daily prayers',
        media_type: 'IMAGE'
    },
    {
        id: 'fb2',
        media_url: '/assets/images/collection_incense_sticks_1764862333586.webp',
        permalink: 'https://www.instagram.com/praypure.in/',
        caption: 'Handcrafted Incense Sticks',
        media_type: 'IMAGE'
    },
    {
        id: 'fb3',
        media_url: '/assets/images/collection_havan_cups_1764862408665.webp',
        permalink: 'https://www.instagram.com/praypure.in/',
        caption: 'Traditional Havan Cups',
        media_type: 'IMAGE'
    },
    {
        id: 'fb4',
        media_url: '/assets/images/collection_dhoop_cones_1764862379070.webp',
        permalink: 'https://www.instagram.com/praypure.in/',
        caption: 'Natural Dhoop Cones',
        media_type: 'IMAGE'
    }
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const [instagramImages, setInstagramImages] = useState(FALLBACK_IMAGES);
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
                    axios.get(`${API_BASE}/api/products?limit=8`).catch(() => ({ data: { success: false } })),
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

    const latestProducts = products
        .filter((p) => p.sku && p.isNew && (p.image || p.images?.length))
        .slice(0, 4);

    const familyCards = SHOP_FAMILIES.map((family) => {
        const match = collectionSections.find((section) => family.slugs.some((slug) => section.link === `/${slug}`));
        return {
            ...family,
            image: match?.image || family.image,
        };
    });

    return (
        <div className="home">
            <Helmet>
                <title>{HOME_SEO.title}</title>
                <meta name="description" content={HOME_SEO.description} />
                <link rel="canonical" href="https://www.praypure.com/" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: HOME_FAQS.map((item) => ({
                            '@type': 'Question',
                            name: item.question,
                            acceptedAnswer: { '@type': 'Answer', text: item.answer },
                        })),
                    })}
                </script>
            </Helmet>
            <HeroCarousel />

            {/* Our Collection */}
            <section className="section our-collection">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by collection</h2>
                        <p className="section-subtitle">Praypure agarbatti and dhoop sticks are made with gomay, pure desi cow dung, and no charcoal. Choose incense sticks, dhup, or cup boxes.</p>
                    </div>
                    <div className="collection-grid">
                        {familyCards.map((family) => (
                            <Link to={family.href} className="collection-card" key={family.key}>
                                <div className="card-image">
                                    {family.image ? (
                                        <img src={family.image} alt={`${family.seoTitle || family.title} by Praypure`} className="collection-img" loading="lazy" />
                                    ) : (
                                        <div className="collection-placeholder">{family.title}</div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3>{family.title}</h3>
                                    <p>{family.description}</p>
                                    <span className="btn btn-secondary">Explore</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

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
                        <div className="home-products-grid">
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

            <section className="section home-faq">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Gomay agarbatti, explained</h2>
                        <p className="section-subtitle">The incense people also search for as agarbatti, dhup, and cow dung sticks.</p>
                    </div>
                    <div className="faq-list">
                        {HOME_FAQS.map((item) => (
                            <details key={item.question} className="faq-item">
                                <summary>{item.question}</summary>
                                <p>{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <TestimonialCarousel />

            {/* Glimpses */}
            <section className="section glimpses">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Glimpses of Praypure</h2>
                        <p className="section-subtitle">
                            Follow us on Instagram for more updates<br/>
                            <a href="https://www.instagram.com/praypure.in" target="_blank" rel="noopener noreferrer" className="glimpses-cta" style={{marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: 'black', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: '0.3s'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                @praypure.in
                            </a>
                        </p>
                    </div>
                    <div className="gallery-grid">
                        {instagramImages.map((img, index) => (
                            <a
                                key={img.id || img._id}
                                href={img.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`gallery-item ${index === 0 ? 'large' : ''}`}
                            >
                                <img
                                    src={img.media_type === 'VIDEO' ? (img.thumbnail_url || img.media_url) : img.media_url}
                                    alt={img.caption || 'Praypure Instagram'}
                                    className="gallery-img"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                                <div className="gallery-insta-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                </div>
                                <div className="gallery-overlay">
                                    <svg className="instagram-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                    <span className="gallery-caption">{img.caption ? (img.caption.length > 60 ? img.caption.substring(0, 60) + '...' : img.caption) : 'View on Instagram'}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Banner */}
            <section className="section" style={{
                background: 'linear-gradient(135deg, var(--color-dark-brown) 0%, #2C1810 100%)',
                padding: '48px 16px',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <p style={{
                        color: 'var(--color-golden)',
                        fontSize: '13px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        fontWeight: 500
                    }}>Purpose Beyond Fragrance</p>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)',
                        color: 'white',
                        fontSize: '28px',
                        marginBottom: '16px',
                        lineHeight: 1.3
                    }}>Every Purchase Creates Impact</h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '15px',
                        lineHeight: 1.7,
                        marginBottom: '24px'
                    }}>A portion of every PrayPure sale goes toward temple preservation, community welfare, and spreading kindness.</p>
                    <Link to="/impact" className="btn btn-primary" style={{
                        background: 'var(--color-golden)',
                        color: 'var(--color-dark-brown)',
                        fontWeight: 600
                    }}>See Our Impact →</Link>
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
