// src/pages/SignupPage.jsx
import React from 'react';
import SignupWizard from '../components/SignupWizard';
import Background3D from '../components/Background3D';
import '../styles/login.css';

const SignupPage = () => {
    return (
        <div className="login-page-container">
            <Background3D />

            {/* Left Panel - Onboarding Message */}
            <div className="left-panel">
                <div className="hero-content">
                    <div className="logo-section" style={{ marginBottom: '2rem' }}>
                        <div className="logo-icon" style={{ width: 40, height: 40, fontSize: 24 }}>L</div>
                    </div>

                    <h1 className="hero-tagenline">
                        Join the<br />
                        Revolution.
                    </h1>

                    <p className="hero-desc">
                        Experience the future of content planning.
                        Create your workspace in seconds and start collaborating.
                    </p>
                </div>
            </div>

            {/* Right Panel - Wizard */}
            <div className="right-panel">
                <SignupWizard />
            </div>
        </div>
    );
};

export default SignupPage;
