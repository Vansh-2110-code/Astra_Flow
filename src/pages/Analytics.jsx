import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import { BarChart2, TrendingUp, Users, Eye, TrendingDown } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 1200 }) => {
    const str = String(value);
    const hasK = str.includes('k');
    const hasPct = str.includes('%');
    const numericMatch = str.replace(/[^0-9.]/g, '');
    const targetNum = parseFloat(numericMatch) || 0;
    const end = (hasK || hasPct) ? targetNum : Math.round(targetNum);
    const [count, setCount] = useState(0);
    useEffect(() => {
        const startTime = performance.now();
        const step = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const next = progress * end;
            setCount((hasK || hasPct) ? parseFloat(next.toFixed(1)) : Math.floor(next));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration, hasK, hasPct]);
    const formatted = hasK ? `${count}k` : hasPct ? `${count}%` : count.toLocaleString();
    return <span>{formatted}</span>;
};

const StatCard = ({ title, value, change, icon: Icon, color }) => {
    const isPositive = change.startsWith('+');
    return (
        <Card className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>{title}</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>
                        <AnimatedCounter value={value} />
                    </h2>
                </div>
                <div style={{ padding: '0.75rem', background: `${color}20`, borderRadius: '12px', color: color }}>
                    <Icon size={24} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                {isPositive ? <TrendingUp size={14} style={{ color: '#10b981' }} /> : <TrendingDown size={14} style={{ color: '#ef4444' }} />}
                <span style={{ color: isPositive ? '#10b981' : '#ef4444', fontWeight: 600 }}>{change}</span>
                <span className="text-muted">vs last period</span>
            </div>
        </Card>
    );
};

const Analytics = () => {
    const [dateRange, setDateRange] = useState('30');
    const [platformFilter, setPlatformFilter] = useState('all');

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                    <h1 className="text-h1">Analytics</h1>
                    <p className="text-muted">Track your performance stats.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="themed-select"
                        style={{ minWidth: '120px', width: 'auto' }}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="themed-select"
                        style={{ minWidth: '140px', width: 'auto' }}
                    >
                        <option value="all">All platforms</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">X (Twitter)</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Posts" value="1,248" change="+12.5%" icon={BarChart2} color="#6366f1" />
                <StatCard title="Engagement Rate" value="4.2%" change="+0.8%" icon={TrendingUp} color="#ec4899" />
                <StatCard title="Total Reach" value="85.4k" change="+24.2%" icon={Eye} color="#8b5cf6" />
                <StatCard title="New Followers" value="1,204" change="+8.1%" icon={Users} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Best performing post</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Q1 Launch Announcement</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <TrendingUp size={16} style={{ color: '#10b981' }} />
                        <span style={{ fontWeight: 600, color: '#10b981' }}>+18.2%</span>
                        <span className="text-muted">engagement</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Instagram • 2.4k likes</p>
                </Card>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Worst performing post</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Weekly roundup #42</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <TrendingDown size={16} style={{ color: '#ef4444' }} />
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>-2.1%</span>
                        <span className="text-muted">engagement</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Facebook • 89 reach</p>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <Card style={{ minHeight: '300px' }}>
                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Engagement Overview</h3>
                    <div style={{ width: '100%', height: '200px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Chart Placeholder
                    </div>
                </Card>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Platform Split</h3>
                    <div style={{ width: '100%', height: '200px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Pie Chart Placeholder
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
