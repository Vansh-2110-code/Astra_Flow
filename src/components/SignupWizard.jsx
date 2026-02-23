import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, User, Mail, Lock, Globe, AlertCircle, Eye, EyeOff } from 'lucide-react';
// Restructured signup to 2-step flow; backend register integration
import { registerUser } from '../services/authService';
// Added toast notification system
import Toast from './ui/Toast';
import '../styles/login.css';

// Reusable Input with Icon Logic
const FormInput = ({ type = "text", placeholder, value, onChange, icon: Icon, isPassword = false, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="input-wrapper" style={{ position: 'relative' }}>
            <style>{`
                input::-ms-reveal,
                input::-ms-clear {
                    display: none;
                }
            `}</style>
            <input
                type={inputType}
                className="form-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{
                    paddingRight: isPassword ? '2.5rem' : '1rem',
                    paddingLeft: (Icon && isPassword) ? '2.5rem' : (Icon ? '1rem' : '1rem'),
                    height: '48px'
                }}
                {...props}
            />

            {Icon && isPassword && (
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
                    <Icon size={18} />
                </div>
            )}

            {Icon && !isPassword && (
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
                    <Icon size={18} />
                </div>
            )}

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: 0,
                        display: 'flex',
                        zIndex: 10,
                        height: '100%',
                        alignItems: 'center'
                    }}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
};

// Step 1: Email + Password (restructured signup to 2-step flow; removed username field)
const Step1Credentials = ({ onNext, data, updateData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="login-header">
                <h2>Create Account</h2>
                <p>Let's get you set up.</p>
            </div>

            <div className="form-group">
                <label className="input-label-static">Email</label>
                <FormInput
                    type="email"
                    placeholder="name@company.com"
                    value={data.email}
                    onChange={(e) => updateData('email', e.target.value)}
                    icon={Mail}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label className="input-label-static">Password</label>
                    <FormInput
                        isPassword
                        placeholder="Min 8 chars"
                        value={data.password}
                        onChange={(e) => updateData('password', e.target.value)}
                        icon={Lock}
                    />
                </div>
                <div className="form-group">
                    <label className="input-label-static">Confirm Password</label>
                    <FormInput
                        isPassword
                        placeholder="Retype password"
                        value={data.confirmPassword}
                        onChange={(e) => updateData('confirmPassword', e.target.value)}
                        icon={Lock}
                    />
                </div>
            </div>

            <button type="button" className="btn-primary" onClick={onNext}>
                Next Step <ArrowRight size={18} />
            </button>
        </motion.div>
    );
};

// Step 2: First Name, Last Name, Time Zone — submit calls backend (updated backend payload structure)
const STEP2_TIMEZONES = [
    { label: 'UTC', value: 'UTC' },
    { label: 'Asia/Kolkata (IST)', value: 'Asia/Kolkata' },
    { label: 'America/New_York (EST)', value: 'America/New_York' },
    { label: 'America/Los_Angeles (PST)', value: 'America/Los_Angeles' },
    { label: 'Europe/London (GMT)', value: 'Europe/London' },
    { label: 'Europe/Paris (CET)', value: 'Europe/Paris' },
    { label: 'Australia/Sydney (AEST)', value: 'Australia/Sydney' },
];

const Step2Profile = ({ onSubmit, onBack, data, updateData, loading, error }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="login-header">
                <h2>Profile Details</h2>
                <p>Tell us a bit about yourself.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label className="input-label-static">First Name</label>
                    <FormInput
                        placeholder="John"
                        value={data.firstName}
                        onChange={(e) => updateData('firstName', e.target.value)}
                        icon={User}
                    />
                </div>
                <div className="form-group">
                    <label className="input-label-static">Last Name</label>
                    <FormInput
                        placeholder="Doe"
                        value={data.lastName}
                        onChange={(e) => updateData('lastName', e.target.value)}
                        icon={User}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="input-label-static">Time Zone</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                    <select
                        className="themed-select"
                        value={data.timeZone}
                        onChange={(e) => updateData('timeZone', e.target.value)}
                        style={{ height: '48px' }}
                    >
                        {STEP2_TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
                        <Globe size={18} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-banner" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="wizard-actions">
                <button type="button" className="btn-secondary" onClick={onBack} disabled={loading}>
                    <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className="btn-primary" onClick={onSubmit} disabled={loading}>
                    {loading ? (
                        <>
                            <div className="spinner" style={{ width: 18, height: 18 }} />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>Create Account <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

const SuccessStep = () => (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        style={{ textAlign: 'center', padding: '2rem 0' }}
    >
        <div style={{
            width: 80, height: 80,
            background: 'var(--input-success)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'white',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
        }}>
            <Check size={40} strokeWidth={3} />
        </div>
        <h2>All Set!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to login...</p>
    </motion.div>
);

const TOTAL_STEPS = 2;

const SignupWizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        timeZone: 'UTC',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    const updateData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    // Added validation for step 1: email, password, confirm password
    const validateStep1 = () => {
        const { email, password, confirmPassword } = formData;
        if (!email || !password || !confirmPassword) {
            return 'Email and password fields are required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return 'Please enter a valid email address.';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match.';
        }
        return null;
    };

    // Added validation for step 2: first name, last name, time zone
    const validateStep2 = () => {
        const { firstName, lastName, timeZone } = formData;
        if (!firstName || !firstName.trim()) {
            return 'First name is required.';
        }
        if (!lastName || !lastName.trim()) {
            return 'Last name is required.';
        }
        if (!timeZone || !timeZone.trim()) {
            return 'Time zone is required.';
        }
        return null;
    };

    const handleNextFromStep1 = () => {
        const err = validateStep1();
        if (err) {
            showToast('error', err);
            return;
        }
        nextStep();
    };

    const handleFinalSubmit = async () => {
        setError('');

        const step1Err = validateStep1();
        if (step1Err) {
            showToast('error', step1Err);
            return;
        }
        const step2Err = validateStep2();
        if (step2Err) {
            showToast('error', step2Err);
            return;
        }

        setLoading(true);

        const payload = {
            email: formData.email.trim(),
            password: formData.password,
            confirm_password: formData.confirmPassword,
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            timezone: formData.timeZone,
        };

        console.log('Submitting payload:', payload);

        try {
            const result = await registerUser(payload);

            if (result && result.status === false) {
                const msg = result.message || 'Registration failed';
                setError(msg);
                showToast('error', msg);
                return;
            }

            showToast('success', result.message || 'Registration successful');
            setStep(3);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const msg = err.message || 'Registration failed';
            setError(msg);
            showToast('error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card wizard-card">
            {step <= TOTAL_STEPS && (
                <div className="wizard-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
                    </div>
                    <span className="step-count">Step {step} of {TOTAL_STEPS}</span>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <Step1Credentials
                        key="s1"
                        onNext={handleNextFromStep1}
                        data={formData}
                        updateData={updateData}
                    />
                )}
                {step === 2 && (
                    <Step2Profile
                        key="s2"
                        onSubmit={handleFinalSubmit}
                        onBack={prevStep}
                        data={formData}
                        updateData={updateData}
                        loading={loading}
                        error={error}
                    />
                )}
                {step === 3 && <SuccessStep key="success" />}
            </AnimatePresence>

            {step === 1 && (
                <div className="signup-link">
                    Already have an account?
                    <Link to="/login">Log in</Link>
                </div>
            )}

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default SignupWizard;
