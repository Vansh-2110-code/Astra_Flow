
import React from 'react';

const Badge = ({ status }) => {
    const normalizedStatus = status.toLowerCase().replace(' ', '-');
    return (
        <span className={`badge badge-${normalizedStatus}`}>
            {status}
        </span>
    );
};

export default Badge;
