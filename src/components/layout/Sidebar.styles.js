
import { styled, alpha } from '@mui/material/styles';
import { Drawer, Box, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

const DRAWER_WIDTH = 260;

export const StyledDrawer = styled(Drawer)(() => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: DRAWER_WIDTH,
        boxSizing: 'border-box',
        border: 'none',
        backgroundColor: 'transparent'
    },
}));

export const SidebarWrapper = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid var(--glass-border)',
    padding: '16px 12px'
}));

export const LogoWrapper = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

export const LogoIcon = styled(Box)(() => ({
    width: 24,
    height: 24,
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 700
}));

export const LogoText = styled(Typography)(() => ({
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-primary)'
}));

export const NavItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 'var(--radius-sm)',
    minHeight: 40,
    color: 'var(--text-muted)',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    marginBottom: theme.spacing(0.25),
    '&.active': {
        backgroundColor: alpha('#6366f1', 0.08),
        color: 'var(--color-primary)',
        fontWeight: 600,
        '& .MuiListItemIcon-root': { color: 'var(--color-primary)' }
    },
    '&:hover': {
        backgroundColor: alpha('#6366f1', 0.05),
        color: 'var(--color-primary)'
    }
}));

export const NavIcon = styled(ListItemIcon)(() => ({
    minWidth: 32,
    color: 'inherit'
}));

export const NavText = styled(ListItemText)(() => ({
    '& .MuiListItemText-primary': {
        fontSize: '0.8rem',
        fontWeight: 'inherit'
    }
}));

export const SectionHeader = styled(Typography)(({ theme }) => ({
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    padding: theme.spacing(1, 1.5),
    display: 'block'
}));

export const AppItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 'var(--radius-sm)',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    marginBottom: theme.spacing(0.25),
    color: 'var(--text-muted)',
    '&:hover': { backgroundColor: alpha('#000', 0.02) }
}));

export const AccountItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => !['isSelected', 'brandColor'].includes(prop),
})(({ theme, isSelected, brandColor }) => ({
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    borderRadius: 'var(--radius-sm)',
    position: 'relative',
    color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
    fontWeight: isSelected ? 600 : 500,
    '&::before': isSelected ? {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 4,
        bottom: 4,
        width: 3,
        backgroundColor: brandColor,
        borderRadius: 4
    } : {},
    '&:hover': { backgroundColor: alpha('#000', 0.02) }
}));

export const PresenceCount = styled(Box)(({ theme }) => ({
    minWidth: 20,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 600,
    marginRight: theme.spacing(1)
}));

export const UserProfileButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 'var(--radius-sm)',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    '&:hover': { backgroundColor: alpha('#6366f1', 0.05) }
}));

export const UserProfileAvatar = styled(Box)(({ theme }) => ({
    width: 32,
    height: 32,
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 600,
    marginRight: theme.spacing(1.5),
    flexShrink: 0,
}));

export const AccountNavIcon = styled(ListItemIcon, {
    shouldForwardProp: (prop) => !['isSelected', 'brandColor'].includes(prop),
})(({ isSelected, brandColor }) => ({
    minWidth: 24,
    color: isSelected ? brandColor : 'inherit'
}));
