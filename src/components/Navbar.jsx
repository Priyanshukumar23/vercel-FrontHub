import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import api from '../utils/api';
import SkillSphereLogo from './SkillSphereLogo';
import { ambientSound } from '../utils/ambientSound';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-theme');
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.body.classList.remove('dark-theme');
        } else {
            // Default to dark theme for premium builder aesthetic
            setIsDarkMode(true);
            document.body.classList.add('dark-theme');
        }
    }, []);

    // Scroll listener for transparent -> frosted glass header transition
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 25) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    useEffect(() => {
        const unsubscribe = ambientSound.subscribe((playing) => {
            setIsSoundPlaying(playing);
        });
        return unsubscribe;
    }, []);

    const handleSoundToggle = () => {
        ambientSound.toggle();
    };

    const checkUser = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        try {
            if (localStorage.getItem('token')) {
                const res = await api.get('/auth/me');
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            }
        } catch (err) {
            console.error('Failed to sync user data in navbar', err);
        }
    };

    useEffect(() => {
        checkUser();
        window.addEventListener('userUpdated', checkUser);
        return () => window.removeEventListener('userUpdated', checkUser);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('hasSeenTutorial');
        setUser(null);
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="navbar">
                <Link to="/" className="nav-brand">
                    <SkillSphereLogo size={36} showText={true} />
                </Link>

                <div className="nav-actions-desktop">
                    {/* Razorpay-inspired Ambient Sound Toggle */}
                    <button
                        onClick={handleSoundToggle}
                        className={`sound-toggle-btn ${isSoundPlaying ? 'active' : ''}`}
                        title={isSoundPlaying ? 'Mute ambient sound' : 'Play ambient audio'}
                    >
                        <div className={`sound-bars-container ${isSoundPlaying ? 'playing' : ''}`}>
                            <span className="sound-bar" />
                            <span className="sound-bar" />
                            <span className="sound-bar" />
                            <span className="sound-bar" />
                        </div>
                        <span className="sound-label">sound</span>
                    </button>

                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Light/Dark Theme">
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <Link to="/about" className="nav-link">About Us</Link>
                    <Link to="/explore" className="nav-link">Posts</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <Link to="/chat" className="nav-link">Global Chat</Link>

                            <div className="user-pill">
                                {user.profilePicture ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5003'}${user.profilePicture}`}
                                        alt={user.username}
                                        className="user-avatar"
                                    />
                                ) : (
                                    <div className="user-initial-avatar">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="user-name">{user.username}</span>
                            </div>

                            <button onClick={handleLogout} className="logout-btn" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-nav-drawer ${isMenuOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button
                        onClick={handleSoundToggle}
                        className={`sound-toggle-btn ${isSoundPlaying ? 'active' : ''}`}
                    >
                        <div className={`sound-bars-container ${isSoundPlaying ? 'playing' : ''}`}>
                            <span className="sound-bar" />
                            <span className="sound-bar" />
                            <span className="sound-bar" />
                            <span className="sound-bar" />
                        </div>
                        <span className="sound-label">sound</span>
                    </button>

                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <Link to="/about" className="nav-link">About Us</Link>
                <Link to="/explore" className="nav-link">Posts</Link>

                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <Link to="/chat" className="nav-link">Global Chat</Link>
                        <div className="user-pill" style={{ justifyContent: 'center', marginTop: '10px' }}>
                            <span className="user-name">Signed in as {user.username}</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: '10px' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                        <Link to="/login" className="btn btn-outline" style={{ textAlign: 'center' }}>Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ textAlign: 'center' }}>Get Started</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
