
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '7px 10px 7px 34px',
                            borderRadius: '20px',
                            border: '1px solid var(--input-border)',
                            background: 'rgba(255,255,255,0.5)',
                            fontSize: '0.875rem',
                            width: '220px',
                            outline: 'none'
                        }}
                    />
                </div>

                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}>
                    <Bell size={18} />
                    <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: 'var(--color-secondary)', borderRadius: '50%' }}></span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
