
import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    CheckSquare,
    Image,
    BarChart2,
    Users,
    Settings,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Music,
    LayoutGrid,
    Youtube,
    MessageCircle,
    Globe,
    ChevronDown
} from 'lucide-react';
import {
    List,
    ListItem,
    Collapse,
    Typography,
    useMediaQuery,
    useTheme,
    Divider,
    Box
} from '@mui/material';
import { getUserData } from '../../services/authService';
import { getFacebookChannels } from '../../services/channelService';
import {
    StyledDrawer,
    SidebarWrapper,
    LogoWrapper,
    LogoIcon,
    LogoText,
    NavItemButton,
    NavIcon,
    NavText,
    SectionHeader,
    AppItemButton,
    AccountItemButton,
    AccountNavIcon,
    PresenceCount,
    UserProfileButton,
    UserProfileAvatar
} from './Sidebar.styles';

const Sidebar = ({ isOpen = true, onClose }) => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const baseUrl = `/workspace/${workspaceId}`;
    const [connectedAppsOpen, setConnectedAppsOpen] = useState(false);
    const [expandedApp, setExpandedApp] = useState(null);
    const [selectedAccounts, setSelectedAccounts] = useState({ 'Instagram': ['@main_account'], 'Facebook': ['@page1'], 'LinkedIn': ['@profile1'] });

    const user = getUserData();
    const userName = user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User'
        : 'User';
    const userEmail = user?.email || '';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const navItems = [
        { icon: FileText, label: 'Content', path: `${baseUrl}/content` },
        { icon: CheckSquare, label: 'Approvals', path: `${baseUrl}/approvals` },
        { icon: Image, label: 'Media Library', path: `${baseUrl}/media` },
        { icon: BarChart2, label: 'Analytics', path: `${baseUrl}/analytics` },
        { icon: Users, label: 'Team', path: `${baseUrl}/team` },
        { icon: Settings, label: 'Settings', path: `${baseUrl}/settings` },
    ];

    const baseConnectedApps = [
        { id: 'Instagram', icon: Instagram, name: 'Instagram', count: 2, color: '#E1306C', accounts: [{ handle: '@main_account' }, { handle: '@brand_account' }] },
        { id: 'LinkedIn', icon: Linkedin, name: 'LinkedIn', count: 1, color: '#0A66C2', accounts: [{ handle: '@profile1' }] },
        { id: 'Twitter', icon: Twitter, name: 'X (Twitter)', count: 2, color: '#000000', accounts: [{ handle: '@company' }, { handle: '@personal' }] },
        { id: 'TikTok', icon: Music, name: 'TikTok', count: 1, color: '#000000', accounts: [{ handle: '@brand' }] },
        { id: 'Pinterest', icon: LayoutGrid, name: 'Pinterest', count: 1, color: '#E60023', accounts: [{ handle: '@boards' }] },
        { id: 'YouTube', icon: Youtube, name: 'YouTube', count: 1, color: '#FF0000', accounts: [{ handle: '@channel' }] },
        { id: 'Slack', icon: MessageCircle, name: 'Slack', count: 1, color: '#4A154B', accounts: [{ handle: 'workspace' }] },
        { id: 'Google', icon: Globe, name: 'Google My Business', count: 1, color: '#4285F4', accounts: [{ handle: 'Location' }] },
    ];

    const [connectedApps, setConnectedApps] = useState(baseConnectedApps);

    useEffect(() => {
        if (!workspaceId) return;

        getFacebookChannels(workspaceId)
            .then(data => {
                if (data.channels && data.channels.length > 0) {
                    const fbAccounts = data.channels.map(ch => ({
                        id: ch.id,
                        handle: ch.name
                    }));

                    const dynamicFb = {
                        id: 'Facebook',
                        icon: Facebook,
                        name: 'Facebook',
                        count: fbAccounts.length,
                        color: '#1877F2',
                        accounts: fbAccounts
                    };

                    const newApps = [...baseConnectedApps];
                    newApps.splice(1, 0, dynamicFb);
                    setConnectedApps(newApps);
                } else {
                    setConnectedApps(baseConnectedApps);
                }
            })
            .catch(err => {
                console.error("Failed to load Facebook channels for Sidebar:", err);
                setConnectedApps(baseConnectedApps);
            });
    }, [workspaceId]);

    const handleConnectedAccountClick = (appId, handle, accountId) => {
        const list = selectedAccounts[appId] || [];
        const next = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
        setSelectedAccounts({ ...selectedAccounts, [appId]: next });

        if (!workspaceId) return;

        let view = 'feed';
        let platform = appId;
        if (appId === 'LinkedIn') view = 'list';

        const params = new URLSearchParams();
        params.append('platform', platform);
        params.append('view', view);
        if (accountId) params.append('channel_id', accountId);

        navigate(`${baseUrl}/content?${params.toString()}`);
        if (isMobile && onClose) onClose();
    };

    const drawerContent = (
        <SidebarWrapper>
            {/* Logo */}
            <LogoWrapper>
                <LogoIcon>L</LogoIcon>
                <LogoText variant="h6">LintCollab</LogoText>
            </LogoWrapper>

            {/* Navigation */}
            <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <NavItemButton
                            component={NavLink}
                            to={item.path}
                            onClick={() => isMobile && onClose && onClose()}
                        >
                            <NavIcon>
                                <item.icon size={16} />
                            </NavIcon>
                            <NavText primary={item.label} />
                        </NavItemButton>
                    </ListItem>
                ))}

                {/* Connected Apps Section */}
                <Box sx={{ mt: 1 }}>
                    <NavItemButton
                        onClick={() => setConnectedAppsOpen(!connectedAppsOpen)}
                        sx={{ '&:hover': { bgcolor: 'transparent' } }}
                    >
                        <SectionHeader component="span">CONNECTED APPS</SectionHeader>
                        <ChevronDown
                            size={12}
                            style={{
                                transform: connectedAppsOpen ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s',
                                color: 'var(--text-muted)'
                            }}
                        />
                    </NavItemButton>

                    <Collapse in={connectedAppsOpen}>
                        <List disablePadding>
                            {connectedApps.map((app) => (
                                <Box key={app.id}>
                                    <AppItemButton
                                        onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                                    >
                                        <NavIcon>
                                            <app.icon size={16} />
                                        </NavIcon>
                                        <NavText
                                            primary={app.name}
                                            primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: 500 }}
                                        />
                                        <PresenceCount>{app.count}</PresenceCount>
                                        <ChevronDown
                                            size={12}
                                            style={{
                                                transform: expandedApp === app.id ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </AppItemButton>

                                    <Collapse in={expandedApp === app.id}>
                                        <List disablePadding sx={{ ml: 2, mr: 0.5 }}>
                                            {app.accounts.map((acc) => {
                                                const isSelected = (selectedAccounts[app.id] || []).includes(acc.handle);
                                                return (
                                                    <AccountItemButton
                                                        key={acc.id || acc.handle}
                                                        isSelected={isSelected}
                                                        brandColor={app.color}
                                                        onClick={() => handleConnectedAccountClick(app.id, acc.handle, acc.id)}
                                                    >
                                                        <AccountNavIcon isSelected={isSelected} brandColor={app.color}>
                                                            <app.icon size={12} />
                                                        </AccountNavIcon>
                                                        <NavText
                                                            primary={acc.handle}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.7rem',
                                                                fontWeight: 'inherit',
                                                                noWrap: true
                                                            }}
                                                        />
                                                    </AccountItemButton>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                </Box>
                            ))}
                        </List>
                    </Collapse>
                </Box>
            </List>

            {/* User Profile */}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ pt: 1 }}>
                <UserProfileButton>
                    <UserProfileAvatar>{userInitials}</UserProfileAvatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600, noWrap: true }}>
                            {userName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', noWrap: true }}>
                            {userEmail || 'Member'}
                        </Typography>
                    </Box>
                </UserProfileButton>
            </Box>
        </SidebarWrapper>
    );

    return (
        <StyledDrawer
            variant={isMobile ? 'temporary' : 'persistent'}
            open={isOpen}
            onClose={onClose}
        >
            {drawerContent}
        </StyledDrawer>
    );
};

export default Sidebar;

