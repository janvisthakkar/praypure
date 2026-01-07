import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { FaAmazon, FaShoppingBag, FaBolt, FaMotorcycle, FaExternalLinkAlt } from 'react-icons/fa';
// Note: React Icons includes FontAwesome (fa). Using generic icons mapped to brands for reliability if specific brand icons (Si...) aren't installed.
// However, SiAmazon, SiFlipkart, SiZepto exist in 'react-icons/si' (Simple Icons).
// Let's try to use standard FA icons for broad compatibility as user env might lack full SI set or tree-shaking might vary.
// Amazon -> FaAmazon (Exists)
// Flipkart -> FaShoppingBag (Generic fallback) or SiFlipkart if we trust the env.
// Zepto -> FaBolt (Zap)
// Blinkit -> FaMotorcycle (Delivery)

// If the user wants "Logo Emojis", using exact SVGs from react-icons is best.
import { SiFlipkart, SiAmazon } from 'react-icons/si';
// If SiFlipkart causes issues (not in older versions), we fallback. But let's try standard imports first or stick to FA.
// To be safe and avoid "module not found" if they only have fa/md installed, I will stick to FontAwesome for now unless I confirmed package.json has 'react-icons' (it does, ^5.5.0 which is new).
// So 'si' should be there.

// Let's use a safe mix.
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { settings } = useSettings();
    const showPrice = !settings?.hidePrices;

    // Helper to get icon based on platform name
    const getPlatformIcon = (platform) => {
        const p = platform.toLowerCase();
        if (p.includes('amazon')) return <FaAmazon size={24} title="Amazon" color="#FF9900" />;
        if (p.includes('flipkart')) return <FaShoppingBag size={24} title="Flipkart" color="#2874F0" />; // Fallback since SiFlipkart might be tricky
        if (p.includes('zepto')) return <FaBolt size={24} title="Zepto" color="#5B2D92" />;
        if (p.includes('blinkit')) return <FaMotorcycle size={24} title="Blinkit" color="#F8CB46" />;
        return <FaExternalLinkAlt size={20} title={platform} />;
    };

    return (
        <div className="product-card">
            <div className="product-image">
                {product.images?.length > 0 || product.image ? (
                    <img
                        src={product.images?.length > 0 ? product.images[0].url : product.image}
                        alt={product.images?.length > 0 ? product.images[0].altText || product.name : product.name}
                    />
                ) : (
                    <div className="placeholder-image">Product Image</div>
                )}
                {product.isNew && <span className="badge new">New</span>}
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                    {/* Conditionally Render Price */}
                    {showPrice ? (
                        <div className="price-container">
                            <span className="product-price">₹{product.price}</span>
                            {product.mrp && product.mrp > product.price && (
                                <span className="mrp-group">
                                    <span className="product-mrp">₹{product.mrp}</span>
                                    <span className="discount-text">
                                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                    </span>
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="price-container" style={{ visibility: 'hidden', height: '20px' }}>
                            {/* Hidden but occupies space for alignment */}
                        </div>
                    )}

                    <div className="product-links" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {(product.marketplaces || [])
                            .filter(mp => mp.showButton !== false)
                            .slice(0, 3)
                            .map((mp, idx) => (
                                <a
                                    key={idx}
                                    href={mp.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-icon-link"
                                    style={{
                                        textDecoration: 'none',
                                        transition: 'transform 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {getPlatformIcon(mp.platform)}
                                </a>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
