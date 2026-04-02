import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ImpactPage.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Impact counter data (static — update these as your real numbers grow)
const IMPACT_STATS = [
    { label: 'Families Supported', target: 150, suffix: '+' },
    { label: 'Temple Donations', target: 25, suffix: '+' },
    { label: 'Communities Touched', target: 10, suffix: '+' },
    { label: 'Lives Impacted', target: 500, suffix: '+' },
];

// Hook: Intersection Observer for scroll-reveal
const useRevealOnScroll = () => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = ref.current?.querySelectorAll('.impact-reveal');
        elements?.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return ref;
};

// Hook: Animated counter
const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    const start = useCallback(() => {
        if (started) return;
        setStarted(true);
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration, started]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) start();
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [start]);

    return { count, ref };
};

// Counter Item component
const CounterItem = ({ label, target, suffix }) => {
    const { count, ref } = useCountUp(target);
    return (
        <div className="impact-counter-item" ref={ref}>
            <div className="impact-counter-number">
                {count}{suffix}
            </div>
            <div className="impact-counter-label">{label}</div>
        </div>
    );
};

const ImpactPage = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const pageRef = useRevealOnScroll();

    useEffect(() => {
        const fetchImpact = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/impact`);
                if (res.data.success) {
                    setGalleryItems(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch impact items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImpact();
    }, []);

    const handleScrollDown = () => {
        const storySection = document.getElementById('impact-story');
        if (storySection) {
            storySection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="impact-page" ref={pageRef}>

            {/* ===== SECTION 1: HERO ===== */}
            <section className="impact-hero" id="impact-hero">
                <div className="impact-hero-content">
                    <div className="impact-hero-badge">Your Prayer Creates Change</div>
                    <h1>
                        Every Flame Lights
                        <span>A Life Beyond Yours</span>
                    </h1>
                    <p className="impact-hero-sub">
                        When you chose PrayPure, you chose more than fragrance.
                        You chose to be part of a ripple of kindness — reaching families,
                        temples, and communities across India.
                    </p>
                </div>
                <div className="impact-scroll-indicator" onClick={handleScrollDown}>
                    <span>Discover Our Impact</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </section>

            {/* ===== SECTION 2: INTRO STORY ===== */}
            <section className="impact-story section" id="impact-story">
                <div className="container">
                    <div className="impact-story-inner impact-reveal">
                        <h2>From Sacred Smoke to Selfless Service</h2>
                        <div className="impact-story-divider"></div>
                        <p>
                            Incense has always been a bridge between the earthly and the divine.
                            At PrayPure, we believe that the same sacred energy that purifies
                            your home should also purify the world around you.
                        </p>
                        <p>
                            That's why a portion of every PrayPure purchase goes directly toward
                            uplifting the lives of those who need it most — from supporting
                            underprivileged families to preserving the temples that keep our
                            traditions alive.
                        </p>
                        <p>
                            Your daily ritual becomes a quiet act of seva — a selfless service
                            that echoes far beyond your prayer room.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 3: OUR CAUSE ===== */}
            <section className="impact-cause section">
                <div className="container">
                    <div className="impact-cause-inner impact-reveal">
                        <h2>What Your Purchase Supports</h2>
                        <div className="impact-cause-cards">
                            <div className="impact-cause-card">
                                <div className="cause-icon">🙏</div>
                                <h3>Temple Preservation</h3>
                                <p>
                                    We contribute to the upkeep and restoration of local temples,
                                    ensuring sacred spaces remain alive for generations to come.
                                </p>
                            </div>
                            <div className="impact-cause-card">
                                <div className="cause-icon">👨‍👩‍👧‍👦</div>
                                <h3>Community Welfare</h3>
                                <p>
                                    From distributing essentials to supporting education initiatives,
                                    we invest in the communities that surround us.
                                </p>
                            </div>
                            <div className="impact-cause-card">
                                <div className="cause-icon">🙏</div>
                                <h3>Donation Drives</h3>
                                <p>
                                    Regular donation drives bring food, clothing, and hope
                                    to underprivileged families across Gujarat and beyond.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 4: IMPACT COUNTERS ===== */}
            <section className="impact-counters section">
                <div className="container">
                    <div className="impact-reveal">
                        <h2>Our Impact in Numbers</h2>
                        <div className="impact-counters-grid">
                            {IMPACT_STATS.map((stat, index) => (
                                <CounterItem
                                    key={index}
                                    label={stat.label}
                                    target={stat.target}
                                    suffix={stat.suffix}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 5: GALLERY (Dynamic from API) ===== */}
            <section className="impact-gallery section">
                <div className="container">
                    <div className="impact-reveal">
                        <h2>Moments of Impact</h2>
                        <p className="impact-gallery-subtitle">
                            Real stories, real people, real change — powered by your trust in PrayPure.
                        </p>

                        {loading ? (
                            <div className="impact-gallery-grid">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="impact-gallery-item skeleton" style={{ height: `${200 + (i % 3) * 80}px`, borderRadius: '12px' }}></div>
                                ))}
                            </div>
                        ) : galleryItems.length > 0 ? (
                            <div className="impact-gallery-grid">
                                {galleryItems.map((item) => (
                                    <div className="impact-gallery-item" key={item._id}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                        <span className="impact-gallery-badge">{item.category}</span>
                                        <div className="impact-gallery-overlay">
                                            <h4>{item.title}</h4>
                                            {item.description && <p>{item.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="impact-gallery-empty">
                                <div className="empty-icon">📸</div>
                                <p>Our impact gallery is being prepared. Check back soon to see the change your purchases are creating.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 6: VIDEO ===== */}
            <section className="impact-video section">
                <div className="container">
                    <div className="impact-reveal">
                        <h2>See The Impact</h2>
                        <div className="impact-video-embed">
                            <div className="play-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            </div>
                            <span>Video coming soon</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 7: BRAND PROMISE ===== */}
            <section className="impact-promise section">
                <div className="container">
                    <div className="impact-reveal">
                        <div className="impact-promise-card">
                            <div className="impact-promise-icon">🙏</div>
                            <h2>Every Purchase is a Prayer for Others</h2>
                            <p>
                                When you light a PrayPure dhoop stick, you're not just filling
                                your space with sacred fragrance — you're contributing to a
                                movement that uplifts communities and preserves our heritage.
                            </p>
                            <p>
                                We believe in full transparency. Every contribution is documented,
                                every impact is real, and every rupee makes a difference.
                            </p>
                            <p>
                                <strong>Your devotion. Our commitment. Their brighter tomorrow.</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 8: CTA ===== */}
            <section className="impact-cta section">
                <div className="container">
                    <div className="impact-reveal">
                        <h2>Be Part of the Journey</h2>
                        <p>
                            Every PrayPure product carries a piece of purpose.
                            Continue your spiritual practice, and let your prayers
                            reach further than ever before.
                        </p>
                        <a
                            href="https://www.amazon.in/s?k=praypure"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Shop with Purpose
                        </a>
                        <div className="impact-cta-links">
                            <Link to="/about">Learn About Us</Link>
                            <Link to="/contact">Get In Touch</Link>
                            <a
                                href="https://www.instagram.com/praypure.in"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Follow Our Journey
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpactPage;
