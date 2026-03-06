
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Toolbar, Box, InputBase, Badge as MuiBadge, Stack, Avatar, Typography } from '@mui/material';

export const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => !['isSidebarOpen', 'drawerWidth'].includes(prop),
})(({ theme, isSidebarOpen, drawerWidth }) => ({
    width: '100%',
    marginLeft: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--glass-border)',
    zIndex: theme.zIndex.appBar,
    color: 'var(--text-main)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
        width: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        marginLeft: isSidebarOpen ? `${drawerWidth}px` : 0,
    },
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: 60,
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(1),
    },
    [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
}));

export const LeftSectionWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(1),
    },
}));

export const WorkspaceSwitcherWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.7),
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--input-border)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': { background: 'rgba(255,255,255,0.9)' },
    maxWidth: 40,
    [theme.breakpoints.up('sm')]: {
        maxWidth: 160,
    },
}));

export const WorkspaceIcon = styled(Box)(({ theme }) => ({
    width: 20,
    height: 20,
    borderRadius: 5,
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.6rem',
    fontWeight: 700,
    flexShrink: 0,
}));

export const WorkspaceNameText = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.82rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}));

export const SearchBox = styled(Box, {
    shouldForwardProp: (prop) => !['isTablet', 'searchOpen'].includes(prop),
})(({ theme, isTablet, searchOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: alpha('#fff', 0.5),
    border: '1px solid var(--input-border)',
    borderRadius: 20,
    padding: theme.spacing(0, 1),
    height: 32,
    minWidth: 40,
    maxWidth: 120,
    flexGrow: 1,
    flexShrink: 2,
    [theme.breakpoints.down('sm')]: { display: 'none' },
    [theme.breakpoints.up('sm')]: { maxWidth: 180 },
    [theme.breakpoints.up('md')]: { maxWidth: 220 },
    ...(isTablet && {
        position: 'absolute',
        right: 0,
        zIndex: 1,
        boxShadow: 'var(--glass-shadow)',
        backdropFilter: 'blur(10px)',
    }),
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    fontSize: '0.75rem',
    flex: 1,
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.5, 0),
    }
}));

export const StyledBadge = styled(MuiBadge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        fontSize: '0.6rem',
        height: 14,
        minWidth: 14,
        padding: '0 3px',
    },
    '& .MuiBadge-dot': {
        width: 7,
        height: 7,
        minWidth: 7,
        borderRadius: '50%',
    },
}));

export const UserAvatar = styled(Avatar, {
    shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
    width: 28,
    height: 28,
    fontSize: '0.65rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
    boxShadow: active ? `0 0 0 2px var(--color-primary)` : 'none',
    transition: 'box-shadow 0.15s',
}));

export const MenuPaperProps = {
    sx: {
        mt: 1,
        minWidth: 200,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--glass-shadow)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        p: 1.5
    }
};

export const WorkspaceMenuPaperProps = {
    sx: {
        ...MenuPaperProps.sx,
        minWidth: 220,
        maxHeight: 400,
        p: 0.5
    }
};
