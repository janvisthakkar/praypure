import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader-content">
                <div className="glow-ring ring-1"></div>
                <div className="glow-ring ring-2"></div>
                <div className="glow-ring ring-3"></div>

                <div className="diya-container">
                    <div className="flame-wrapper">
                        <div className="flame-outer"></div>
                        <div className="flame-inner"></div>
                        <div className="flame-core"></div>
                    </div>
                    <div className="diya-body">
                        <div className="diya-rim"></div>
                        <div className="diya-bowl"></div>
                    </div>
                </div>

                <div className="text-container">
                    <p className="loading-text">Igniting Purity</p>
                    <div className="loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
