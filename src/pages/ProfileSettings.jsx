import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Lock, Bell, User, Camera, Loader2, Check, AlertTriangle, KeyRound, Monitor, Shield, Eye, EyeOff } from 'lucide-react';
import { getProfile, updateProfile, uploadAvatar, changePassword } from '../services/userService';

const TABS = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'security', label: 'Security & Password', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell }
];

const GENDER_OPTIONS = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" }
];

const ProfileSettings = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [toast, setToast] = useState(null);

    // Profile State
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'Prefer not to say',
        avatar: null
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Password State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passSaving, setPassSaving] = useState(false);

    // 2FA and Sessions State (Simulated)
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [sessions, setSessions] = useState([
        { id: 1, os: 'Windows 11', browser: 'Chrome', active: true, location: 'San Francisco, USA', date: 'Active now' },
        { id: 2, os: 'macOS Sequoia', browser: 'Safari', active: false, location: 'New York, USA', date: 'Feb 8, 2026' }
    ]);

    // Notifications State
    const [notifications, setNotifications] = useState(() => {
        try {
            const stored = localStorage.getItem('user_notification_preferences');
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse user notification preferences', e);
        }
        return {
            emailAlerts: true,
            pushAlerts: false,
            inAppAlerts: true,
            onComment: true,
            onApproval: true,
            onWeeklySummary: false,
            onMention: true
        };
    });

    // Load Profile
    useEffect(() => {
        const fetchProfile = async () => {
            setLoadingProfile(true);
            try {
                const data = await getProfile();
                setProfile({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    dob: data.dob || '',
                    gender: data.gender || 'Prefer not to say',
                    avatar: data.avatar || null
                });
            } catch (err) {
                console.error('Failed to fetch profile from API, falling back to local storage:', err);
                const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
                setProfile({
                    firstName: userData.first_name || 'Alex',
                    lastName: userData.last_name || 'Rivera',
                    email: userData.email || 'alex.rivera@example.com',
                    phone: userData.phone || '+1 (555) 000-0000',
                    dob: userData.dob || '1995-06-15',
                    gender: userData.gender || 'Male',
                    avatar: userData.avatar || null
                });
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    // Save Notifications Preferences
    useEffect(() => {
        localStorage.setItem('user_notification_preferences', JSON.stringify(notifications));
    }, [notifications]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                first_name: profile.firstName,
                last_name: profile.lastName,
                phone: profile.phone,
                dob: profile.dob,
                gender: profile.gender
            };
            const updated = await updateProfile(payload);
            setProfile(prev => ({
                ...prev,
                firstName: updated.first_name || prev.firstName,
                lastName: updated.last_name || prev.lastName,
                phone: updated.phone || prev.phone,
                dob: updated.dob || prev.dob,
                gender: updated.gender || prev.gender
            }));

            // Sync user data to auth local/session storage
            const isLocal = !!localStorage.getItem('user');
            const storage = isLocal ? localStorage : sessionStorage;
            const storedUser = JSON.parse(storage.getItem('user') || '{}');
            storage.setItem('user', JSON.stringify({ ...storedUser, ...updated }));

            setToast({ type: 'success', message: 'Profile updated successfully!' });
        } catch (err) {
            console.error('Failed to update profile:', err);
            setToast({ type: 'error', message: err.message || 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check: max 2MB
        if (file.size > 2 * 1024 * 1024) {
            setToast({ type: 'error', message: 'File is too large. Max size of 2MB.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setAvatarLoading(true);
        try {
            const data = await uploadAvatar(file);
            setProfile(prev => ({ ...prev, avatar: data.avatar }));
            
            // Sync user storage
            const isLocal = !!localStorage.getItem('user');
            const storage = isLocal ? localStorage : sessionStorage;
            const storedUser = JSON.parse(storage.getItem('user') || '{}');
            storage.setItem('user', JSON.stringify({ ...storedUser, avatar: data.avatar }));

            setToast({ type: 'success', message: 'Profile picture updated successfully!' });
        } catch (err) {
            console.error('Failed to upload avatar:', err);
            setToast({ type: 'error', message: err.message || 'Failed to upload image.' });
        } finally {
            setAvatarLoading(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setToast({ type: 'error', message: 'Please fill in all password fields.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setToast({ type: 'error', message: 'New password and confirm password do not match.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setPassSaving(true);
        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setToast({ type: 'success', message: 'Password updated successfully!' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error('Failed to change password:', err);
            setToast({ type: 'error', message: err.message || 'Failed to update password. Check your current password.' });
        } finally {
            setPassSaving(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleRevokeSession = (id) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        setToast({ type: 'success', message: 'Session revoked successfully.' });
        setTimeout(() => setToast(null), 3000);
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const userInitials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'U';

    const navStyle = (id) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        background: activeTab === id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: activeTab === id ? 'var(--color-primary)' : 'var(--text-main)',
        fontWeight: activeTab === id ? 600 : 500,
        fontSize: '0.9rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s'
    });

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Profile Settings</h1>
                <p className="text-muted">Manage your personal information, login security, and notifications.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Tabs Sidebar */}
                <nav style={{
                    position: 'sticky',
                    top: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    padding: '0.5rem',
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'white'
                }}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            style={navStyle(id)}
                        >
                            {React.createElement(Icon, { size: 18 })}
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div style={{ minWidth: 0 }}>
                    {loadingProfile ? (
                        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
                                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Loading settings...</span>
                            </div>
                        </Card>
                    ) : (
                        <>
                            {/* Profile Details Tab */}
                            {activeTab === 'profile' && (
                                <Card>
                                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Personal Details</h3>
                                    <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '2rem' }}>
                                        {/* Avatar Selection */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                            <div style={{ position: 'relative' }}>
                                                {profile.avatar ? (
                                                    <img 
                                                        src={profile.avatar} 
                                                        alt="Avatar" 
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '2rem',
                                                        fontWeight: 600,
                                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                                    }}>
                                                        {userInitials}
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('avatar-file-input').click()}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        background: 'white',
                                                        border: '1px solid var(--input-border)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    {avatarLoading ? <Loader2 className="animate-spin" size={14} /> : <Camera size={16} color="var(--text-muted)" />}
                                                </button>
                                                <input 
                                                    id="avatar-file-input"
                                                    type="file" 
                                                    style={{ display: 'none' }} 
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    disabled={avatarLoading}
                                                />
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Profile Picture</h4>
                                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>JPG, GIF or PNG. Max size of 2MB.</p>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        style={{ fontSize: '0.85rem' }}
                                                        onClick={() => document.getElementById('avatar-file-input').click()}
                                                        disabled={avatarLoading}
                                                    >
                                                        Upload New
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Fields Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>First name</label>
                                                <input
                                                    className="input"
                                                    type="text"
                                                    value={profile.firstName}
                                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                    style={{ width: '100%' }}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Last name</label>
                                                <input
                                                    className="input"
                                                    type="text"
                                                    value={profile.lastName}
                                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                    style={{ width: '100%' }}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Phone number</label>
                                                <input
                                                    className="input"
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    style={{ width: '100%' }}
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Date of Birth</label>
                                                <input
                                                    className="input"
                                                    type="date"
                                                    value={profile.dob}
                                                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Gender</label>
                                                <select
                                                    className="themed-select"
                                                    value={profile.gender}
                                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                                    style={{ width: '100%' }}
                                                >
                                                    {GENDER_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email Address</label>
                                                <input
                                                    className="input"
                                                    type="email"
                                                    value={profile.email}
                                                    readOnly
                                                    style={{ width: '100%', background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                            <Button type="button" variant="ghost" onClick={() => window.location.reload()}>Cancel</Button>
                                            <Button type="submit" variant="primary" disabled={saving}>
                                                {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Password Change */}
                                    <Card>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <KeyRound size={20} color="var(--color-primary)" />
                                            <h3 className="text-h3" style={{ margin: 0 }}>Change Password</h3>
                                        </div>
                                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div>
                                                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Current Password</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        className="input"
                                                        type={showPasswords.current ? 'text' : 'password'}
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                        style={{ width: '100%', paddingRight: '2.5rem' }}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePasswordVisibility('current')}
                                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                                    >
                                                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>New Password</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            className="input"
                                                            type={showPasswords.new ? 'text' : 'password'}
                                                            value={passwordForm.newPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePasswordVisibility('new')}
                                                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                                        >
                                                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Confirm New Password</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            className="input"
                                                            type={showPasswords.confirm ? 'text' : 'password'}
                                                            value={passwordForm.confirmPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePasswordVisibility('confirm')}
                                                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                                                        >
                                                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                <Button type="submit" variant="primary" disabled={passSaving}>
                                                    {passSaving ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                                                </Button>
                                            </div>
                                        </form>
                                    </Card>

                                    {/* 2FA */}
                                    <Card>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 className="text-h3" style={{ margin: '0 0 0.25rem 0' }}>Two-Factor Authentication (2FA)</h3>
                                                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Add an extra layer of security to your account by requiring a verification code at login.</p>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={twoFAEnabled}
                                                onClick={() => setTwoFAEnabled(v => !v)}
                                                style={{
                                                    width: 44,
                                                    height: 24,
                                                    borderRadius: 12,
                                                    border: 'none',
                                                    background: twoFAEnabled ? 'var(--color-primary)' : '#d1d5db',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'background 0.2s',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    left: twoFAEnabled ? 22 : 2,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    transition: 'left 0.2s'
                                                }} />
                                            </button>
                                        </div>
                                    </Card>

                                    {/* Active Sessions */}
                                    <Card>
                                        <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Active Sessions</h3>
                                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>You are currently logged in to your account on these devices. Revoke any unfamiliar session.</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {sessions.map(s => (
                                                <div 
                                                    key={s.id} 
                                                    style={{ 
                                                        padding: '1rem', 
                                                        background: 'rgba(0,0,0,0.01)', 
                                                        borderRadius: 'var(--radius-md)', 
                                                        border: '1px solid var(--input-border)', 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center' 
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ 
                                                            width: 40, 
                                                            height: 40, 
                                                            borderRadius: '50%', 
                                                            background: 'rgba(99, 102, 241, 0.1)', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            color: 'var(--color-primary)'
                                                        }}>
                                                            <Monitor size={20} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                                {s.browser} on {s.os}
                                                                {s.active && <span style={{ marginLeft: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Current</span>}
                                                            </div>
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{s.location} • {s.date}</div>
                                                        </div>
                                                    </div>
                                                    {!s.active && (
                                                        <Button 
                                                            type="button"
                                                            variant="ghost" 
                                                            style={{ fontSize: '0.8rem', color: '#dc2626' }}
                                                            onClick={() => handleRevokeSession(s.id)}
                                                        >
                                                            Revoke
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            {sessions.length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>No other active sessions.</div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <Card>
                                    <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Notification Channels</h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Configure how and where you want to receive notifications.</p>

                                    {/* Channels */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--input-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Email Notifications</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Receive updates, digests, and action items via email.</div>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={notifications.emailAlerts}
                                                onClick={() => toggleNotification('emailAlerts')}
                                                style={{
                                                    width: 44,
                                                    height: 24,
                                                    borderRadius: 12,
                                                    border: 'none',
                                                    background: notifications.emailAlerts ? 'var(--color-primary)' : '#d1d5db',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'background 0.2s',
                                                    marginLeft: 'auto'
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    left: notifications.emailAlerts ? 22 : 2,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    transition: 'left 0.2s'
                                                }} />
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--input-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Push Notifications</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Receive real-time notifications on your browser/device.</div>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={notifications.pushAlerts}
                                                onClick={() => toggleNotification('pushAlerts')}
                                                style={{
                                                    width: 44,
                                                    height: 24,
                                                    borderRadius: 12,
                                                    border: 'none',
                                                    background: notifications.pushAlerts ? 'var(--color-primary)' : '#d1d5db',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'background 0.2s',
                                                    marginLeft: 'auto'
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    left: notifications.pushAlerts ? 22 : 2,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    transition: 'left 0.2s'
                                                }} />
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', paddingBottom: '1rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>In-App Notifications</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>See bell-icon notification highlights while inside the workspace.</div>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={notifications.inAppAlerts}
                                                onClick={() => toggleNotification('inAppAlerts')}
                                                style={{
                                                    width: 44,
                                                    height: 24,
                                                    borderRadius: 12,
                                                    border: 'none',
                                                    background: notifications.inAppAlerts ? 'var(--color-primary)' : '#d1d5db',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'background 0.2s',
                                                    marginLeft: 'auto'
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    left: notifications.inAppAlerts ? 22 : 2,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    transition: 'left 0.2s'
                                                }} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Email & Push Preferences</h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select which events trigger email or push updates.</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={notifications.onComment}
                                                onChange={() => toggleNotification('onComment')}
                                                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>When someone comments on my posts/activity</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={notifications.onApproval}
                                                onChange={() => toggleNotification('onApproval')}
                                                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>When a post approval status changes</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={notifications.onMention}
                                                onChange={() => toggleNotification('onMention')}
                                                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>When I am @mentioned in workspace threads</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={notifications.onWeeklySummary}
                                                onChange={() => toggleNotification('onWeeklySummary')}
                                                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Receive weekly analytics summary reports</span>
                                        </label>
                                    </div>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    padding: '1rem 1.5rem',
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {toast.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                    <span style={{ fontWeight: 500 }}>{toast.message}</span>
                </div>
            )}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default ProfileSettings;
