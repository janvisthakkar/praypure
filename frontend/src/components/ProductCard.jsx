import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
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
                    <div className="product-links">
                        {(product.marketplaces || [])
                            .filter(mp => mp.showButton !== false)
                            .slice(0, 2)
                            .map((mp, idx) => (
                                <a
                                    key={idx}
                                    href={mp.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`btn btn-sm ${idx === 0 ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    {mp.platform}
                                </a>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
