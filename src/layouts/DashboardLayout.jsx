
import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme, Toolbar } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const DRAWER_WIDTH = 260;

const DashboardLayout = ({ children, topbarContent }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:1024px)');
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--bg-main)' }}>
            <Box
                sx={{
                    width: isMobile ? 0 : (isSidebarOpen ? DRAWER_WIDTH : 0),
                    flexShrink: 0,
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.shorter,
                    }),
                    overflow: 'hidden'
                }}
            >
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={handleSidebarClose}
                />
            </Box>
            <Box
                component="main"
                className="main-content"
                sx={{
                    flexGrow: 1,
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.shorter,
                    }),
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    position: 'relative'
                }}
            >
                <Topbar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    drawerWidth={DRAWER_WIDTH}
                >
                    {topbarContent}
                </Topbar>

                <Toolbar sx={{ minHeight: 60 }} /> {/* Standard Offset Spacer */}

                <Box className="page-content">
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;

