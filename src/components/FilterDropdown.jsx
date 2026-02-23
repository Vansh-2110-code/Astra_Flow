import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

const FilterDropdown = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        postType: '',
        platform: '',
        dateFrom: '',
        dateTo: ''
    });

    const postTypes = ['Post', 'Story', 'Reel'];
    const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'];

    const handleApply = () => {
        onFilterChange(filters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetFilters = { postType: '', platform: '', dateFrom: '', dateTo: '' };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-outline"
                style={{
                    gap: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    background: hasActiveFilters ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    borderColor: hasActiveFilters ? 'var(--color-primary)' : 'var(--input-border)'
                }}
            >
                <Filter size={15} />
                <span style={{ fontSize: '0.875rem' }}>Filter</span>
                {hasActiveFilters && (
                    <span style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 600
                    }}>
                        {Object.values(filters).filter(v => v !== '').length}
                    </span>
                )}
                <ChevronDown size={13} />
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
                            minWidth: '320px',
                            background: 'white',
                            border: '1px solid var(--input-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            padding: '1.5rem',
                            zIndex: 100
                        }}
                    >
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                marginBottom: '0.5rem'
                            }}>
                                Post Type
                            </label>
                            <select
                                value={filters.postType}
                                onChange={(e) => setFilters({ ...filters, postType: e.target.value })}
                                className="themed-select"
                            >
                                <option value="">All Types</option>
                                {postTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                marginBottom: '0.5rem'
                            }}>
                                Platform
                            </label>
                            <select
                                value={filters.platform}
                                onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                                className="themed-select"
                            >
                                <option value="">All Platforms</option>
                                {platforms.map(platform => (
                                    <option key={platform} value={platform}>{platform}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                marginBottom: '0.5rem'
                            }}>
                                Date Range
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem 0.75rem',
                                        border: '1px solid var(--input-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'white',
                                        fontSize: '0.8rem',
                                        color: 'var(--text-main)',
                                        outline: 'none'
                                    }}
                                />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem 0.75rem',
                                        border: '1px solid var(--input-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'white',
                                        fontSize: '0.8rem',
                                        color: 'var(--text-main)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '0.625rem',
                            paddingTop: '0.875rem',
                            borderTop: '1px solid var(--input-border)'
                        }}>
                            <button
                                onClick={handleReset}
                                className="btn btn-ghost"
                                style={{ flex: 1 }}
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleApply}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterDropdown;
