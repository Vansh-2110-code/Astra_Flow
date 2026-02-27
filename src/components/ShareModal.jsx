import React, { useState } from 'react';
import { X, Copy, Link, Mail, Check } from 'lucide-react';

const ShareModal = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const shareUrl = window.location.href;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleEmailShare = (e) => {
        e.preventDefault();
        if (email.trim()) {
            window.open(`mailto:${email}?subject=Check out this content&body=${encodeURIComponent(shareUrl)}`);
            setEmail('');
        }
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white', borderRadius: 12, width: '90%', maxWidth: 420,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--input-border)'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Share Content</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '1.25rem' }}>
                    {/* Copy link section */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                            Share link
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{
                                flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '8px 12px', borderRadius: 8,
                                border: '1px solid var(--input-border)', background: '#f9fafb',
                                fontSize: '0.8rem', color: 'var(--text-muted)',
                                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                            }}>
                                <Link size={14} style={{ flexShrink: 0 }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{shareUrl}</span>
                            </div>
                            <button
                                onClick={handleCopy}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '8px 14px', borderRadius: 8,
                                    border: '1px solid var(--color-primary)',
                                    background: copied ? '#10b981' : 'var(--color-primary)',
                                    color: 'white', fontSize: '0.78rem', fontWeight: 500,
                                    cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0
                                }}
                            >
                                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                            </button>
                        </div>
                    </div>

                    {/* Email share */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                            Share via email
                        </label>
                        <form onSubmit={handleEmailShare} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                                style={{
                                    flex: 1, padding: '8px 12px', borderRadius: 8,
                                    border: '1px solid var(--input-border)',
                                    fontSize: '0.82rem', outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!email.trim()}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '8px 14px', borderRadius: 8,
                                    border: 'none',
                                    background: email.trim() ? 'var(--color-primary)' : '#e2e8f0',
                                    color: email.trim() ? 'white' : '#94a3b8',
                                    fontSize: '0.78rem', fontWeight: 500,
                                    cursor: email.trim() ? 'pointer' : 'default',
                                    transition: 'all 0.15s', flexShrink: 0
                                }}
                            >
                                <Mail size={14} /> Send
                            </button>
                        </form>
                    </div>

                    {/* Permissions note */}
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: 8,
                        background: 'rgba(99,102,241,0.05)',
                        border: '1px solid rgba(99,102,241,0.1)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.5
                    }}>
                        <strong style={{ color: 'var(--text-main)' }}>Note:</strong> People with the link can view this workspace's published content. Draft and scheduled posts remain private to workspace members.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
