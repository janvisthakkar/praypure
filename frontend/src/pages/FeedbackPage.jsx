import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackPage.css';

const STAR_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const FeedbackPage = () => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const [form, setForm] = useState({
        name: '',
        email: '',
        product: '',
        rating: 0,
        hoverRating: 0,
        experience: '',
        message: '',
        recommend: null,
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating) { setError('Please select a star rating.'); return; }
        setStatus('loading');
        setError('');
        try {
            await axios.post(`${API_BASE}/api/feedback`, {
                name: form.name,
                email: form.email,
                product: form.product,
                rating: form.rating,
                experience: form.experience,
                message: form.message,
                recommend: form.recommend,
                source: 'qr-box-scan',
            });
            setStatus('success');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="feedback-page">
                <div className="feedback-success">
                    <div className="success-icon">🙏</div>
                    <h2>Thank You for Your Feedback!</h2>
                    <p>Your kind words and suggestions help us bring more purity and joy to every home. We're grateful you chose Praypure.</p>
                    <a href="/" className="btn-home">Back to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-page">
            <div className="feedback-hero">
                <div className="feedback-hero-content">
                    <span className="feedback-badge">Customer Feedback</span>
                    <h1>Your Experience Matters</h1>
                    <p>Help us make every moment of prayer more pure. Share your thoughts on our products and we'll continue to serve you better.</p>
                </div>
                <div className="feedback-hero-decor">
                    <div className="fb-circle c1"></div>
                    <div className="fb-circle c2"></div>
                </div>
            </div>

            <div className="feedback-container">
                <form className="feedback-form" onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">👤</span> About You
                        </h3>
                        <div className="form-row">
                            <div className="field-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Eg. Priya Sharma"
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label>Email (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="priya@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">🫧</span> About the Product
                        </h3>
                        <div className="field-group">
                            <label>Which product are you reviewing?</label>
                            <select name="product" value={form.product} onChange={handleChange} required>
                                <option value="">Select a product...</option>
                                <option value="Incense Sticks">Incense Sticks</option>
                                <option value="Dhoop Sticks">Dhoop Sticks</option>
                                <option value="Dhoop Cones">Dhoop Cones</option>
                                <option value="Havan Cups">Havan Cups</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">⭐</span> Rate Your Experience
                        </h3>
                        <div className="star-rating-wrapper">
                            <div className="star-row">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${star <= (form.hoverRating || form.rating) ? 'filled' : ''}`}
                                        onMouseEnter={() => setForm(f => ({ ...f, hoverRating: star }))}
                                        onMouseLeave={() => setForm(f => ({ ...f, hoverRating: 0 }))}
                                        onClick={() => setForm(f => ({ ...f, rating: star }))}
                                        aria-label={`Rate ${star} star`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {(form.hoverRating || form.rating) > 0 && (
                                <span className="star-label">{STAR_LABELS[(form.hoverRating || form.rating) - 1]}</span>
                            )}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">💬</span> Tell Us More
                        </h3>
                        <div className="field-group">
                            <label>Describe your experience</label>
                            <div className="experience-chips">
                                {['Amazing fragrance', 'Long lasting', 'Great packaging', 'Fast delivery', 'Value for money', 'Natural and pure'].map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        className={`chip ${form.experience === chip ? 'selected' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, experience: f.experience === chip ? '' : chip }))}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="field-group">
                            <label>Additional Comments</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Share anything you'd like us to know — we read every word!"
                                rows={4}
                                maxLength={500}
                            />
                            <span className="char-count">{form.message.length}/500</span>
                        </div>
                    </div>

                    {/* Recommend */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-icon">🤝</span> Would You Recommend Us?
                        </h3>
                        <div className="recommend-row">
                            {['Yes, absolutely!', 'Maybe', 'Not this time'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    className={`recommend-btn ${form.recommend === opt ? 'selected' : ''}`}
                                    onClick={() => setForm(f => ({ ...f, recommend: opt }))}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="feedback-error">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Submitting...' : '🙏 Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
