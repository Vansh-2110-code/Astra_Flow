import React from 'react';
import { X, Bell, MessageSquare, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationPanel = ({ isOpen, onClose, onNotificationClick }) => {
    const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotifications();

    if (!isOpen) return null;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'post':
                return <FileText size={16} color="#6366f1" />;
            case 'approval':
                return <CheckCircle size={16} color="#10b981" />;
            case 'comment':
                return <MessageSquare size={16} color="#f59e0b" />;
            case 'warning':
                return <AlertTriangle size={16} color="#ef4444" />;
            default:
                return <Bell size={16} color="#6b7280" />;
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now - notifTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (onNotificationClick && notification.relatedPostId) {
            onNotificationClick(notification.relatedPostId);
        }
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 999
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '400px',
                    maxWidth: '90vw',
                    height: '100vh',
                    background: 'white',
                    borderLeft: '1px solid var(--input-border)',
                    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid var(--input-border)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h2 className="text-h2">Notifications</h2>
                        {getUnreadCount() > 0 && (
                            <span style={{
                                background: 'var(--color-secondary)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 600
                            }}>
                                {getUnreadCount()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mark All as Read */}
                {getUnreadCount() > 0 && (
                    <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--input-border)' }}>
                        <button
                            onClick={markAllAsRead}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Mark all as read
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}
                >
                    {notifications.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem 1.5rem',
                            color: 'var(--text-muted)'
                        }}>
                            <Bell size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p style={{ fontSize: '0.9rem' }}>No notifications yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid var(--input-border)',
                                        background: notification.isRead ? 'white' : 'rgba(99, 102, 241, 0.03)',
                                        cursor: notification.relatedPostId ? 'pointer' : 'default',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (notification.relatedPostId) {
                                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = notification.isRead ? 'white' : 'rgba(99, 102, 241, 0.03)';
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {/* Icon */}
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            flexShrink: 0,
                                            background: notification.isRead ? '#f3f4f6' : 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontSize: '0.9rem',
                                                color: 'var(--text-main)',
                                                marginBottom: '0.25rem',
                                                lineHeight: 1.4,
                                                fontWeight: notification.isRead ? 400 : 600
                                            }}>
                                                {notification.message}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {getTimeAgo(notification.timestamp)}
                                                </span>
                                                {!notification.isRead && (
                                                    <span style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        background: 'var(--color-primary)',
                                                        borderRadius: '50%'
                                                    }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
