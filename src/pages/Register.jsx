import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillSphereLogo from '../components/SkillSphereLogo';
import SkillSphereCanvas from '../components/SkillSphereCanvas';
import SpotlightCard from '../components/SpotlightCard';
import MagneticButton from '../components/MagneticButton';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();

    const { username, email, password, role } = formData;

    useEffect(() => {
        const updateTheme = () => {
            setIsDarkMode(document.body.classList.contains('dark-theme'));
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleRoleSelect = (newRole) => {
        setFormData({ ...formData, role: newRole });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('userUpdated'));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please verify your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-viewport">
            {/* Interactive 3D Sphere Background Canvas */}
            <div className="auth-canvas-background">
                <SkillSphereCanvas isDark={isDarkMode} height="100%" interactive={true} />
            </div>

            {/* Glowing Glassmorphism Card */}
            <SpotlightCard float={true} className="auth-card">
                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <SkillSphereLogo size={48} showText={false} />
                    </div>

                    <div className="auth-badge">
                        <span className="hud-pulse-dot" />
                        <span>BUILDER ONBOARDING // 2026</span>
                    </div>

                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">
                        Join 5,200+ engineers building next-generation software, AI, and Web3 projects.
                    </p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            className="auth-error-box"
                        >
                            <AlertCircle size={18} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={onSubmit}>
                    {/* Role Selector Segmented Controls */}
                    <div className="auth-form-group">
                        <label className="auth-label">
                            <span>Choose Role</span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Required</span>
                        </label>
                        <div className="role-selector-container">
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('user')}
                                className={`role-pill-btn ${role === 'user' ? 'active' : ''}`}
                            >
                                <Zap size={16} className="role-pill-icon" />
                                <span>Builder / Talent</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('admin')}
                                className={`role-pill-btn ${role === 'admin' ? 'active' : ''}`}
                            >
                                <ShieldCheck size={16} className="role-pill-icon" />
                                <span>Organizer / Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Username Input */}
                    <div className="auth-form-group">
                        <label className="auth-label">
                            <span>Handle / Username</span>
                        </label>
                        <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={onChange}
                                placeholder="neo_builder"
                                required
                                className="auth-input"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="auth-form-group">
                        <label className="auth-label">
                            <span>Work / Personal Email</span>
                        </label>
                        <div className="auth-input-wrapper">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="neo@matrix.io"
                                required
                                className="auth-input"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="auth-form-group">
                        <div className="auth-label">
                            <span>Password</span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Min. 6 chars</span>
                        </div>
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="••••••••••••"
                                required
                                className="auth-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-btn"
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Magnetic Submit Button */}
                    <MagneticButton strength={0.25} style={{ width: '100%' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary auth-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="spin-animation" />
                                    <span>Creating Identity...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Builder Identity</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </MagneticButton>
                </form>

                <div className="auth-footer">
                    <span>Already a registered builder?</span>
                    <Link to="/login" className="auth-footer-link">
                        Initialize Session
                    </Link>
                </div>
            </SpotlightCard>
        </div>
    );
};

export default Register;
