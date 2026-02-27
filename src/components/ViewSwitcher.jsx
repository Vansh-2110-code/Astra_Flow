import React from 'react';
import { LayoutList, Calendar, Grid, List } from 'lucide-react';

const ViewSwitcher = ({ currentView, onViewChange }) => {
    // UI redesign inspired by Plannable
    // Layout restructuring (non-breaking)
    const views = [
        { id: 'feed', label: 'Feed', icon: LayoutList },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'grid', label: 'Grid', icon: Grid },
        { id: 'list', label: 'List', icon: List }
    ];

    return (
        <div
            style={{
                display: 'inline-flex',
                padding: '2px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid var(--input-border)',
                boxShadow: '0 1px 3px rgba(15,23,42,0.08)'
            }}
        >
            {views.map(view => {
                const Icon = view.icon;
                const isActive = view.id === currentView;
                return (
                    <button
                        key={view.id}
                        type="button"
                        onClick={() => onViewChange(view.id)}
                        // Compact header redesign — pill-style view toggle
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '5px 12px',
                            borderRadius: '999px',
                            background: isActive ? 'var(--color-primary)' : 'transparent',
                            color: isActive ? '#ffffff' : 'var(--text-muted)',
                            fontSize: '0.78rem',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'background 0.18s ease, color 0.18s ease, transform 0.12s ease'
                        }}
                    >
                        <Icon size={13} />
                        {view.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ViewSwitcher;
