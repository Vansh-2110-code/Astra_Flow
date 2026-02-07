// src/pages/LoginPage.jsx
import React from 'react';
import Login from '../components/Login';
import Background3D from '../components/Background3D';
import '../styles/login.css';

const LoginPage = () => {
    return (
        <div className="login-page-container">
            <Background3D />
            {/* Left Side - Branding */}
            <div className="left-panel">
                <div className="abstract-shape"></div>

                <div className="hero-content">
                    <div className="logo-section" style={{ marginBottom: '4rem' }}>
                        {/* Optional Top Logo */}
                    </div>

                    <h1 className="hero-tagenline">
                        Plan.<br />
                        Collaborate.<br />
                        Publish.
                    </h1>

                    <p className="hero-desc">
                        The workspace for modern content teams.
                        Manage your entire editorial workflow in one beautiful place.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="right-panel">
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;
