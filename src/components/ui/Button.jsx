
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  icon: Icon,
  ...props 
}) => {
  const baseClass = `btn btn-${variant}`;
  
  return (
    <button className={`${baseClass} ${className}`} disabled={loading} {...props}>
      {loading && <div className="spinner" style={{width: 16, height: 16}}></div>}
      {!loading && Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
