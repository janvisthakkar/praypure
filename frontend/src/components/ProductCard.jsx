import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AMAZON_SHOP, FLIPKART_SHOP } from '../data/shop';
import './ProductCard.css';

const FALLBACK_SHOPS = [
    { platform: 'Amazon', url: AMAZON_SHOP },
    { platform: 'Flipkart', url: FLIPKART_SHOP },
];

const displayName = (product) => {
    if (product.fragrance) return product.fragrance;
    return (product.name || '').replace(/\s*·\s*.+$/, '').trim();
};

const ProductCard = ({ product }) => {
    const image = product.images?.find((img) => img.url)?.url || product.image;
    const shopLinks = (product.marketplaces || [])
        .filter((mp) => mp.showButton !== false && mp.url)
        .slice(0, 2);
    const isSoon = (product.sku || '').startsWith('PP-SOON') || product.category === 'Launching Soon';
    const buttons = isSoon ? [] : (shopLinks.length ? shopLinks : FALLBACK_SHOPS);
    const price = Number(product.price) || 0;
    const mrp = Number(product.mrp) || price;
    const title = displayName(product);

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "sku": product.sku || undefined,
                        "gtin13": product.gtin || undefined,
                        "image": image,
                        "description": product.description,
                        "brand": { "@type": "Brand", "name": "Praypure" },
                        "offers": {
                            "@type": "Offer",
                            "url": typeof window !== 'undefined' ? window.location.href : 'https://www.praypure.com',
                            "priceCurrency": "INR",
                            "price": mrp || price,
                            "itemCondition": "https://schema.org/NewCondition",
                            "availability": "https://schema.org/InStock",
                            "seller": { "@type": "Organization", "name": "Praypure" }
                        }
                    })}
                </script>
            </Helmet>
            <article className="product-card">
                <div className="product-image">
                    {image ? (
                        <img src={image} alt={product.name} loading="lazy" />
                    ) : (
                        <div className="placeholder-image">Pack photo coming soon</div>
                    )}
                    {product.isNew && <span className="badge new">New</span>}
                </div>
                <div className="product-info">
                    <h3>{title}</h3>
                    {product.netQuantity && (
                        <p className="product-meta">{product.netQuantity}</p>
                    )}
                    {mrp > 0 && (
                        <div className="price-container">
                            {price > 0 && price < mrp ? (
                                <>
                                    <span className="product-price">₹{price}</span>
                                    <span className="product-mrp">₹{mrp}</span>
                                </>
                            ) : (
                                <span className="product-price">MRP ₹{mrp}</span>
                            )}
                        </div>
                    )}
                    <div className="product-links">
                        {buttons.map((mp) => (
                            <a
                                key={mp.platform}
                                href={mp.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`shop-btn shop-${mp.platform.toLowerCase()}`}
                            >
                                {mp.platform}
                            </a>
                        ))}
                    </div>
                </div>
            </article>
        </>
    );
};

export default ProductCard;
