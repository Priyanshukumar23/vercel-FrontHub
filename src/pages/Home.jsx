import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    const [groups, setGroups] = useState([]);

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
            <div className="container">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-section"
                >
                    <h1 className="hero-title">
                        Find Your Tribe.
                    </h1>
                    <p className="hero-subtitle">
                        Connect with people who share your passions. Join local clubs, attend events, and build lasting friendships.
                    </p>
                    <button
                        onClick={() => document.getElementById('groups-section').scrollIntoView({ behavior: 'smooth' })}
                        className="btn btn-primary hero-btn"
                    >
                        Explore Groups
                    </button>
                </motion.div>

                {/* Groups Grid */}
                <h2 id="groups-section" className="section-title">Popular Groups</h2>
                <div className="groups-grid">
                    {groups.map((group, index) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel group-card"
                        >
                            <div className="group-image-container">
                                {group.image ? (
                                    <img
                                        src={group.image.startsWith('http') ? group.image : `${api.defaults.baseURL.replace('/api', '')}${group.image}`}
                                        alt={group.name}
                                        className="group-image"
                                    />
                                ) : (
                                    <div className="group-placeholder">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <h3 className="group-name">{group.name}</h3>
                            <span className="group-category">
                                {group.category}
                            </span>
                            <p className="group-description">
                                {group.description.substring(0, 100)}...
                            </p>
                            <Link to={`/group/${group._id}`} className="btn btn-outline view-group-btn">
                                View Group
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
