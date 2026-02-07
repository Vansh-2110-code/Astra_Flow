
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, User, Mail, Lock, Briefcase, Eye, EyeOff, Globe, Building, Users, Smartphone, Monitor, Sparkles, Megaphone } from 'lucide-react';
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

            {/* Left Icon (Lock) for Password Fields */}
            {Icon && isPassword && (
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
                    <Icon size={18} />
                </div>
            )}

            {/* Right Icon for standard inputs */}
            {Icon && !isPassword && (
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
                    <Icon size={18} />
                </div>
            )}

            {/* Password Toggle */}
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

// Reusable Option Card
const OptionCard = ({ icon: Icon, label, selected, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: '1.5rem',
            border: `2px solid ${selected ? 'var(--color-primary)' : 'transparent'}`,
            borderRadius: '16px',
            background: selected ? 'rgba(99, 102, 241, 0.04)' : 'var(--bg-card, #f8fafc)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: selected ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
            height: '140px',
            position: 'relative',
            overflow: 'hidden'
        }}
        className="option-card-hover"
    >
        <div style={{
            color: selected ? 'var(--color-primary)' : 'var(--text-muted)',
            transition: 'color 0.3s',
            background: selected ? 'white' : 'rgba(255,255,255,0.5)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: selected ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
        }}>
            <Icon size={28} strokeWidth={selected ? 2.5 : 2} />
        </div>
        <span style={{
            fontWeight: 600,
            color: selected ? 'var(--color-primary)' : 'var(--text-muted)',
            fontSize: '0.95rem',
            transition: 'all 0.3s',
            textAlign: 'center'
        }}>
            {label}
        </span>
        {selected && (
            <div style={{ position: 'absolute', top: 10, right: 10, color: 'var(--color-primary)' }}>
                <Check size={16} strokeWidth={3} />
            </div>
        )}
    </div>
);

// Step 1: Account
const Step1Account = ({ onNext, data, updateData }) => {
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
                <label className="input-label-static">Username</label>
                <FormInput
                    placeholder="johndoe"
                    value={data.username}
                    onChange={(e) => updateData('username', e.target.value)}
                    icon={User}
                />
            </div>

            <div className="form-group">
                <label className="input-label-static">Email ID</label>
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
                    <label className="input-label-static">Retype</label>
                    <FormInput
                        isPassword
                        placeholder="Confirm"
                        value={data.confirmPassword}
                        onChange={(e) => updateData('confirmPassword', e.target.value)}
                        icon={Lock}
                    />
                </div>
            </div>

            <button className="btn-primary" onClick={onNext} disabled={!data.email || !data.password}>
                Next Step <ArrowRight size={18} />
            </button>
        </motion.div>
    );
};

// Step 2: Profile
const Step2Profile = ({ onNext, onBack, data, updateData }) => {
    const timezones = [
        "UTC", "Asia/Kolkata (IST)", "America/New_York (EST)",
        "America/Los_Angeles (PST)", "Europe/London (GMT)",
        "Europe/Paris (CET)", "Australia/Sydney (AEST)"
    ];

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

            <div className="form-group">
                <label className="input-label-static">Full Name</label>
                <FormInput
                    placeholder="John Doe"
                    value={data.fullName}
                    onChange={(e) => updateData('fullName', e.target.value)}
                    icon={User}
                />
            </div>

            <div className="form-group">
                <label className="input-label-static">Role</label>
                <FormInput
                    placeholder="Enter your role (e.g. Marketing Manager)"
                    value={data.role}
                    onChange={(e) => updateData('role', e.target.value)}
                    icon={Briefcase}
                />
            </div>

            <div className="form-group">
                <label className="input-label-static">Time Zone</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                    <select
                        className="form-input"
                        value={data.timezone}
                        onChange={(e) => updateData('timezone', e.target.value)}
                        style={{
                            appearance: 'none',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            height: '48px'
                        }}
                    >
                        {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
                        <Globe size={18} />
                    </div>
                </div>
            </div>

            <div className="wizard-actions">
                <button className="btn-secondary" onClick={onBack}>
                    <ArrowLeft size={16} /> Back
                </button>
                <button className="btn-primary" onClick={onNext} disabled={!data.fullName || !data.role}>
                    Next Step <ArrowRight size={18} />
                </button>
            </div>
        </motion.div>
    );
};

