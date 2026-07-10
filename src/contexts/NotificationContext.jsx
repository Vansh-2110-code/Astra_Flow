/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../services/api';
import { getUserData } from '../services/authService';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    
    // Get current user dynamically
    const user = getUserData();
    const currentUser = user 
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email 
        : 'Admin';

    // Fetch initial notifications from backend and start polling
    useEffect(() => {
        const fetchNotifications = () => {
            api.get('/notifications')
                .then(res => {
                    setNotifications(res.data);
                })
                .catch(err => {
                    console.error("Failed to load notifications from backend:", err);
                });
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 20000); // Poll every 20 seconds
        return () => clearInterval(interval);
    }, []);

    // Filter notifications for the current user
    const filteredNotifications = notifications.filter(n => {
        if (!n.recipient) return true; // default/all
        if (n.recipient === 'all') return true;
        
        const user = getUserData();
        const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Admin';
        const userRole = user?.role || 'admin';
        const userEmail = user?.email || '';

        if (n.recipient === 'Admin' && userRole === 'admin') return true;
        if (n.recipient === userName) return true;
        if (n.recipient === userEmail) return true;
        
        return false;
    });

    const addNotification = useCallback((notification) => {
        const payload = {
            isRead: false,
            recipient: 'Admin', // Default to admin
            ...notification
        };
        api.post('/notifications', payload)
            .then(res => {
                setNotifications(prev => [res.data, ...prev]);
            })
            .catch(err => {
                console.error("Failed to persist notification:", err);
                setNotifications(prev => [{
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    ...payload
                }, ...prev]);
            });
    }, []);

    const markAsRead = useCallback((notificationId) => {
        api.post(`/notifications/${notificationId}/read`)
            .then(() => {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId ? { ...notif, isRead: true } : notif
                    )
                );
            })
            .catch(err => {
                console.error("Failed to mark notification as read:", err);
            });
    }, []);

    const markAllAsRead = useCallback(() => {
        const unread = filteredNotifications.filter(n => !n.isRead);
        Promise.all(unread.map(n => api.post(`/notifications/${n.id}/read`).catch(() => {})))
            .then(() => {
                setNotifications(prev =>
                    prev.map(notif => {
                        const isMatch = filteredNotifications.some(fn => fn.id === notif.id);
                        return isMatch ? { ...notif, isRead: true } : notif;
                    })
                );
            });
    }, [filteredNotifications]);

    const deleteNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    }, []);

    const clearAllNotifications = useCallback(() => {
        api.post('/notifications/clear')
            .then(() => {
                setNotifications([]);
            })
            .catch(err => {
                console.error("Failed to clear notifications:", err);
            });
    }, []);

    const getUnreadCount = useCallback(() => {
        return filteredNotifications.filter(n => !n.isRead).length;
    }, [filteredNotifications]);

    // Notification Triggers
    const notifyNewPost = useCallback((post, creator) => {
        // Notify approvers and admins when contributor creates post
        addNotification({
            type: 'post',
            message: `${creator} created a new post waiting for approval`,
            relatedPostId: post.id,
            createdBy: creator
        });
    }, [addNotification]);

    const notifyPostApproved = useCallback((post, approver, creator) => {
        // Notify creator when post is approved
        if (currentUser !== creator) {
            addNotification({
                type: 'approval',
                message: `Your post has been approved by ${approver}`,
                relatedPostId: post.id,
                createdBy: approver,
                recipient: creator
            });
        }
    }, [addNotification, currentUser]);

    const notifyPostNeedsApproval = useCallback((post) => {
        // Notify when post is scheduled within 1 hour and not approved
        addNotification({
            type: 'warning',
            message: 'Scheduled post needs approval within 1 hour',
            relatedPostId: post.id,
            createdBy: 'System'
        });
    }, [addNotification]);

    const notifyComment = useCallback((post, commenter, isHighlightComment = false) => {
        // Notify post creator and previous commenters
        const message = isHighlightComment 
            ? `${commenter} commented on your highlighted text`
            : `${commenter} commented on a post`;
        
        const creator = post.created_by || post.author || 'Admin';
        if (currentUser !== commenter) {
            addNotification({
                type: 'comment',
                message,
                relatedPostId: post.id,
                createdBy: commenter,
                recipient: creator
            });
        }
    }, [addNotification, currentUser]);

    const notifyPostEditedAfterApproval = useCallback((post, editor) => {
        // Notify approvers when post is edited after approval
        addNotification({
            type: 'warning',
            message: `Post was edited after approval by ${editor}`,
            relatedPostId: post.id,
            createdBy: editor
        });
    }, [addNotification]);

    const notifyPostRejected = useCallback((post, rejector, creator) => {
        // Notify creator when post is rejected
        if (currentUser !== creator) {
            addNotification({
                type: 'warning',
                message: `Your post was rejected by ${rejector}`,
                relatedPostId: post.id,
                createdBy: rejector,
                recipient: creator
            });
        }
    }, [addNotification, currentUser]);

    // Check for posts needing approval (scheduled within 1 hour)
    const checkScheduledPosts = useCallback((posts) => {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        posts.forEach(post => {
            if (post.status === 'Scheduled' && !post.approved) {
                const scheduledTime = new Date(post.date);
                if (scheduledTime <= oneHourFromNow && scheduledTime > now) {
                    // Check if notification already exists for this post
                    const alreadyNotified = notifications.some(
                        n => n.relatedPostId === post.id && n.type === 'warning'
                    );
                    if (!alreadyNotified) {
                        notifyPostNeedsApproval(post);
                    }
                }
            }
        });
    }, [notifications, notifyPostNeedsApproval]);

    const value = {
        notifications: filteredNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getUnreadCount,
        // Trigger functions
        notifyNewPost,
        notifyPostApproved,
        notifyPostNeedsApproval,
        notifyComment,
        notifyPostEditedAfterApproval,
        notifyPostRejected,
        checkScheduledPosts
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
