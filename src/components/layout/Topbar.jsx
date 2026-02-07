
import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useParams } from 'react-router-dom';
import WorkspaceSwitcher from '../WorkspaceSwitcher';

const Topbar = () => {
    const { workspaceId } = useParams();

    return (
        <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <WorkspaceSwitcher currentWorkspaceId={workspaceId} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '8px 12px 8px 36px',
                            borderRadius: '20px',
                            border: '1px solid var(--input-border)',
                            background: 'rgba(255,255,255,0.5)',
                            fontSize: '0.9rem',
                            width: '240px',
                            outline: 'none'
                        }}
                    />
                </div>

                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}>
                    <Bell size={20} />
                    <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--color-secondary)', borderRadius: '50%' }}></span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
