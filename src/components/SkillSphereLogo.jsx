import React from 'react';

/**
 * Animated SVG Logo: Stylized 3D Sphere with continuous orbital spin and core pulse
 */
const SkillSphereLogo = ({ size = 38, showText = true, className = '' }) => {
    return (
        <div className={`skillsphere-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible', flexShrink: 0 }}
            >
                <defs>
                    <linearGradient id="sphereGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f59b" />
                        <stop offset="50%" stopColor="#00e5ff" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="sphereGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00f59b" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#00e5ff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Outer Ambient Glow */}
                <circle cx="50" cy="50" r="38" fill="url(#coreGlow)" opacity="0.5">
                    <animate attributeName="r" values="36;42;36" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Orbit Ring 1 - Vertical Ellipse */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="38"
                    ry="18"
                    stroke="url(#sphereGrad1)"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    transform="rotate(-25 50 50)"
                    opacity="0.85"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="14s"
                        repeatCount="indefinite"
                    />
                </ellipse>

                {/* Orbit Ring 2 - Counter Orbit */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="38"
                    ry="20"
                    stroke="url(#sphereGrad2)"
                    strokeWidth="2"
                    transform="rotate(45 50 50)"
                    opacity="0.75"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360 50 50"
                        to="0 50 50"
                        dur="18s"
                        repeatCount="indefinite"
                    />
                </ellipse>

                {/* Latitude Wireframe Lines */}
                <ellipse cx="50" cy="50" rx="30" ry="12" stroke="url(#sphereGrad1)" strokeWidth="1.2" opacity="0.6" />
                <ellipse cx="50" cy="50" rx="30" ry="24" stroke="url(#sphereGrad1)" strokeWidth="1.2" opacity="0.4" />
                <circle cx="50" cy="50" r="30" stroke="url(#sphereGrad1)" strokeWidth="1.8" opacity="0.8" />

                {/* Orbiting Satellite Nodes */}
                <circle cx="88" cy="50" r="3.5" fill="#00f59b" filter="url(#glowEffect)">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="7s"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="15" cy="50" r="3" fill="#00e5ff" filter="url(#glowEffect)">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360 50 50"
                        to="0 50 50"
                        dur="9s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Center Core Node */}
                <circle cx="50" cy="50" r="7" fill="url(#sphereGrad1)" filter="url(#glowEffect)">
                    <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
            </svg>

            {showText && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                    <span style={{
                        fontWeight: 800,
                        fontSize: '1.35rem',
                        letterSpacing: '-0.5px',
                        background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: "'Outfit', 'Inter', sans-serif"
                    }}>
                        SkillSphere
                    </span>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '1.8px',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        opacity: 0.9
                    }}>
                        Builder Network
                    </span>
                </div>
            )}
        </div>
    );
};

export default SkillSphereLogo;
