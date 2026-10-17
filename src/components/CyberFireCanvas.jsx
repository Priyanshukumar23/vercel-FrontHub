import { useEffect, useRef, useState } from 'react';

/**
 * CyberFireCanvas: High-Performance 3D Ambient Fire & Ember Engine
 * 
 * Generates interactive volumetric embers, buoyant thermal draft,
 * and an ambient heat hearth that glows behind frosted glass panels.
 * Adapts intelligently across both Dark Mode (incandescent cyber fire) 
 * and Light Mode (vibrant solar ember flames).
 * Reacts dynamically to mouse wind turbulence with 60fps physics.
 */
const CyberFireCanvas = () => {
    const canvasRef = useRef(null);
    const [isDark, setIsDark] = useState(true);

    // Sync with theme state
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.body.classList.contains('dark-theme'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Mouse interaction for aerodynamic wind turbulence
        let mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 };
        const handleMouseMove = (e) => {
            mouse.vx = (e.clientX - mouse.lastX) * 0.15;
            mouse.vy = (e.clientY - mouse.lastY) * 0.15;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.lastX = e.clientX;
            mouse.lastY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Particle configuration: tuned for 60fps silky smooth physics
        const PARTICLE_COUNT = 75;
        const particles = [];

        // Dual-palette configuration:
        // Dark Mode: White-hot & neon incandescent
        const darkColors = [
            { r: 255, g: 240, b: 180 }, // White-hot core
            { r: 255, g: 170, b: 50 },  // Vivid flame gold
            { r: 255, g: 100, b: 20 },  // Molten orange
            { r: 235, g: 45, b: 65 },   // Crimson flame
            { r: 0, g: 245, b: 155 }    // Cyber emerald spark
        ];

        // Light Mode: High-contrast rich solar embers & molten amber
        const lightColors = [
            { r: 217, g: 119, b: 6 },   // Molten amber gold (#d97706)
            { r: 234, g: 88, b: 12 },   // Vibrant flame orange (#ea580c)
            { r: 225, g: 29, b: 72 },   // Radiant ruby fire (#e11d48)
            { r: 5, g: 150, b: 105 },   // Emerald flare spark (#059669)
            { r: 180, g: 83, b: 9 }     // Deep solar bronze
        ];

        class EmberParticle {
            constructor(initRandom = true) {
                this.reset(initRandom);
            }

            reset(initRandom = false) {
                this.x = Math.random() * width;
                // Start along bottom hearth or scatter vertically on initial mount
                this.y = initRandom ? Math.random() * height : height + 10 + Math.random() * 40;
                this.z = 0.25 + Math.random() * 0.75; // 3D depth layer

                this.baseVx = (Math.random() - 0.5) * 0.8 * this.z;
                this.vx = this.baseVx;
                // Buoyant thermal upward velocity
                this.vy = -(1.2 + Math.random() * 2.2) * this.z;

                this.size = (1.5 + Math.random() * 3.5) * this.z;
                this.baseSize = this.size;

                const palette = isDark ? darkColors : lightColors;
                this.color = palette[Math.floor(Math.random() * palette.length)];
                this.maxLife = 180 + Math.random() * 240;
                this.life = initRandom ? Math.random() * this.maxLife : 0;
                this.flickerSpeed = 0.05 + Math.random() * 0.08;
                this.wobbleSpeed = 0.02 + Math.random() * 0.03;
                this.wobbleDist = 1.5 + Math.random() * 3;
            }

            update(time) {
                this.life++;
                if (this.life >= this.maxLife || this.y < -30) {
                    this.reset(false);
                    return;
                }

                // Sinusoidal thermal wobble
                const wobble = Math.sin(this.life * this.wobbleSpeed) * this.wobbleDist;

                // Mouse wind aerodynamics
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const force = (1 - dist / 180) * 2;
                    this.vx += (dx / dist) * force + mouse.vx * 0.1;
                    this.vy += (dy / dist) * force + mouse.vy * 0.1;
                }

                // Air resistance damping
                this.vx += (this.baseVx - this.vx) * 0.05;

                this.x += this.vx + wobble * 0.15;
                this.y += this.vy;

                // Scale gently down as ember cools and burns out
                this.progress = this.life / this.maxLife;
                this.currentSize = this.baseSize * (1 - this.progress * 0.55);
            }

            draw(ctx, time) {
                // Life curve alpha
                let alpha = Math.sin(this.progress * Math.PI) * (isDark ? 0.75 : 0.85);
                // Subtle flicker
                alpha *= 0.85 + Math.sin(time * this.flickerSpeed + this.x) * 0.15;

                if (alpha <= 0.01) return;

                const { r, g, b } = this.color;

                // Outer Soft Halo
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize * (isDark ? 3.5 : 2.8), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * (isDark ? 0.25 : 0.22)})`;
                ctx.fill();

                // Core Hot Spark
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * (isDark ? 0.9 : 0.95)})`;
                ctx.fill();
            }
        }

        // Initialize particle array
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new EmberParticle(true));
        }

        // Render Loop
        let time = 0;
        const render = () => {
            time += 0.05;
            ctx.clearRect(0, 0, width, height);

            // Blending modes: Additive 'lighter' in dark mode for incandescent fire;
            // 'source-over' with rich saturation in light mode for crisp visibility
            ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';

            // 1. Bottom Ambient Heat Hearth Wave
            const gradient = ctx.createRadialGradient(
                width / 2, height + 80, 50,
                width / 2, height + 80, Math.max(width * 0.65, 500)
            );
            const hearthPulse = 0.06 + Math.sin(time * 0.5) * 0.015;

            if (isDark) {
                gradient.addColorStop(0, `rgba(255, 90, 20, ${hearthPulse * 1.5})`);
                gradient.addColorStop(0.35, `rgba(235, 45, 65, ${hearthPulse})`);
                gradient.addColorStop(0.65, `rgba(0, 245, 155, ${hearthPulse * 0.6})`);
                gradient.addColorStop(1, 'transparent');
            } else {
                // Light mode: Sunrise solar dawn warmth
                gradient.addColorStop(0, `rgba(249, 115, 22, ${hearthPulse * 1.2})`);
                gradient.addColorStop(0.4, `rgba(244, 63, 94, ${hearthPulse * 0.8})`);
                gradient.addColorStop(0.7, `rgba(16, 185, 129, ${hearthPulse * 0.5})`);
                gradient.addColorStop(1, 'transparent');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, height - 350, width, 350);

            // 2. Animate and draw embers
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time);
                particles[i].draw(ctx, time);
            }

            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: isDark ? 0.95 : 0.85
            }}
        />
    );
};

export default CyberFireCanvas;
