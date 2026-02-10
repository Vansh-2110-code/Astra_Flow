import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { workspaces } from '../data/mockData';

const WorkspaceSwitcher = ({ currentWorkspaceId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentWorkspace = workspaces.find(w => w.id === parseInt(currentWorkspaceId)) || workspaces[0];

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '7px 11px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    fontSize: '0.875rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'}
            >
                <span>{currentWorkspace.name}</span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {isOpen && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 99
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            minWidth: '280px',
                            background: 'white',
                            border: '1px solid var(--input-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            padding: '0.5rem',
                            zIndex: 100
                        }}
                    >
                        {workspaces.map(workspace => (
                            <a
                                key={workspace.id}
                                href={`/workspace/${workspace.id}/content`}
                                style={{
                                    display: 'block',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    textDecoration: 'none',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s',
                                    background: workspace.id === currentWorkspace.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    if (workspace.id !== currentWorkspace.id) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (workspace.id !== currentWorkspace.id) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                                onClick={() => setIsOpen(false)}
                            >
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    {workspace.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {workspace.posts} posts • {workspace.activity}
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkspaceSwitcher;
