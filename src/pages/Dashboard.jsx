import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingTutorial from '../components/OnboardingTutorial';
import SpotlightCard from '../components/SpotlightCard';
import MagneticButton from '../components/MagneticButton';
import { Trophy, Clock, Users, ArrowRight, Plus, Sparkles, Activity, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);
    const [allGroups, setAllGroups] = useState([]);
    const [discoverLoading, setDiscoverLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);

                // Show tutorial only if not seen in this session
                const hasSeenTutorial = sessionStorage.getItem('hasSeenTutorial');
                if (!hasSeenTutorial) {
                    setShowTutorial(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchDiscoverGroups = async () => {
            try {
                const res = await api.get('/groups');
                setAllGroups(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setDiscoverLoading(false);
            }
        };

        fetchUser();
        fetchDiscoverGroups();
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        sessionStorage.setItem('hasSeenTutorial', 'true');
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '50px' }}>
            <AnimatePresence>
                {showTutorial && <OnboardingTutorial onComplete={handleTutorialComplete} />}
            </AnimatePresence>
            <div className="container">
                <SpotlightCard float={true} className="dashboard-welcome-panel" style={{ padding: '36px 40px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <span className="hud-tag">
                                    <span className="hud-pulse-dot" />
                                    <span>Command Center / Online</span>
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {user?.role === 'admin' ? '🛡️ Admin Verified' : '⚡ Active Builder'}
                                </span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                Welcome, <span style={{ background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.username}</span>!
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
                                {user?.role === 'admin'
                                    ? 'Platform Command Center. Oversee communities, review reports, and manage hackathon submissions.'
                                    : 'Your personal talent hub. Track registered hackathons, active guild chats, and project updates.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{
                                padding: '14px 22px',
                                borderRadius: '16px',
                                background: 'var(--glass)',
                                border: '1px solid var(--glass-border)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                                    {user?.joinedGroups?.length || 0}
                                </div>
                                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 600 }}>
                                    Guilds Joined
                                </div>
                            </div>

                            <MagneticButton to="/create-group" strength={0.3}>
                                <button className="btn btn-primary" style={{ padding: '14px 24px', height: '100%' }}>
                                    <Plus size={18} />
                                    <span>New Guild</span>
                                </button>
                            </MagneticButton>
                        </div>
                    </div>
                </SpotlightCard>

                {/* Contest Section */}
                <ContestSection isAdmin={user?.role === 'admin'} />

                {user?.role === 'admin' ? (
                    <>
                        <AdminReportList />
                        <AdminGroupList />
                        <AdminUserList />
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div>
                                <span className="hud-tag" style={{ marginBottom: '8px' }}>Your Network</span>
                                <h2 style={{ fontSize: '2rem' }}>My Guilds & Communities</h2>
                            </div>
                            <MagneticButton to="/create-group">
                                <button className="btn btn-primary">
                                    <Plus size={18} />
                                    <span>Create New Guild</span>
                                </button>
                            </MagneticButton>
                        </div>

                        {user?.joinedGroups?.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                                {user.joinedGroups.map((group, index) => {
                                    const groupImageUrl = group.image
                                        ? (group.image.startsWith('http') ? group.image : `${api.defaults.baseURL.replace('/api', '')}${group.image}`)
                                        : null;

                                    return (
                                        <SpotlightCard
                                            key={group._id}
                                            float={true}
                                            floatDelay={index * 0.15}
                                            style={{
                                                padding: '28px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: '270px',
                                                backgroundImage: groupImageUrl ? `linear-gradient(rgba(7,10,17,0.35), rgba(7,10,17,0.85)), url(${groupImageUrl})` : undefined,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                justifyContent: 'flex-end',
                                                color: groupImageUrl ? '#ffffff' : 'inherit'
                                            }}
                                        >
                                            <div style={{ position: 'relative', zIndex: 2 }}>
                                                <span className="group-category-badge" style={{ marginBottom: '12px' }}>
                                                    {group.category}
                                                </span>
                                                <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', color: groupImageUrl ? '#ffffff' : 'var(--text-primary)' }}>{group.name}</h3>
                                                <p style={{ color: groupImageUrl ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.92rem' }}>
                                                    {group.description.substring(0, 85)}...
                                                </p>
                                                <MagneticButton to={`/group/${group._id}`} style={{ width: '100%' }}>
                                                    <button className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                                        <span>Open Guild</span>
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </MagneticButton>
                                            </div>
                                        </SpotlightCard>
                                    );
                                })}
                            </div>
                        ) : (
                            <SpotlightCard style={{ textAlign: 'center', padding: '60px 30px', borderRadius: '20px' }}>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>You haven't joined any guilds yet.</p>
                                <MagneticButton to="/">
                                    <button className="btn btn-outline">Explore Guilds</button>
                                </MagneticButton>
                            </SpotlightCard>
                        )}
                        {/* Discover Groups Section */}
                        {!discoverLoading && (
                            <DiscoverGroupsSection
                                joinedGroups={user?.joinedGroups || []}
                                allGroups={allGroups}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const DiscoverGroupsSection = ({ joinedGroups, allGroups }) => {
    // Filter out groups the user has already joined
    const joinedIds = new Set(joinedGroups.map(g => g._id));
    const discoverGroups = allGroups.filter(g => !joinedIds.has(g._id)).slice(0, 3); // Show top 3 suggestions

    if (discoverGroups.length === 0) return null;

    return (
        <div style={{ marginTop: '70px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <span className="hud-tag" style={{ marginBottom: '8px' }}>Explore</span>
                    <h2 style={{ fontSize: '2rem' }}>Discover New Communities</h2>
                </div>
                <MagneticButton to="/">
                    <button className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                        <span>Explore All</span>
                        <ArrowRight size={16} />
                    </button>
                </MagneticButton>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {discoverGroups.map((group, index) => {
                    const groupImageUrl = group.image
                        ? (group.image.startsWith('http') ? group.image : `${api.defaults.baseURL.replace('/api', '')}${group.image}`)
                        : null;

                    return (
                        <SpotlightCard
                            key={group._id}
                            float={true}
                            floatDelay={index * 0.2}
                            style={{
                                padding: '28px',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '270px',
                                justifyContent: 'flex-end',
                                background: groupImageUrl ? `linear-gradient(rgba(7,10,17,0.35), rgba(7,10,17,0.85)), url(${groupImageUrl})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: groupImageUrl ? '#ffffff' : 'inherit'
                            }}
                        >
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <span className="group-category-badge" style={{ marginBottom: '12px' }}>
                                    {group.category}
                                </span>
                                <h3 style={{ fontSize: '1.35rem', marginBottom: '6px', color: groupImageUrl ? '#ffffff' : 'var(--text-primary)' }}>{group.name}</h3>
                                <p style={{ color: groupImageUrl ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                    {group.description.substring(0, 85)}...
                                </p>
                                <MagneticButton to={`/group/${group._id}`} style={{ width: '100%' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                        <span>View & Join</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </MagneticButton>
                            </div>
                        </SpotlightCard>
                    );
                })}
            </div>
        </div>
    );
};



const AdminReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/reports').then(res => {
            setReports(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleResolve = async (id) => {
        try {
            await api.put(`/reports/${id}/resolve`);
            setReports(reports.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Content Reports</h2>
            {reports.length === 0 ? <p>No reports found.</p> : (
                <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '10px' }}>Reporter</th>
                                <th style={{ padding: '10px' }}>Reported User</th>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th style={{ padding: '10px' }}>Reason</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <td style={{ padding: '10px' }}>{report.reporter?.username || 'Unknown'}</td>
                                    <td style={{ padding: '10px' }}>{report.reportedUser?.username || 'Unknown'}</td>
                                    <td style={{ padding: '10px' }}>{report.reportedPost ? 'Post' : 'User'}</td>
                                    <td style={{ padding: '10px' }}>{report.reason}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: report.status === 'resolved' ? 'var(--success)' : 'orange',
                                            color: 'white',
                                            fontSize: '0.8rem'
                                        }}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {report.status !== 'resolved' && (
                                            <button
                                                onClick={() => handleResolve(report._id)}
                                                className="btn btn-outline"
                                                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AdminGroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/groups').then(res => {
            setGroups(res.data);
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;
        try {
            await api.delete(`/groups/${id}`);
            setGroups(groups.filter(g => g._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete group');
        }
    };

    const handleRestrict = async (id) => {
        try {
            const res = await api.put(`/groups/${id}/restrict`);
            setGroups(groups.map(g => g._id === id ? res.data : g));
        } catch (err) {
            console.error(err);
            alert('Failed to update group');
        }
    };

    if (loading) return <div>Loading groups...</div>;

    return (
        <div style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem' }}>All Groups</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {groups.map((group) => (
                    <div key={group._id} className="glass-panel" style={{ padding: '20px', position: 'relative', border: group.isRestricted ? '1px solid var(--error)' : '1px solid var(--glass-border)' }}>
                        {group.isRestricted && <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--error)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Restricted</div>}
                        <h3>{group.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>{group.description.substring(0, 80)}...</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button onClick={() => handleDelete(group._id)} style={{ background: 'var(--error)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            <button onClick={() => handleRestrict(group._id)} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                {group.isRestricted ? 'Unrestrict' : 'Restrict'}
                            </button>
                            <Link to={`/group/${group._id}`} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>View</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users').then(res => {
            setUsers(res.data);
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to delete user');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem' }}>All Users</h2>
            </div>
            <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Username</th>
                            <th style={{ padding: '15px' }}>Email</th>
                            <th style={{ padding: '15px' }}>Role</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <td style={{ padding: '15px' }}>{user.username}</td>
                                <td style={{ padding: '15px' }}>{user.email}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: user.role === 'admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                        color: user.role === 'admin' ? 'var(--success)' : 'var(--text-secondary)',
                                        fontSize: '0.85rem'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {user.role !== 'admin' && (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} access for ${user.username}?`)) {
                                                        try {
                                                            const res = await api.put(`/users/${user._id}/access-block`);
                                                            setUsers(users.map(u => u._id === user._id ? { ...u, isBlocked: res.data.isBlocked } : u));
                                                        } catch (e) { alert('Failed'); }
                                                    }
                                                }}
                                                style={{ color: user.isBlocked ? 'var(--success)' : 'orange', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                {user.isBlocked ? 'Unblock Access' : 'Block Access'}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm(`Are you sure you want to ${user.isChatBlocked ? 'unblock' : 'block'} chat for ${user.username}?`)) {
                                                        try {
                                                            const res = await api.put(`/users/${user._id}/block`);
                                                            setUsers(users.map(u => u._id === user._id ? { ...u, isChatBlocked: res.data.isChatBlocked } : u));
                                                        } catch (e) { alert('Failed'); }
                                                    }
                                                }}
                                                style={{ color: user.isChatBlocked ? 'var(--success)' : 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                {user.isChatBlocked ? 'Unblock Chat' : 'Block Chat'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ContestSection = ({ isAdmin }) => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sliderIndex, setSliderIndex] = useState(0);

    const fetchContests = async () => {
        try {
            const res = await api.get('/contests');
            setContests(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    useEffect(() => {
        if (contests.length === 0) return;
        const interval = setInterval(() => {
            if (!showDetailsModal && !showCreateModal) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % contests.length);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [showDetailsModal, showCreateModal, contests.length]);

    // Placeholder images for the slider
    const sliderImages = [
        {
            id: 1,
            url: '/img/ev1.jpg',
            title: 'Tech Hackathon 2025',
            description: 'Join the biggest coding event of the year.'
        },
        {
            id: 2,
            url: '/img/ev2.jpg',
            title: 'Digital Art Showcase',
            description: 'Unleash your creativity and win prizes.'
        },
        {
            id: 3,
            url: '/img/ev3.jpg',
            title: 'Gaming Championship',
            description: 'Battle for glory in our e-sports tournament.'
        }
    ];

    useEffect(() => {
        if (contests.length === 0) {
            const timer = setInterval(() => {
                setSliderIndex((prev) => (prev + 1) % sliderImages.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [contests.length]);

    const contest = contests[currentIndex];

    if (loading) return <div>Loading contests...</div>;


    if (contests.length === 0) return (
        <SpotlightCard float={true} className="hackathon-spotlight-card" style={{ padding: '0', marginBottom: '40px', overflow: 'hidden', position: 'relative', minHeight: '340px' }}>
            <div style={{
                position: 'absolute',
                top: '24px',
                left: '28px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <span className="hud-tag">
                    <span className="hud-pulse-dot" />
                    <span>Featured Hackathon Arena</span>
                </span>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={sliderIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        width: '100%',
                        height: '360px',
                        backgroundImage: `linear-gradient(to top, rgba(7, 10, 17, 0.95) 15%, rgba(7, 10, 17, 0.4) 60%, rgba(7, 10, 17, 0.2)), url(${sliderImages[sliderIndex].url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '40px 32px'
                    }}
                >
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, marginBottom: '8px', color: '#ffffff' }}
                    >
                        {sliderImages[sliderIndex].title}
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', maxWidth: '600px' }}
                    >
                        {sliderImages[sliderIndex].description}
                    </motion.p>
                </motion.div>
            </AnimatePresence>

            {/* Glowing Slider Indicator Bars */}
            <div style={{ position: 'absolute', bottom: '24px', right: '32px', display: 'flex', gap: '8px', zIndex: 10 }}>
                {sliderImages.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSliderIndex(idx)}
                        style={{
                            width: idx === sliderIndex ? '28px' : '8px',
                            height: '6px',
                            borderRadius: '4px',
                            background: idx === sliderIndex ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: idx === sliderIndex ? '0 0 10px var(--accent)' : 'none'
                        }}
                    />
                ))}
            </div>

            {isAdmin && (
                <MagneticButton onClick={() => setShowCreateModal(true)} strength={0.3} style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 20 }}>
                    <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                        <Plus size={16} />
                        <span>Create Contest</span>
                    </button>
                </MagneticButton>
            )}

            {/* Render Create Modal if needed */}
            {showCreateModal && <CreateContestModal onClose={() => setShowCreateModal(false)} onCreated={fetchContests} />}
        </SpotlightCard>
    );

    return (
        <>
            <SpotlightCard
                float={true}
                className="hackathon-spotlight-card"
                style={{
                    padding: '36px',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '320px'
                }}
            >
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={contest._id}
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ width: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                            <div style={{ flex: 1, minWidth: '280px' }}>
                                {/* Telemetry Badge Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                    <span className="hud-tag">
                                        <span className="hud-pulse-dot" />
                                        <span>LIVE HACKATHON</span>
                                    </span>
                                    <span className="hud-clock font-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={14} style={{ color: 'var(--accent)' }} />
                                        <span>{contest.deadline}</span>
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                        <Users size={15} />
                                        <span>{contest.participants} Builders</span>
                                    </span>
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                                    fontWeight: 800,
                                    marginBottom: '12px',
                                    color: 'var(--text-primary)',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {contest.title}
                                </h2>

                                <p style={{
                                    color: 'var(--text-secondary)',
                                    marginBottom: '24px',
                                    fontSize: '1.05rem',
                                    lineHeight: '1.6',
                                    maxWidth: '680px'
                                }}>
                                    {contest.description}
                                </p>

                                {/* Shimmering Metallic Gold Prize Card */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '12px 20px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    boxShadow: '0 8px 25px -6px rgba(245, 158, 11, 0.25)',
                                    marginBottom: '10px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                                    }}>
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#f59e0b', display: 'block' }}>
                                            Cash Bounty Pool
                                        </span>
                                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                            {contest.prize}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Column with Magnetic Physics */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
                                {isAdmin ? (
                                    <MagneticButton onClick={() => setShowCreateModal(true)} strength={0.3}>
                                        <button className="btn btn-primary" style={{ width: '100%', padding: '14px 24px' }}>
                                            <Plus size={18} />
                                            <span>Create Contest</span>
                                        </button>
                                    </MagneticButton>
                                ) : (
                                    <MagneticButton to={`/contest-registration/${contest._id}`} strength={0.35}>
                                        <button className="btn btn-primary" style={{ width: '100%', padding: '14px 28px', fontSize: '1rem' }}>
                                            <span>Register Now</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </MagneticButton>
                                )}

                                <MagneticButton onClick={() => setShowDetailsModal(true)} strength={0.25}>
                                    <button className="btn btn-outline" style={{ width: '100%', padding: '14px 24px', fontSize: '1rem' }}>
                                        <span>View Details</span>
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Elongated Glowing Slider Indicator Pills */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
                    {contests.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: idx === currentIndex ? '32px' : '10px',
                                height: '6px',
                                borderRadius: '4px',
                                background: idx === currentIndex ? 'var(--accent)' : 'var(--text-muted)',
                                opacity: idx === currentIndex ? 1 : 0.35,
                                cursor: 'pointer',
                                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: idx === currentIndex ? '0 0 10px var(--accent)' : 'none'
                            }}
                        />
                    ))}
                </div>

                {isAdmin && (
                    <button
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this contest?')) {
                                try {
                                    await api.delete(`/contests/${contest._id}`);
                                    fetchContests(); // Refresh
                                } catch (err) {
                                    alert('Failed to delete contest');
                                }
                            }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            background: 'var(--error)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            zIndex: 20
                        }}
                    >
                        Delete Contest
                    </button>
                )}
            </SpotlightCard>

            {/* Details Modal Portal */}
            {createPortal(
                <AnimatePresence>
                    {showDetailsModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.6)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(5px)',
                            padding: '20px'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-panel"
                                style={{
                                    maxWidth: '600px',
                                    width: '100%',
                                    background: 'var(--bg-primary)',
                                    maxHeight: '90vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '0',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ padding: '20px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ color: 'var(--accent)', margin: 0, fontSize: '1.5rem' }}>{contest.title}</h2>
                                    <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-secondary)', lineHeight: 0.5 }}>&times;</button>
                                </div>

                                <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
                                    <div style={{ marginBottom: '25px' }}>
                                        <h3 style={{ marginBottom: '10px' }}>About the Challenge</h3>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{contest.details || contest.description}</p>
                                    </div>

                                    {contest.rules && contest.rules.length > 0 && (
                                        <div style={{ marginBottom: '25px' }}>
                                            <h3 style={{ marginBottom: '10px' }}>Rules & Guidelines</h3>
                                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                                                {contest.rules.map((rule, i) => (
                                                    <li key={i} style={{ marginBottom: '8px' }}>{rule}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '10px' }}>
                                        <h3 style={{ marginBottom: '10px' }}>Prize</h3>
                                        <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{contest.prize}</p>
                                    </div>
                                </div>

                                <div style={{ padding: '20px 30px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                                    <Link
                                        to={`/contest-registration/${contest._id}`}
                                        className="btn btn-primary"
                                        style={{ display: 'block', textAlign: 'center', width: '100%' }}
                                    >
                                        Proceed to Registration
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Create Contest Modal */}
            {showCreateModal && <CreateContestModal onClose={() => setShowCreateModal(false)} onCreated={fetchContests} />}
        </>
    );
};

const CreateContestModal = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        details: '',
        rules: '', // multiline string, will split by newlines
        prize: '',
        deadline: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const rulesArray = formData.rules.split('\n').filter(r => r.trim() !== '');
            await api.post('/contests', { ...formData, rules: rulesArray });
            onCreated();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to create contest');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            padding: '20px'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)', padding: '30px' }}>
                <h2 style={{ marginBottom: '20px' }}>Create New Contest</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Contest Title"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    < textarea
                        placeholder="Short Description"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                    />
                    <textarea
                        placeholder="Detailed Description (About the Challenge)"
                        value={formData.details}
                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                        rows={5}
                    />
                    <textarea
                        placeholder="Rules (One per line)"
                        value={formData.rules}
                        onChange={e => setFormData({ ...formData, rules: e.target.value })}
                        rows={5}
                    />
                    <input
                        type="text"
                        placeholder="Prize"
                        value={formData.prize}
                        onChange={e => setFormData({ ...formData, prize: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Deadline (e.g., Ends in 2 days)"
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        required
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Creating...' : 'Create Contest'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default Dashboard;
