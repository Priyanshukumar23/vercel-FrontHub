import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Magnetic Button with spring physics hover and specular sheen
 */
const MagneticButton = ({
    children,
    to,
    onClick,
    className = '',
    style = {},
    strength = 0.35,
    glow = true,
    variant = 'primary', // 'primary', 'outline', 'glow'
    ...props
}) => {
    const btnRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseClass = `magnetic-btn ${className}`;

    const content = (
        <motion.div
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
            whileTap={{ scale: 0.95 }}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                willChange: 'transform',
                ...style
            }}
            className={baseClass}
        >
            {children}
        </motion.div>
    );

    if (to) {
        return (
            <Link to={to} onClick={onClick} style={{ textDecoration: 'none', display: 'inline-block' }} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-block' }} {...props}>
            {content}
        </button>
    );
};

export default MagneticButton;
