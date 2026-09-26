import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { SHOP_FAMILIES } from '../data/shop';
import './CollectionHub.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CollectionHub = ({ familyKey }) => {
    const family = SHOP_FAMILIES.find((item) => item.key === familyKey);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/categories`);
                setCategories(response.data.data || []);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };
        load();
    }, []);

    if (!family) return null;

    const tiles = family.lines.map((line) => {
        const category = categories.find((item) => item.slug === line.slug);
        return {
            ...line,
            title: category?.title || line.label,
            subtitle: category?.subtitle || `${line.pack} pack`,
            image: category?.image || '',
        };
    });

    return (
        <div className="collection-hub">
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
            <section className="section">
                <div className="container hub-grid">
                    {tiles.map((tile) => (
                        <Link to={`/${tile.slug}`} className="hub-card" key={tile.slug}>
                            <div className="hub-image">
                                {tile.image ? <img src={tile.image} alt={tile.title} /> : <span>{tile.label}</span>}
                            </div>
                            <div className="hub-copy">
                                <h2>{tile.label}</h2>
                                <p>{tile.pack ? `${tile.pack} · ${tile.subtitle}` : tile.subtitle}</p>
                                <span>View packs</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CollectionHub;
