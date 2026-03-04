import React, { forwardRef } from 'react';

const Card = forwardRef(({ children, className = '', hover = false, ...props }, ref) => {
    return (
        <div ref={ref} className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;
