
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Bell, LogOut, ChevronDown, ArrowLeft, PanelLeft, Settings } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    IconButton,
    Typography,
    Tooltip,
    useMediaQuery,
    useTheme,
    Avatar,
    Divider,
    Stack,
    Menu,
    MenuItem
} from '@mui/material';
import NotificationPanel from '../NotificationPanel';
import { useNotifications } from '../../contexts/NotificationContext';
import { logout, getUserData } from '../../services/authService';
import { getWorkspaces } from '../../services/workspaceService';
import {
    StyledAppBar,
    StyledToolbar,
    LeftSectionWrapper,
    WorkspaceSwitcherWrapper,
    WorkspaceIcon,
    WorkspaceNameText,
    SearchBox,
    StyledInputBase,
    StyledBadge,
    UserAvatar,
    MenuPaperProps,
    WorkspaceMenuPaperProps
} from './Topbar.styles';


const Topbar = ({ children, toggleSidebar, isSidebarOpen, drawerWidth }) => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px
    const isTablet = useMediaQuery('(max-width:1024px)');

    const { getUnreadCount } = useNotifications();
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElWs, setAnchorElWs] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const unreadCount = getUnreadCount();

    const handleSearchSubmit = () => {
        const q = searchQuery.trim();
        if (!q) return;
        if (workspaceId) {
            navigate(`/workspace/${workspaceId}/content?search=${encodeURIComponent(q)}`);
        }
        setSearchOpen(false);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchSubmit();
        if (e.key === 'Escape') {
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    // Workspace switcher state
    const [workspaces, setWorkspaces] = useState([]);
    const user = getUserData();
    const userName = user
        ? `${user.first_name || ''} ${user.last_name || ''} `.trim() || user.email || 'User'
        : 'User';
    const userEmail = user?.email || '';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    useEffect(() => {
        if (!workspaceId) return;
        getWorkspaces()
            .then((data) => {
                const list = Array.isArray(data) ? data : (data.results || data.data || []);
                setWorkspaces(list);
            })
            .catch(() => { });
    }, [workspaceId]);

    const handleOpenUserMenu = (event) => setAnchorElUser(prev => prev ? null : event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleOpenWsMenu = (event) => setAnchorElWs(prev => prev ? null : event.currentTarget);
    const handleCloseWsMenu = () => setAnchorElWs(null);

    const handleNotificationClick = (postId) => {
        if (workspaceId) {
            navigate(`/workspace/${workspaceId}/content`);
        }
        setIsNotificationPanelOpen(false);
    };

    const currentWs = workspaces.find((ws) => String(ws.id) === String(workspaceId));

    return (
        <>
            <StyledAppBar
                position="fixed"
                elevation={0}
                isSidebarOpen={isSidebarOpen}
                drawerWidth={drawerWidth}
            >
                <StyledToolbar>
                    {/* Left Section */}
                    <LeftSectionWrapper>
                        {toggleSidebar && (
                            <IconButton
                                onClick={toggleSidebar}
                                size="small"
                                sx={{ color: 'var(--text-main)', opacity: 0.7, '&:hover': { opacity: 1 }, flexShrink: 0 }}
                            >
                                <PanelLeft size={20} />
                            </IconButton>
                        )}

                        {workspaceId && (
                            <Stack direction="row" alignItems="center" gap={theme.spacing(0.5)} sx={{ minWidth: 0, flexShrink: 0 }}>
                                <Tooltip title="Switch Workspace">
                                    <WorkspaceSwitcherWrapper onClick={handleOpenWsMenu}>
                                        <WorkspaceIcon>
                                            {currentWs ? currentWs.name.charAt(0) : '?'}
                                        </WorkspaceIcon>
                                        {!isTablet && (
                                            <WorkspaceNameText variant="body2">
                                                {currentWs ? currentWs.name : 'Workspace'}
                                            </WorkspaceNameText>
                                        )}
                                        <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                                    </WorkspaceSwitcherWrapper>
                                </Tooltip>

                                <Menu
                                    anchorEl={anchorElWs}
                                    open={Boolean(anchorElWs)}
                                    onClose={handleCloseWsMenu}
                                    PaperProps={WorkspaceMenuPaperProps}
                                >
                                    <Typography variant="overline" sx={{ px: 1.5, py: 0.5, display: 'block', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        Workspaces
                                    </Typography>
                                    {workspaces.map((ws) => (
                                        <MenuItem
                                            key={ws.id}
                                            onClick={() => { navigate(`/workspace/${ws.id}/content`); handleCloseWsMenu(); }}
                                            sx={{
                                                borderRadius: 'var(--radius-sm)',
                                                gap: 1.5,
                                                bgcolor: String(ws.id) === String(workspaceId) ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                                color: String(ws.id) === String(workspaceId) ? 'var(--color-primary)' : 'inherit',
                                                fontWeight: String(ws.id) === String(workspaceId) ? 600 : 400
                                            }}
                                        >
                                            <WorkspaceIcon sx={{ width: 24, height: 24, borderRadius: 1.5, fontSize: '0.65rem' }}>
                                                {ws.name.charAt(0)}
                                            </WorkspaceIcon>
                                            <Typography variant="body2">{ws.name}</Typography>
                                        </MenuItem>
                                    ))}
                                    <Divider sx={{ my: 0.5 }} />
                                    <MenuItem onClick={() => { navigate('/workspace'); handleCloseWsMenu(); }} sx={{ gap: 1.5, color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)' }}>
                                        <ArrowLeft size={14} />
                                        <Typography variant="body2">All Workspaces</Typography>
                                    </MenuItem>
                                </Menu>

                                {children && !isMobile && (
                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', ml: 0, mr: 0.5 }}>/</Typography>
                                )}
                            </Stack>
                        )}

                        {children && (
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    display: { xs: searchOpen ? 'none' : 'flex', sm: 'flex' },
                                    flex: 1,
                                    minWidth: 0,
                                    overflow: 'hidden'
                                }}
                            >
                                {children}
                            </Stack>
                        )}
                    </LeftSectionWrapper>

                    {/* Right Section */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ xs: 0.5, sm: 1, md: 2 }}
                        sx={{ flexShrink: 0, minWidth: 0 }}
                    >
                        {/* Search */}
                        <Stack direction="row" alignItems="center" sx={{ position: 'relative', display: { xs: searchOpen ? 'flex' : 'none', sm: 'flex' } }}>
                            {(!isTablet || searchOpen) && (
                                <SearchBox isTablet={isTablet} searchOpen={searchOpen}>
                                    <SearchIcon
                                        size={14}
                                        style={{ color: 'var(--text-muted)', marginRight: 8, flexShrink: 0, cursor: searchQuery ? 'pointer' : 'default' }}
                                        onClick={handleSearchSubmit}
                                    />
                                    <StyledInputBase
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        onBlur={() => { isTablet && setSearchOpen(false); }}
                                        autoFocus={isTablet && searchOpen}
                                    />
                                </SearchBox>
                            )}
                            {isTablet && !searchOpen && (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchOpen(true)}
                                    sx={{ flexShrink: 0 }}
                                >
                                    <SearchIcon size={18} />
                                </IconButton>
                            )}
                        </Stack>

                        {/* Notifications */}
                        <Tooltip title="Notifications">
                            <IconButton
                                onClick={() => setIsNotificationPanelOpen(prev => !prev)}
                                size="small"
                                sx={{ color: 'var(--text-muted)', flexShrink: 0 }}
                            >
                                <StyledBadge
                                    badgeContent={unreadCount > 99 ? '99+' : unreadCount}
                                    color="secondary"
                                    variant={unreadCount > 0 && unreadCount <= 9 ? "dot" : "standard"}
                                >
                                    <Bell size={18} />
                                </StyledBadge>
                            </IconButton>
                        </Tooltip>

                        {/* User Profile */}
                        <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    size="small"
                                    sx={{ p: 0 }}
                                >
                                    <UserAvatar active={Boolean(anchorElUser)}>
                                        {userInitials}
                                    </UserAvatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                PaperProps={MenuPaperProps}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1 }}>
                                    <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', fontWeight: 600, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                                        {userInitials}
                                    </Avatar>
                                    <Stack sx={{ minWidth: 0 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {userName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                                            {userEmail}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                {workspaceId && (
                                    <MenuItem
                                        onClick={() => { navigate(`/workspace/${workspaceId}/settings`); handleCloseUserMenu(); }}
                                        sx={{ borderRadius: 'var(--radius-sm)', gap: 1.25 }}
                                    >
                                        <Settings size={15} />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography>
                                    </MenuItem>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <MenuItem onClick={logout} sx={{ borderRadius: 'var(--radius-sm)', color: '#ef4444', gap: 1.25 }}>
                                    <LogOut size={15} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Log Out</Typography>
                                </MenuItem>
                            </Menu>
                        </Stack>
                    </Stack>
                </StyledToolbar>
            </StyledAppBar>

            <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
                onNotificationClick={handleNotificationClick}
            />
        </>
    );
};


export default Topbar;

