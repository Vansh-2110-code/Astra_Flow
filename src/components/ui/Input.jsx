
import React from 'react';

const Input = ({ label, error, icon: Icon, wrapperClassName = '', ...props }) => {
    return (
        <div className={`form-group ${wrapperClassName}`}>
            <div className="input-wrapper">
                <input className={`input ${error ? 'error' : ''}`} placeholder=" " {...props} />
                {label && <label className="input-label" style={{ padding: '0 4px', background: 'transparent' }}>{label}</label>}
                {Icon && (
                    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <Icon size={18} />
                    </div>
                )}
            </div>
            {error && <span style={{ color: 'var(--input-error)', fontSize: '0.8rem', marginTop: 4, display: 'block' }}>{error}</span>}
        </div>
    );
};

export default Input;
