
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

// Compact header redesign — DashboardLayout now accepts optional topbarContent
// to let pages inject breadcrumb + actions into the topbar area (Plannable-style)
const DashboardLayout = ({ children, topbarContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="main-content">
                <Topbar
                    topbarContent={topbarContent}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {topbarContent}
                </Topbar>
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
