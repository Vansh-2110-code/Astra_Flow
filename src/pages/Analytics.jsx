
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import { BarChart2, TrendingUp, Users, Eye } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="stat-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>{title}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{value}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: `${color}20`, borderRadius: '12px', color: color }}>
                <Icon size={24} />
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{change}</span>
            <span className="text-muted">vs last month</span>
        </div>
    </Card>
);

const Analytics = () => {
    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Analytics</h1>
                <p className="text-muted">Track your performance stats.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Posts" value="1,248" change="+12.5%" icon={BarChart2} color="#6366f1" />
                <StatCard title="Engagement Rate" value="4.2%" change="+0.8%" icon={TrendingUp} color="#ec4899" />
                <StatCard title="Total Reach" value="85.4k" change="+24.2%" icon={Eye} color="#8b5cf6" />
                <StatCard title="New Followers" value="1,204" change="+8.1%" icon={Users} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <Card style={{ minHeight: '300px' }}>
                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Engagement Overview</h3>
                    {/* Placeholder for Chart */}
                    <div style={{ width: '100%', height: '200px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Chart Placeholder
                    </div>
                </Card>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Platform Split</h3>
                    {/* Placeholder for Pie Chart */}
                    <div style={{ width: '100%', height: '200px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Pie Chart Placeholder
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
