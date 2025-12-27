import React from 'react';

const TermsConditions = () => {
    return (
        <section className="section terms-page">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Terms & Conditions</h2>
                </div>
                <div className="content" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    <p>Welcome to Praypure. By using our website and purchasing our products, you agree to comply with and be bound by the following terms and conditions.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Product Information</h3>
                    <p>We strive to provide accurate descriptions and images of our products. However, slight variations may occur due to the natural materials used.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Ordering and Payments</h3>
                    <p>All orders are subject to availability. We accept various payment methods and process payments securely.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Shipping and Delivery</h3>
                    <p>We aim to ship orders promptly. Delivery times may vary depending on your location. We are not responsible for delays caused by third-party shipping carriers.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Returns and Refunds</h3>
                    <p>If you are not satisfied with your purchase, please contact us within 7 days of receiving your order to initiate a return or exchange, subject to our return policy.</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Changes to Terms</h3>
                    <p>We reserve the right to modify these terms and conditions at any time. Your continued use of the website constitutes acceptance of the modified terms.</p>
                </div>
            </div>
        </section>
    );
};

export default TermsConditions;
