import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './Offers.css';

const Offers = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [offers, setOffers] = useState([]);

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/content/offers`);
                if (response.data.success) {
                    setOffers(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching offers:', error);
                // Fallback or leave empty
            }
        };
        fetchOffers();
    }, []);

    const spinWheel = () => {
        if (spinning || offers.length === 0) return;

        setSpinning(true);
        setResult(null);

        // 1. Select a random winner index immediately
        const winnerIndex = Math.floor(Math.random() * offers.length);

        // 2. Calculate the rotation needed to land this winner at the top (Pointer)
        // Assumption: CSS 0deg = 3 o'clock. Seg 0 is [0, 60] (Center 30). Pointer is 270 (12 o'clock).
        // Target Angle for Seg 0 Center = 270.
        // Required Rotation = 270 - 30 = 240 deg.
        // For Seg 'i': Target = 240 - (i * segmentAngle).

        const segmentAngle = 360 / offers.length;
        // Adding some random jitter within the segment (-40% to +40% of segment width)
        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;

        const targetRotation = 240 - (winnerIndex * segmentAngle) + randomOffset;

        // Ensure we always spin forward by adding multiples of 360
        // We want at least 5 spins (1800 deg)
        const minSpins = 5 * 360;
        const currentRotationMod = rotation % 360;

        // Calculate adjustments to reach target smoothy from current position
        let adjustment = targetRotation - currentRotationMod;
        if (adjustment < 0) adjustment += 360; // Ensure positive forward movement

        const newRotation = rotation + minSpins + adjustment;

        setRotation(newRotation);

        setTimeout(() => {
            setSpinning(false);
            setResult(offers[winnerIndex]); // Result is guaranteed to match the angle

            // Trigger Confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 2000, // Ensure it's above the modal overlay
                colors: ['#D4AF37', '#8B4513', '#FFF5E1', '#ffffff'] // Gold, Brown, Cream, White
            });
        }, 3000);
    };

    const closePopup = () => {
        setResult(null);
    };

    if (offers.length === 0) return <div className="loading">Loading Offers...</div>;

    return (
        <div className="offers-page">
            <div className="container">
                <h1 className="page-title">Exclusive Offers</h1>
                <p className="page-subtitle">Spin the wheel to win exciting rewards!</p>

                <div className="wheel-container">
                    <div className="wheel-pointer"></div>
                    <div
                        className="wheel"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {offers.map((offer, index) => (
                            <div
                                key={offer._id || index}
                                className="wheel-segment"
                                style={{ transform: `rotate(${index * (360 / offers.length)}deg) skewY(-30deg)` }}
                            >
                                <span className="segment-text">{offer.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="spin-btn"
                    onClick={spinWheel}
                    disabled={spinning}
                >
                    {spinning ? 'Spinning...' : 'SPIN NOW'}
                </button>

                {result && (
                    <div className="modal-overlay" onClick={closePopup}>
                        <div className="result-popup" onClick={(e) => e.stopPropagation()}>
                            <h3>Congratulations!</h3>
                            <p>You won: <strong>{result.label}</strong></p>
                            <p className="small-text">
                                Use code: <strong>{result.couponCode || `PRAYPURE${Math.floor(Math.random() * 1000)}`}</strong>
                            </p>
                            <br />
                            <button className="close-btn" onClick={closePopup}>Claim Offer</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Offers;
