/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback } from 'react';
import { mockNotifications } from '../data/mockNotifications';

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
    const currentUser = 'Admin'; // This should come from auth context in production

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            isRead: false,
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, isRead: true } : notif
            )
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    }, []);

    const deleteNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const getUnreadCount = useCallback(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);

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
                createdBy: approver
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
        
        if (currentUser !== commenter) {
            addNotification({
                type: 'comment',
                message,
                relatedPostId: post.id,
                createdBy: commenter
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
                createdBy: rejector
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
        notifications,
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
