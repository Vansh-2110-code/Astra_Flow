
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    Image,
    BarChart2,
    Users,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const { workspaceId } = useParams();
    const baseUrl = `/workspace/${workspaceId}`;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: `${baseUrl}/dashboard` },
        { icon: FileText, label: 'Content', path: `${baseUrl}/content` },
        { icon: CheckSquare, label: 'Approvals', path: `${baseUrl}/approvals` },
        { icon: Image, label: 'Media Library', path: `${baseUrl}/media` },
        { icon: BarChart2, label: 'Analytics', path: `${baseUrl}/analytics` },
        { icon: Users, label: 'Team', path: `${baseUrl}/team` },
        { icon: Settings, label: 'Settings', path: `${baseUrl}/settings` },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    <div style={{ padding: 6, background: 'var(--color-primary)', color: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>L</div>
                    <span>LintCollab</span>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
                <div className="nav-item">
                    <div className="avatar avatar-sm" style={{ background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>JS</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>John Smith</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
