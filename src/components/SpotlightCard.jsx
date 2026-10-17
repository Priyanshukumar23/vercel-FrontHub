import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Modern Spotlight Glassmorphism Card
 * Features:
 * - Glowing radial gradient border that follows the cursor
 * - Ambient spotlight reflection on the glass surface
 * - Subtle continuous floating animation (y-axis translation)
 */
const SpotlightCard = ({
    children,
    className = '',
    style = {},
    float = false,
    floatDelay = 0,
    spotlightColor = 'rgba(0, 245, 155, 0.18)',
    borderColor = 'rgba(0, 245, 155, 0.45)',
    ...props
}) => {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
    };

    const floatAnimation = float ? {
        animate: {
            y: [0, -7, 0]
        },
        transition: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: floatDelay
        }
    } : {};

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...floatAnimation}
            className={`spotlight-card ${className}`}
            style={{
                position: 'relative',
                borderRadius: '24px',
                background: 'var(--card-bg, var(--glass))',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                overflow: 'hidden',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
                boxShadow: isHovered
                    ? '0 24px 60px -15px var(--card-glow-shadow, rgba(0, 245, 155, 0.15)), 0 0 1px 1px rgba(255, 255, 255, 0.1)'
                    : 'var(--shadow-card)',
                border: '1px solid var(--glass-border)',
                ...style
            }}
            {...props}
        >
            {/* Dynamic Cursor Spotlight Effect */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                    background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 65%)`,
                    zIndex: 1
                }}
            />

            {/* Glowing Cursor Border Ring */}
            <div
                style={{
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    borderRadius: '25px',
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${borderColor}, transparent 70%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1.5px',
                    zIndex: 2
                }}
            />

            {/* Card Content */}
            <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%' }}>
                {children}
            </div>
        </motion.div>
    );
};

export default SpotlightCard;
