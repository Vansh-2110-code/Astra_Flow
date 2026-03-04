import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader, CheckCircle, AlertCircle, Chrome } from 'lucide-react';
import { login, storeAuthData } from '../services/authService';
import Toast from './ui/Toast';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        return localStorage.getItem('rememberMe') === 'true';
    });
    const [toast, setToast] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const response = await login(email, password);
            setSuccess(true);
            setToast({ type: 'success', message: 'Welcome back! Redirecting...' });

            // Store tokens based on rememberMe preference
            storeAuthData(response, rememberMe);

            // Redirect after brief delay
            setTimeout(() => {
                window.location.href = '/workspace';
            }, 1000);

        } catch (err) {
            // Error is already mapped to a friendly message by the api interceptor
            setError(err.message);
            setToast({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card">
            <div className="brand-logo">
                <div className="logo-icon">L</div>
                <span>LintCollab</span>
            </div>

            <div className="login-header">
                <h2>Welcome back</h2>
                <p>Login to your workspace</p>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="input-wrapper">
                        <input
                            type="email"
                            className={`form-input ${error ? 'error' : ''} ${success ? 'success' : ''}`}
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                        />
                        <label htmlFor="email" className="input-label">Email</label>
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-input ${error ? 'error' : ''}`}
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                        />
                        <label htmlFor="password" className="input-label">Password</label>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <label className="remember-me">
                        <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>
                    <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || success}
                >
                    {loading ? (
                        <div className="spinner"></div>
                    ) : success ? (
                        <>
                            <CheckCircle size={20} />
                            <span>Success</span>
                        </>
                    ) : (
                        'Log In'
                    )}
                </button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <button type="button" className="btn-google">
                {/* Using a generic icon for now, ideally an SVG */}
                <Chrome size={20} />
                <span>Continue with Google</span>
            </button>

            <div className="signup-link">
                Don’t have an account?
                <Link to="/signup">Sign up</Link>
            </div>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Login;
