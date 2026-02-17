import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginContent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsSubmitting(true);
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            toast.success('Welcome back, Admin!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
        setIsSubmitting(false);
    };

    const handleGoogleError = () => {
        toast.error('Google sign-in was cancelled or failed.');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Praypure</h1>
                    <p>Admin Control Center</p>
                </div>

                <div className="login-welcome">
                    <h2>Welcome Back</h2>
                    <p>Sign in to manage your admin panel</p>
                </div>

                {isSubmitting ? (
                    <div className="login-loading">
                        <Loader2 className="spin" size={28} />
                        <span>Authenticating...</span>
                    </div>
                ) : (
                    <div className="google-btn-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            size="large"
                            width="340"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                )}

                <div className="login-disclaimer">
                    <p>By continuing, you verify that you are an authorized admin.</p>
                </div>
            </div>
            <style>{`
                .login-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                }
                .login-container::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: #d4af37;
                    opacity: 0.06;
                    filter: blur(150px);
                    pointer-events: none;
                }
                .login-container::after {
                    content: '';
                    position: absolute;
                    bottom: -10%;
                    left: -10%;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: #3E2723;
                    opacity: 0.08;
                    filter: blur(100px);
                    pointer-events: none;
                }
                .login-box {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 3rem;
                    border-radius: 1.5rem;
                    width: 100%;
                    max-width: 420px;
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                    z-index: 1;
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .login-header h1 {
                    font-size: 2.5rem;
                    margin: 0;
                    background: linear-gradient(to right, #d4af37, #f9e29d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .login-header p {
                    color: #888;
                    margin-top: 0.5rem;
                    font-size: 0.85rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                }
                .login-welcome {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .login-welcome h2 {
                    font-size: 1.25rem;
                    font-weight: 500;
                    color: #fff;
                    margin: 0 0 0.5rem;
                }
                .login-welcome p {
                    font-size: 0.9rem;
                    color: #999;
                    margin: 0;
                }
                .google-btn-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }
                .login-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    color: #d4af37;
                    margin-bottom: 1.5rem;
                }
                .login-disclaimer {
                    text-align: center;
                }
                .login-disclaimer p {
                    color: #666;
                    font-size: 0.75rem;
                    margin: 0;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const Login = () => {
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#ff6b6b', fontFamily: 'Inter, sans-serif', padding: '2rem', textAlign: 'center' }}>
                <div>
                    <h2>Configuration Error</h2>
                    <p>Missing <code>VITE_GOOGLE_CLIENT_ID</code> environment variable.</p>
                    <p style={{ color: '#888', fontSize: '0.85rem' }}>Add it to your admin <code>.env</code> file and restart the dev server.</p>
                </div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginContent />
        </GoogleOAuthProvider>
    );
};

export default Login;
