// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const containerStyle = {
        maxWidth: '800px',
        margin: '4rem auto',
        padding: '2.5rem',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#1e293b',
        lineHeight: '1.6'
    };

    const headerStyle = {
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '1.5rem',
        marginBottom: '2rem'
    };

    const titleStyle = {
        fontSize: '2.25rem',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '0.5rem',
        letterSpacing: '-0.025em'
    };

    const sectionStyle = {
        marginBottom: '2rem'
    };

    const subTitleStyle = {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '1rem',
        marginTop: '1.5rem'
    };

    const listStyle = {
        paddingLeft: '1.5rem',
        marginBottom: '1rem'
    };

    const textStyle = {
        marginBottom: '1rem',
        color: '#475569'
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '1rem' }}>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Privacy Policy</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Last updated: July 17, 2026</p>
                </div>

                <div style={sectionStyle}>
                    <p style={textStyle}>
                        Welcome to **AstraFlow** (accessible via https://astraflow.sannainnovations.com). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you connect your Facebook and Instagram accounts to our platform.
                    </p>
                </div>

                <div style={sectionStyle}>
                    <h2 style={subTitleStyle}>1. Information We Collect</h2>
                    <p style={textStyle}>
                        When you authenticate and connect your Meta (Facebook & Instagram) channels, we collect and store:
                    </p>
                    <ul style={listStyle}>
                        <li>**OAuth Access Tokens**: Secure authorization tokens provided by Meta to publish content and fetch analytics on your behalf.</li>
                        <li>**Page & Account Identifiers**: Facebook Page ID, Instagram Account ID, page names, and profile pictures.</li>
                        <li>**Post Content**: Text, images, and videos that you schedule or publish through AstraFlow.</li>
                        <li>**Analytics Metrics**: Aggregated performance metrics (reach, impressions, follower counts, and engagement stats) to generate your dashboard insights.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={subTitleStyle}>2. How We Use Your Information</h2>
                    <p style={textStyle}>
                        We use the collected information solely to provide and improve our services, specifically:
                    </p>
                    <ul style={listStyle}>
                        <li>To schedule, format, and publish your content to connected Facebook Pages and Instagram accounts.</li>
                        <li>To display real-time engagement and growth statistics in your Workspace Analytics dashboard.</li>
                        <li>To maintain active sync connections and notify you in case of token expirations.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={subTitleStyle}>3. Data Retention and Deletion</h2>
                    <p style={textStyle}>
                        We store your data as long as your workspace account is active. You can request deletion of your data at any time:
                    </p>
                    <ul style={listStyle}>
                        <li>**Disconnecting Channels**: You can disconnect any Facebook or Instagram channel from the "Workspace Settings &rarr; Integrations" tab at any time, which deletes the associated access token from our database.</li>
                        <li>**Data Deletion Requests**: To request complete deletion of your account and all associated data, you can email our support team at **support@sannainnovations.com**. We will process and complete deletion requests within 48 hours.</li>
                        <li>**Revoking Permissions**: You can also revoke access directly from your Facebook settings by navigating to "Settings &amp; Privacy" &rarr; "Apps and Websites" &rarr; "Automatic Posting" and removing permissions.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={subTitleStyle}>4. Security of Your Data</h2>
                    <p style={textStyle}>
                        We implement industry-standard security measures (including SSL encryption for all network traffic and secure database access) to protect your access tokens and user details from unauthorized access.
                    </p>
                </div>

                <div style={sectionStyle}>
                    <h2 style={subTitleStyle}>5. Contact Us</h2>
                    <p style={textStyle}>
                        If you have any questions or concerns about this Privacy Policy or your data, please contact us at:
                    </p>
                    <p style={{ ...textStyle, fontWeight: '600', color: '#0f172a' }}>
                        Email: support@sannainnovations.com<br />
                        Website: https://sannainnovations.com
                    </p>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                    <Button variant="outline" onClick={() => navigate('/login')}>
                        Back to Login
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
