import React, { useState } from 'react';
import { LayoutList, Calendar, Grid, List, ChevronDown } from 'lucide-react';

const ViewSwitcher = ({ currentView, onViewChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const views = [
        { id: 'feed', label: 'Feed View', icon: LayoutList },
        { id: 'calendar', label: 'Calendar View', icon: Calendar },
        { id: 'grid', label: 'Grid View', icon: Grid },
        { id: 'list', label: 'List View', icon: List }
    ];

    const currentViewObj = views.find(v => v.id === currentView) || views[0];
    const CurrentIcon = currentViewObj.icon;

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-outline"
                style={{
                    gap: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <CurrentIcon size={16} />
                {currentViewObj.label}
                <ChevronDown size={14} />
            </button>

            {isOpen && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 99
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            minWidth: '180px',
                            background: 'white',
                            border: '1px solid var(--input-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            padding: '0.5rem',
                            zIndex: 100
                        }}
                    >
                        {views.map(view => {
                            const Icon = view.icon;
                            return (
                                <button
                                    key={view.id}
                                    onClick={() => {
                                        onViewChange(view.id);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        background: view.id === currentView ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        color: view.id === currentView ? 'var(--color-primary)' : 'var(--text-main)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '0.9rem',
                                        fontWeight: view.id === currentView ? 600 : 500,
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (view.id !== currentView) {
                                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (view.id !== currentView) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <Icon size={16} />
                                    {view.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewSwitcher;
