import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    AlertTriangle, 
    ShieldAlert, 
    Terminal, 
    Zap, 
    Code2, 
    Cpu, 
    Orbit, 
    Sparkles, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Flame, 
    Globe, 
    Users,
    Activity,
    Layers
} from 'lucide-react';
import SkillSphereCanvas from '../components/SkillSphereCanvas';
import SpotlightCard from '../components/SpotlightCard';
import MagneticButton from '../components/MagneticButton';
import SkillSphereLogo from '../components/SkillSphereLogo';
import './About.css';

const About = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const updateTheme = () => {
            setIsDarkMode(document.body.classList.contains('dark-theme'));
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            <div className="container">
                {/* 1. HERO SECTION WITH 3D CANVAS */}
                <section className="about-hero-section">
                    <div className="about-canvas-backdrop">
                        <SkillSphereCanvas isDark={isDarkMode} height="100%" interactive={true} />
                    </div>

                    <div className="about-hero-content">
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hud-tag"
                            style={{ marginBottom: '16px' }}
                        >
                            <span className="hud-pulse-dot" />
                            <span>PLATFORM MANIFESTO // V2.6</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="about-hero-title"
                        >
                            Built For The Ones Who <span className="highlight-text">Ship</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="about-hero-subtitle"
                        >
                            SkillSphere was founded on a simple conviction: <strong>talk is cheap. Prototypes change the world.</strong> We built an interconnected global arena where software engineers, designers, and AI creators unite to build high-velocity solutions under real stakes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.45 }}
                            style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
                        >
                            <MagneticButton to="/register" strength={0.3}>
                                <button className="btn btn-primary" style={{ padding: '14px 32px' }}>
                                    <Zap size={18} />
                                    <span>Enter the Arena</span>
                                    <ArrowRight size={18} />
                                </button>
                            </MagneticButton>

                            <MagneticButton to="/dashboard" strength={0.25}>
                                <button className="btn btn-outline" style={{ padding: '14px 28px' }}>
                                    <span>Browse Hackathons</span>
                                </button>
                            </MagneticButton>
                        </motion.div>
                    </div>
                </section>

                {/* 2. THE VISUAL METAPHOR: WHY "SKILLSPHERE"? */}
                <section style={{ margin: '80px 0' }}>
                    <SpotlightCard float={true} style={{ padding: '48px 40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
                            <div>
                                <span className="hud-tag" style={{ marginBottom: '12px' }}>Visual Metaphor</span>
                                <h2 style={{ fontSize: '2.2rem', marginBottom: '16px' }}>The Philosophy Behind the Name</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '16px' }}>
                                    In the modern tech ecosystem, brilliance is hyper-fragmented. An extraordinary ML researcher in Mumbai, a Rust systems architect in Berlin, and a 3D WebGL motion designer in Tokyo are isolated nodes in 3D coordinate space.
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                    <strong>SkillSphere</strong> is the gravitational field that pulls these scattered nodes together into an interconnected, rotating sphere of innovation. One platform to discover complementary talent, spin up squads, and build venture-ready prototypes in 48 hours.
                                </p>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                background: 'var(--glass)',
                                padding: '30px',
                                borderRadius: '20px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Orbit size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Gravitational Talent Clustering</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automated squad formulation based on complementary skills</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.12)', color: '#00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Live Telemetry & Sync</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Zero-latency collaboration, voice channels, and shared boards</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Verifiable Proof of Work</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reputation grounded exclusively in deployed products and code</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </section>

                {/* 3. CAUTION SECTION: RULES OF THE ARENA */}
                <section className="caution-section">
                    <div className="caution-header">
                        <div className="caution-badge">
                            <ShieldAlert size={16} />
                            <span>PROTOCOL ADVISORY // ZERO COMPROMISE</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-primary)' }}>
                            Rules of the Arena
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
                            SkillSphere is engineered for elite builders. Operating on our network requires adherence to our core non-negotiable protocols.
                        </p>
                    </div>

                    <div className="caution-grid">
                        <SpotlightCard float={true} floatDelay={0} className="caution-card" borderColor="rgba(244, 63, 94, 0.5)" spotlightColor="rgba(244, 63, 94, 0.12)">
                            <div className="caution-card-header">
                                <div className="caution-icon-box">
                                    <AlertTriangle size={22} />
                                </div>
                                <div>
                                    <span className="caution-index">CAUTION [01]</span>
                                    <h3>Zero AI Hallucination Slop</h3>
                                </div>
                            </div>
                            <p>
                                Using AI accelerators is encouraged; dumping unverified ChatGPT hallucinations is grounds for immediate review. Every builder must be able to defend, debug, and explain every line submitted in competition.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.2} className="caution-card" borderColor="rgba(244, 63, 94, 0.5)" spotlightColor="rgba(244, 63, 94, 0.12)">
                            <div className="caution-card-header">
                                <div className="caution-icon-box">
                                    <Flame size={22} />
                                </div>
                                <div>
                                    <span className="caution-index">CAUTION [02]</span>
                                    <h3>Ship Or Perish</h3>
                                </div>
                            </div>
                            <p>
                                In 24h & 48h hackathons, slides and Figma prototypes without executable software are strictly disqualified from cash bounties. A buggy live build beats a flawless PowerPoint every single time.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.4} className="caution-card" borderColor="rgba(244, 63, 94, 0.5)" spotlightColor="rgba(244, 63, 94, 0.12)">
                            <div className="caution-card-header">
                                <div className="caution-icon-box">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <span className="caution-index">CAUTION [03]</span>
                                    <h3>Zero Toxic Tolerance</h3>
                                </div>
                            </div>
                            <p>
                                Discrimination, toxic elitism, or code theft results in permanent cryptographic hardware-level blacklisting from all guild channels, contest rooms, and platform payouts.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.6} className="caution-card" borderColor="rgba(244, 63, 94, 0.5)" spotlightColor="rgba(244, 63, 94, 0.12)">
                            <div className="caution-card-header">
                                <div className="caution-icon-box">
                                    <Terminal size={22} />
                                </div>
                                <div>
                                    <span className="caution-index">CAUTION [04]</span>
                                    <h3>Authentic Originality</h3>
                                </div>
                            </div>
                            <p>
                                Re-submitting pre-existing repositories without explicit disclosure will blacklist your profile across all partnered venture accelerators and hiring syndicates permanently.
                            </p>
                        </SpotlightCard>
                    </div>
                </section>

                {/* 4. ARCHITECTURAL PILLARS */}
                <section className="pillars-section">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <span className="hud-tag">System Specs</span>
                        <h2 style={{ fontSize: '2.4rem', margin: '12px 0' }}>The 4 Engineering Pillars</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            How the platform delivers high-output performance for creators worldwide.
                        </p>
                    </div>

                    <div className="pillars-grid">
                        <SpotlightCard float={true} floatDelay={0} className="pillar-card">
                            <div className="pillar-icon-box"><Code2 size={26} /></div>
                            <h3>High-Stakes Buildathons</h3>
                            <p>
                                Recurring 24-48 hour hackathons with verified industry bounties, automated judging telemetry, and direct venture capitalist demo days.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.2} className="pillar-card">
                            <div className="pillar-icon-box"><Users size={26} /></div>
                            <h3>Autonomous Guilds</h3>
                            <p>
                                Domain-focused developer organizations spanning AI/ML, Web3, Distributed Systems, and Creative Technologists with self-governed chats.
                            </p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.4} className="pillar-card">
                            <div className="pillar-icon-box"><Cpu size={26} /></div>
                            <h3>Live Audio & Spatial Chat</h3>
                            <p>
                                Low-latency team communication with ambient synthesizer soundscapes, live code embeds, and real-time polling engines.
                            </p>
                        </SpotlightCard>
                    </div>
                </section>

                {/* 5. ROADMAP TIMELINE */}
                <section className="roadmap-section">
                    <div style={{ textAlign: 'center' }}>
                        <span className="hud-tag">Trajectory</span>
                        <h2 style={{ fontSize: '2.4rem', margin: '12px 0' }}>The Evolution Roadmap</h2>
                    </div>

                    <div className="roadmap-timeline">
                        <SpotlightCard float={true} floatDelay={0} className="roadmap-card">
                            <span className="roadmap-phase-tag">Phase 01 // Completed</span>
                            <h4>Genesis Node</h4>
                            <p>Community platform launch, global anonymous chat, feed creation, and group formation.</p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.2} className="roadmap-card">
                            <span className="roadmap-phase-tag" style={{ color: 'var(--accent)' }}>Phase 02 // Live</span>
                            <h4>3D Talent Sphere</h4>
                            <p>Interactive WebGL 3D constellation engine, spotlight cursor shaders, and Razorpay-grade design.</p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.4} className="roadmap-card">
                            <span className="roadmap-phase-tag" style={{ color: '#00e5ff' }}>Phase 03 // In Development</span>
                            <h4>Autonomous Bounties</h4>
                            <p>Smart contract escrow payouts, automated GitHub PR evaluation, and live AI judge panels.</p>
                        </SpotlightCard>

                        <SpotlightCard float={true} floatDelay={0.6} className="roadmap-card">
                            <span className="roadmap-phase-tag" style={{ color: '#c084fc' }}>Phase 04 // Future Horizon</span>
                            <h4>Decentralized Credential</h4>
                            <p>Cryptographic soulbound proof-of-competence tokens accepted by top tier global tech companies.</p>
                        </SpotlightCard>
                    </div>
                </section>

                {/* 6. CALL TO ACTION */}
                <SpotlightCard float={true} className="about-cta-section">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <SkillSphereLogo size={52} showText={false} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: '16px' }}>
                        Ready to Prove Yourself?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 30px auto', fontSize: '1.1rem' }}>
                        Join 5,200+ creators building software that matters. Register for the upcoming hackathon sprint today.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <MagneticButton to="/register" strength={0.35}>
                            <button className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                                <Zap size={18} />
                                <span>Create Builder Identity</span>
                                <ArrowRight size={18} />
                            </button>
                        </MagneticButton>

                        <MagneticButton to="/dashboard" strength={0.25}>
                            <button className="btn btn-outline" style={{ padding: '16px 30px', fontSize: '1.05rem' }}>
                                <span>Enter Dashboard</span>
                            </button>
                        </MagneticButton>
                    </div>
                </SpotlightCard>
            </div>
        </div>
    );
};

export default About;
