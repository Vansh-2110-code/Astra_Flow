
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkspaceSwitcher from '../WorkspaceSwitcher';
import NotificationPanel from '../NotificationPanel';
import { useNotifications } from '../../contexts/NotificationContext';

const Topbar = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const { getUnreadCount } = useNotifications();
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const unreadCount = getUnreadCount();

    const handleNotificationClick = (postId) => {
        // Navigate to the post (in Content view for now)
        if (workspaceId) {
            navigate(`/workspace/${workspaceId}/content`);
        }
        setIsNotificationPanelOpen(false);
    };

    return (
        <>
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

                    <button 
                        onClick={() => setIsNotificationPanelOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <>
                                <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: 'var(--color-secondary)', borderRadius: '50%' }}></span>
                                {unreadCount > 9 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        minWidth: '18px',
                                        height: '18px',
                                        background: 'var(--color-secondary)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0 4px'
                                    }}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </header>

            <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
                onNotificationClick={handleNotificationClick}
            />
        </>
    );
};

export default Topbar;
