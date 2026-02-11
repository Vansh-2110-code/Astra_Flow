import React from 'react';
import { X, Plus } from 'lucide-react';
import Button from './ui/Button';

const ManageAccountsModal = ({ isOpen, onClose, connectedAccounts = [] }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem 2rem',
                    maxWidth: 480,
                    width: '100%',
                    maxHeight: '85vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 className="text-h2">Manage Accounts</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)'
                        }}
                    >
                        <X size={22} />
                    </button>
                </div>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    View and manage connected social accounts for this workspace.
                </p>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {connectedAccounts.length === 0 ? (
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>No connected accounts. Connect platforms in Settings.</p>
                    ) : (
                        connectedAccounts.map((platform) => {
                            const Icon = platform.icon;
                            const accounts = platform.accounts || [];
                            return (
                                <div
                                    key={platform.name}
                                    style={{
                                        border: '1px solid var(--input-border)',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            background: `${platform.color}10`,
                                            borderBottom: '1px solid var(--input-border)'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                background: `${platform.color}25`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Icon size={18} color={platform.color} />
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{platform.name}</span>
                                        <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>{accounts.length} account{accounts.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div style={{ padding: '0.5rem' }}>
                                        {accounts.map((acc) => (
                                            <div
                                                key={acc.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.6rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'white'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{acc.handle || acc.name}</div>
                                                    {acc.role && (
                                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{acc.role}</div>
                                                    )}
                                                </div>
                                                <Button variant="ghost" style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}>Disconnect</Button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.6rem',
                                                marginTop: '0.25rem',
                                                border: '1px dashed var(--input-border)',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'white',
                                                color: 'var(--color-primary)',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Plus size={16} /> Add account
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--input-border)' }}>
                    <Button variant="primary" onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
};

export default ManageAccountsModal;
