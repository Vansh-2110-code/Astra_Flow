import React, { useEffect } from 'react';

// Added toast notification system
const Toast = ({ type = 'success', message, onClose }) => {
    useEffect(() => {
        const id = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);
        return () => clearTimeout(id);
    }, [onClose]);

    let background = 'rgba(17, 24, 39, 0.9)';
    let borderColor = 'transparent';

    if (type === 'success') {
        background = 'var(--input-success)';
    } else if (type === 'error') {
        background = '#fee2e2';
        borderColor = '#fecaca';
    } else if (type === 'warning') {
        background = '#fef3c7';
        borderColor = '#fde68a';
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 9999,
                maxWidth: '320px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background,
                border: borderColor !== 'transparent' ? `1px solid ${borderColor}` : 'none',
                color: type === 'error' || type === 'warning' ? 'var(--text-main)' : '#ffffff',
                fontSize: '0.9rem',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
            }}
        >
            <span>{message}</span>
        </div>
    );
};

export default Toast;

