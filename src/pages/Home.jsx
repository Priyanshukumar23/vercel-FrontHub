import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, Users, Trophy, Code2, Globe } from 'lucide-react';
import SkillSphereCanvas from '../components/SkillSphereCanvas';
import SpotlightCard from '../components/SpotlightCard';
import MagneticButton from '../components/MagneticButton';
import './Home.css';

const Home = () => {
    const [groups, setGroups] = useState([]);
    const [currentTime, setCurrentTime] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Sync theme state with body class for canvas colors
    useEffect(() => {
        const updateTheme = () => {
            setIsDarkMode(document.body.classList.contains('dark-theme'));
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Live Razorpay-style HUD clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds} UTC`);
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await api.get('/groups');
                setGroups(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className="home-container">
            {/* HERO SECTION WITH INTERACTIVE 3D SKILLSPHERE */}
            <section className="hero-viewport">
                {/* 3D Canvas Background Layer */}
                <div className="hero-canvas-wrapper">
                    <SkillSphereCanvas isDark={isDarkMode} height="100%" interactive={true} />
                </div>

                {/* Hero Overlay Content */}
                <div className="container hero-content-overlay">
                    {/* Top HUD Telemetry Row (Razorpay style) */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-hud-row"
                    >
                        <div className="hud-tag">
                            <span className="hud-pulse-dot" />
                            <span>SkillSphere / 2026</span>
                        </div>

                        <div className="hud-clock font-mono">
                            <span style={{ opacity: 0.5 }}>SYS_TIME: </span>{currentTime}
                        </div>
                    </motion.div>

                    {/* Razorpay-inspired Leading Statement */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="hero-lead-text"
                    >
                        The global arena connecting top engineers, designers, and innovators.
                    </motion.p>

                    {/* Massive Bold Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="hero-main-title"
                    >
                        We’re looking for builders who <span className="highlight-text">create</span>, not talk about it.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="hero-description"
                    >
                        Enter the talent nexus. Connect with high-velocity teams, join intense 48-hour buildathons, 
                        and showcase real projects to the world.
                    </motion.p>

                    {/* CTAs with Magnetic Physics */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="hero-actions"
                    >
                        <MagneticButton to="/register" strength={0.4}>
                            <button className="btn btn-primary hero-btn-main">
                                <Zap size={18} />
                                <span>Prove it.</span>
                                <ArrowUpRight size={18} />
                            </button>
                        </MagneticButton>

                        <MagneticButton to="/dashboard" strength={0.3}>
                            <button className="btn btn-outline hero-btn-secondary">
                                <Trophy size={18} />
                                <span>View Hackathons</span>
                            </button>
                        </MagneticButton>
                    </motion.div>

                    {/* Live Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.75 }}
                        className="hero-stats-grid"
                    >
                        <div className="stat-item">
                            <span className="stat-number">5,200+</span>
                            <span className="stat-label">Active Builders</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">48H</span>
                            <span className="stat-label">Rapid Sprints</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">₹25,00,000+</span>
                            <span className="stat-label">Prize Bounties</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: WHY SKILLSPHERE */}
            <section className="container why-section">
                <div className="section-header">
                    <span className="hud-tag">The Architecture</span>
                    <h2 className="section-title">Engineered For High-Output Creators</h2>
                    <p className="section-subtitle">
                        Every node on the SkillSphere is a live connection to real teammates, open bounties, and collaborative chatrooms.
                    </p>
                </div>

                <div className="features-grid">
                    <SpotlightCard float={true} floatDelay={0} className="feature-card">
                        <div className="feature-icon"><Code2 size={28} /></div>
                        <h3>Global Hackathons</h3>
                        <p>Compete in curated, high-stakes development contests with real cash bounties and enterprise mentorship.</p>
                    </SpotlightCard>

                    <SpotlightCard float={true} floatDelay={0.5} className="feature-card">
                        <div className="feature-icon"><Users size={28} /></div>
                        <h3>Dynamic Guilds</h3>
                        <p>Find co-founders, join specialized niche groups (AI, Rust, Web3, UI/UX), and build real startups.</p>
                    </SpotlightCard>

                    <SpotlightCard float={true} floatDelay={1} className="feature-card">
                        <div className="feature-icon"><Globe size={28} /></div>
                        <h3>Verified Proof of Work</h3>
                        <p>Showcase real code, feed updates, and peer-endorsed accomplishments directly on your live profile.</p>
                    </SpotlightCard>
                </div>
            </section>

            {/* SECTION 3: POPULAR GUILDS & GROUPS */}
            <section className="container" id="groups-section" style={{ marginTop: '90px' }}>
                <div className="section-header-split">
                    <div>
                        <span className="hud-tag">Ecosystem</span>
                        <h2 className="section-title">Popular Communities</h2>
                    </div>
                    <Link to="/explore" className="btn btn-outline">
                        <span>Browse Feed</span>
                        <ArrowUpRight size={16} />
                    </Link>
                </div>

                <div className="groups-grid">
                    {groups.map((group, index) => {
                        const groupImageUrl = group.image
                            ? (group.image.startsWith('http') ? group.image : `${api.defaults.baseURL.replace('/api', '')}${group.image}`)
                            : null;

                        return (
                            <SpotlightCard
                                key={group._id}
                                float={true}
                                floatDelay={index * 0.2}
                                className="group-card-spotlight"
                                style={{
                                    backgroundImage: groupImageUrl ? `linear-gradient(rgba(7,10,17,0.35), rgba(7,10,17,0.85)), url(${groupImageUrl})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '290px',
                                    padding: '28px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    color: groupImageUrl ? '#ffffff' : 'inherit'
                                }}
                            >
                                <div>
                                    <span className="group-category-badge">
                                        {group.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.45rem', margin: '12px 0 8px 0', color: groupImageUrl ? '#ffffff' : 'var(--text-primary)' }}>
                                        {group.name}
                                    </h3>
                                    <p style={{ color: groupImageUrl ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
                                        {group.description.substring(0, 95)}...
                                    </p>
                                    <MagneticButton to={`/group/${group._id}`} style={{ width: '100%' }}>
                                        <button className="btn btn-primary" style={{ width: '100%' }}>
                                            View Guild
                                        </button>
                                    </MagneticButton>
                                </div>
                            </SpotlightCard>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Home;