// Step 3: Usage
const Step3Usage = ({ onNext, onBack, data, updateData }) => {
    // UPDATED OPTIONS
    const options = [
        { id: "creator", label: "Creator", icon: Sparkles },
        { id: "brand", label: "Brand", icon: Megaphone },
        { id: "marketing", label: "Marketing Team", icon: Users },
        { id: "client", label: "Client Work", icon: Briefcase }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="login-header">
                <h2>Usage Purpose</h2>
                <p>Why are you using this?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {options.map((opt) => (
                    <OptionCard
                        key={opt.id}
                        icon={opt.icon}
                        label={opt.label}
                        selected={data.usage === opt.id}
                        onClick={() => updateData('usage', opt.id)}
                    />
                ))}
            </div>

            <div className="wizard-actions">
                <button className="btn-secondary" onClick={onBack}>
                    <ArrowLeft size={16} /> Back
                </button>
                <button className="btn-primary" onClick={onNext} disabled={!data.usage}>
                    Next Step <ArrowRight size={18} />
                </button>
            </div>
        </motion.div>
    );
};

// Step 4: Team Size
const Step4TeamSize = ({ onConfirm, onBack, data, updateData }) => {
    const options = [
        { id: "just_me", label: "Just me", icon: User },
        { id: "2-5", label: "2–5 members", icon: Users },
        { id: "6-20", label: "6–20 members", icon: Users },
        { id: "20+", label: "20+ members", icon: Building }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="login-header">
                <h2>Team Size</h2>
                <p>Team size</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {options.map((opt) => (
                    <OptionCard
                        key={opt.id}
                        icon={opt.icon}
                        label={opt.label}
                        selected={data.teamSize === opt.id}
                        onClick={() => updateData('teamSize', opt.id)}
                    />
                ))}
            </div>

            <div className="wizard-actions">
                <button className="btn-secondary" onClick={onBack}>
                    <ArrowLeft size={16} /> Back
                </button>
                <button className="btn-primary" onClick={onConfirm} disabled={!data.teamSize}>
                    Create Account <ArrowRight size={18} />
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
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to your dashboard...</p>
    </motion.div>
);

const SignupWizard = () => {
    const navigate = useNavigate();
    const TOTAL_STEPS = 4;
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '',
        fullName: '', role: '', timezone: 'UTC', usage: '', teamSize: ''
    });

    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleFinalSubmit = () => {
        setStep(5); // Success step
        setTimeout(() => navigate('/workspace'), 2000);
    };

    return (
        <div className="login-card wizard-card">
            {step <= TOTAL_STEPS && (
                <div className="wizard-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
                    </div>
                    <span className="step-count">Step {step} of {TOTAL_STEPS}</span>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && <Step1Account key="s1" onNext={nextStep} data={formData} updateData={updateData} />}
                {step === 2 && <Step2Profile key="s2" onNext={nextStep} onBack={prevStep} data={formData} updateData={updateData} />}
                {step === 3 && <Step3Usage key="s3" onNext={nextStep} onBack={prevStep} data={formData} updateData={updateData} />}
                {step === 4 && <Step4TeamSize key="s4" onConfirm={handleFinalSubmit} onBack={prevStep} data={formData} updateData={updateData} />}
                {step === 5 && <SuccessStep key="success" />}
            </AnimatePresence>

            {step === 1 && (
                <div className="signup-link">
                    Already have an account?
                    <Link to="/login">Log in</Link>
                </div>
            )}
        </div>
    );
};

export default SignupWizard;
