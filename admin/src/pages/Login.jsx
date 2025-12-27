import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back, Admin!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Praypure</h1>
                    <p>Admin Control Center</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="icon" />
                            <input
                                type="email"
                                placeholder="admin@praypure.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="login-btn" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="spin" size={20} /> : 'Login to Dashboard'}
                    </button>
                </form>
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
                }
                .login-box {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 3rem;
                    border-radius: 1.5rem;
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
                }
                .input-group {
                    margin-bottom: 1.5rem;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: #ccc;
                }
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-wrapper .icon {
                    position: absolute;
                    left: 1rem;
                    color: #666;
                }
                .input-wrapper input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 3rem;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    color: white;
                    outline: none;
                    transition: border-color 0.3s;
                }
                .input-wrapper input:focus {
                    border-color: #d4af37;
                }
                .login-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: #d4af37;
                    color: black;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-btn:hover {
                    background: #c19b2e;
                    transform: translateY(-2px);
                }
                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
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

export default Login;
