import { useEffect, useRef, useState } from 'react';

/**
 * Interactive 3D "SkillSphere" Canvas
 * Visual Metaphor: Individual scattered skills, hackers, and ideas fly in 
 * and assemble into an interconnected, glowing, rotating 3D Sphere.
 * Responds to mouse move, hover, and drag with parallax and inertia.
 */
const SkillSphereCanvas = ({ isDark = true, height = '100%', interactive = true }) => {
    const canvasRef = useRef(null);
    const stateRef = useRef({
        nodes: [],
        pulses: [],
        isAssembled: false,
        assemblyProgress: 0,
        rotationX: 0.1,
        rotationY: 0.2,
        targetRotationX: 0.1,
        targetRotationY: 0.2,
        mouseX: 0,
        mouseY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        hoveredNode: null,
        width: 800,
        height: 600
    });

    const SKILL_LABELS = [
        'AI / ML', 'FullStack', 'Web3', 'CyberSec', 'Rust', 'Cloud', 
        'UI/UX', 'Algorithms', 'DevOps', 'Next.js', 'PyTorch', 
        'Solidity', 'Mobile', 'Data', 'Hackathon', 'Bounties', 'OpenSource'
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        const state = stateRef.current;

        // Resize handler with High-DPI support
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            state.width = rect.width;
            state.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        // Generate Nodes using Fibonacci Sphere algorithm
        const NODE_COUNT = 90;
        const sphereRadius = Math.min(state.width, state.height) * 0.32;
        const nodes = [];

        for (let i = 0; i < NODE_COUNT; i++) {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

            // Target sphere coordinates
            const tx = sphereRadius * Math.sin(phi) * Math.cos(theta);
            const ty = sphereRadius * Math.sin(phi) * Math.sin(theta);
            const tz = sphereRadius * Math.cos(phi);

            // Starting dispersed coordinates (scattered in 3D space)
            const spread = 800;
            const sx = tx + (Math.random() - 0.5) * spread;
            const sy = ty + (Math.random() - 0.5) * spread;
            const sz = tz + (Math.random() - 0.5) * spread;

            const isHub = i < SKILL_LABELS.length;
            const label = isHub ? SKILL_LABELS[i] : null;

            nodes.push({
                id: i,
                // current 3D position
                x: sx,
                y: sy,
                z: sz,
                // target 3D position on sphere
                tx,
                ty,
                tz,
                // base 3D position for rotation
                bx: tx,
                by: ty,
                bz: tz,
                radius: isHub ? 4.5 : 2.5 + Math.random() * 1.5,
                label,
                isHub,
                colorType: i % 4 // 0: Emerald, 1: Cyan, 2: Fire Ember, 3: Violet
            });
        }
        state.nodes = nodes;

        // Assembly Animation
        let startTime = performance.now();
        const ASSEMBLY_DURATION = 2000; // ms

        // Data pulses traveling along connections
        const pulses = [];
        const createPulse = () => {
            if (nodes.length < 2) return;
            const fromIdx = Math.floor(Math.random() * nodes.length);
            // pick a nearby node
            const from = nodes[fromIdx];
            let nearest = null;
            let minDist = Infinity;

            for (let j = 0; j < nodes.length; j++) {
                if (j === fromIdx) continue;
                const to = nodes[j];
                const dx = from.bx - to.bx;
                const dy = from.by - to.by;
                const dz = from.bz - to.bz;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < sphereRadius * 0.7 && dist < minDist) {
                    minDist = dist;
                    nearest = j;
                }
            }

            if (nearest !== null) {
                pulses.push({
                    from: fromIdx,
                    to: nearest,
                    progress: 0,
                    speed: 0.015 + Math.random() * 0.02
                });
            }
        };

        const pulseInterval = setInterval(() => {
            if (pulses.length < 15 && state.assemblyProgress > 0.6) {
                createPulse();
            }
        }, 300);

        // Render loop
        let lastTime = performance.now();
        const render = (now) => {
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            // Assembly ease-in-out calculation
            const elapsed = now - startTime;
            if (elapsed < ASSEMBLY_DURATION) {
                // Smooth cubic ease out
                const t = elapsed / ASSEMBLY_DURATION;
                state.assemblyProgress = 1 - Math.pow(1 - t, 3);
            } else {
                state.assemblyProgress = 1;
            }

            // Smooth rotation easing
            if (!state.isDragging) {
                state.targetRotationY += 0.0035; // gentle ambient orbit
            }
            state.rotationX += (state.targetRotationX - state.rotationX) * 0.06;
            state.rotationY += (state.targetRotationY - state.rotationY) * 0.06;

            const cosX = Math.cos(state.rotationX);
            const sinX = Math.sin(state.rotationX);
            const cosY = Math.cos(state.rotationY);
            const sinY = Math.sin(state.rotationY);

            ctx.clearRect(0, 0, state.width, state.height);

            const centerX = state.width / 2;
            const centerY = state.height / 2;
            const fov = 450;

            // Project 3D nodes to 2D
            const projected = state.nodes.map(node => {
                // Interpolate from scattered to sphere position
                const currentBx = node.tx * state.assemblyProgress + (node.x * (1 - state.assemblyProgress));
                const currentBy = node.ty * state.assemblyProgress + (node.y * (1 - state.assemblyProgress));
                const currentBz = node.tz * state.assemblyProgress + (node.z * (1 - state.assemblyProgress));

                // 3D Rotation Y
                const x1 = currentBx * cosY - currentBz * sinY;
                const z1 = currentBz * cosY + currentBx * sinY;

                // 3D Rotation X
                const y2 = currentBy * cosX - z1 * sinX;
                const z2 = z1 * cosX + currentBy * sinX;

                // Perspective projection
                const scale = fov / (fov + z2);
                const x2d = centerX + x1 * scale;
                const y2d = centerY + y2 * scale;

                return {
                    ...node,
                    x2d,
                    y2d,
                    scale,
                    z: z2
                };
            });

            // Sort back-to-front for proper depth occlusion
            projected.sort((a, b) => a.z - b.z);

            // Draw Connections / Arcs
            const maxConnectionDist = sphereRadius * 0.65;
            const connectionAlphaFactor = isDark ? 0.35 : 0.25;

            ctx.lineWidth = 1;
            for (let i = 0; i < projected.length; i++) {
                const a = projected[i];
                // Only connect to a few neighboring nodes to keep lines crisp and light
                for (let j = i + 1; j < projected.length; j++) {
                    const b = projected[j];
                    const dx = a.bx - b.bx;
                    const dy = a.by - b.by;
                    const dz = a.bz - b.bz;
                    const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist3D < maxConnectionDist) {
                        const depthAlpha = Math.max(0.05, ((a.z + b.z) / 2 + sphereRadius) / (sphereRadius * 2));
                        const alpha = (1 - dist3D / maxConnectionDist) * depthAlpha * connectionAlphaFactor * state.assemblyProgress;

                        if (alpha > 0.02) {
                            ctx.beginPath();
                            ctx.moveTo(a.x2d, a.y2d);
                            ctx.lineTo(b.x2d, b.y2d);

                            if (isDark) {
                                ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                            } else {
                                ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 1.2})`;
                            }
                            ctx.stroke();
                        }
                    }
                }
            }

            // Draw Data Pulses traveling on lines
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.progress += p.speed;
                if (p.progress >= 1) {
                    pulses.splice(i, 1);
                    continue;
                }
                const nFrom = projected.find(n => n.id === p.from);
                const nTo = projected.find(n => n.id === p.to);

                if (nFrom && nTo) {
                    const px = nFrom.x2d + (nTo.x2d - nFrom.x2d) * p.progress;
                    const py = nFrom.y2d + (nTo.y2d - nFrom.y2d) * p.progress;
                    const pScale = (nFrom.scale + nTo.scale) / 2;

                    ctx.beginPath();
                    ctx.arc(px, py, 2.5 * pScale, 0, Math.PI * 2);
                    ctx.fillStyle = isDark ? (p.from % 2 === 0 ? '#00f59b' : '#ff9900') : '#059669';
                    ctx.shadowColor = isDark ? (p.from % 2 === 0 ? '#00f59b' : '#ff6600') : '#10b981';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // Draw Nodes and Labels
            for (let i = 0; i < projected.length; i++) {
                const node = projected[i];
                const normalizedDepth = Math.max(0.2, (node.z + sphereRadius) / (sphereRadius * 2)); // 0 to 1
                const radius = node.radius * node.scale;

                // Color mapping
                let coreColor, glowColor;
                if (isDark) {
                    if (node.colorType === 0) {
                        coreColor = '#00f59b'; // Neon Emerald
                        glowColor = 'rgba(0, 245, 155, 0.4)';
                    } else if (node.colorType === 1) {
                        coreColor = '#00e5ff'; // Cyber Cyan
                        glowColor = 'rgba(0, 229, 255, 0.4)';
                    } else if (node.colorType === 2) {
                        coreColor = '#ff8800'; // Molten Plasma Flame / Fire
                        glowColor = 'rgba(255, 136, 0, 0.5)';
                    } else {
                        coreColor = '#c084fc'; // Electric Violet
                        glowColor = 'rgba(192, 132, 252, 0.4)';
                    }
                } else {
                    // Light mode - vibrant, sleek high-contrast
                    if (node.colorType === 0) {
                        coreColor = '#059669'; // Emerald
                        glowColor = 'rgba(5, 150, 105, 0.25)';
                    } else if (node.colorType === 1) {
                        coreColor = '#0284c7'; // Vivid Cyan
                        glowColor = 'rgba(2, 132, 199, 0.25)';
                    } else if (node.colorType === 2) {
                        coreColor = '#d97706'; // Amber Gold
                        glowColor = 'rgba(217, 119, 6, 0.25)';
                    } else {
                        coreColor = '#7c3aed'; // Deep Violet
                        glowColor = 'rgba(124, 58, 237, 0.25)';
                    }
                }

                // Outer Halo Glow
                if (node.isHub || normalizedDepth > 0.6) {
                    ctx.beginPath();
                    ctx.arc(node.x2d, node.y2d, radius * 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = glowColor;
                    ctx.fill();
                }

                // Node Center
                ctx.beginPath();
                ctx.arc(node.x2d, node.y2d, radius, 0, Math.PI * 2);
                ctx.fillStyle = coreColor;
                ctx.globalAlpha = Math.min(1, normalizedDepth * 1.2);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Glowing outline on front nodes
                if (normalizedDepth > 0.5) {
                    ctx.beginPath();
                    ctx.arc(node.x2d, node.y2d, radius + 1, 0, Math.PI * 2);
                    ctx.strokeStyle = isDark ? '#ffffff' : '#0f172a';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }

                // Render Labels for prominent Skill Nodes
                if (node.isHub && node.label && normalizedDepth > 0.55 && state.assemblyProgress > 0.7) {
                    ctx.font = `600 ${Math.max(9, Math.round(11 * node.scale))}px 'Outfit', sans-serif`;
                    const textWidth = ctx.measureText(node.label).width;
                    const padding = 5;
                    const labelX = node.x2d + radius + 8;
                    const labelY = node.y2d + 4;

                    // Frosted pill behind text
                    ctx.fillStyle = isDark ? 'rgba(7, 10, 17, 0.75)' : 'rgba(255, 255, 255, 0.85)';
                    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
                    ctx.lineWidth = 1;
                    
                    const boxX = labelX - padding;
                    const boxY = labelY - 12;
                    const boxW = textWidth + padding * 2;
                    const boxH = 16;
                    const r = 4;

                    ctx.beginPath();
                    ctx.roundRect(boxX, boxY, boxW, boxH, r);
                    ctx.fill();
                    ctx.stroke();

                    // Text
                    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
                    ctx.fillText(node.label, labelX, labelY);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        // Interaction Handlers
        const handleMouseMove = (e) => {
            if (!interactive) return;
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX - rect.left;
            const clientY = e.clientY - rect.top;

            if (state.isDragging) {
                const deltaX = clientX - state.lastMouseX;
                const deltaY = clientY - state.lastMouseY;
                state.targetRotationY += deltaX * 0.006;
                state.targetRotationX -= deltaY * 0.006;
                state.lastMouseX = clientX;
                state.lastMouseY = clientY;
            } else {
                // Parallax tilt based on mouse offset from center
                const offsetX = (clientX - state.width / 2) / (state.width / 2);
                const offsetY = (clientY - state.height / 2) / (state.height / 2);
                state.targetRotationY = state.rotationY + offsetX * 0.005;
                state.targetRotationX = offsetY * 0.3;
            }
        };

        const handleMouseDown = (e) => {
            if (!interactive) return;
            const rect = canvas.getBoundingClientRect();
            state.isDragging = true;
            state.lastMouseX = e.clientX - rect.left;
            state.lastMouseY = e.clientY - rect.top;
        };

        const handleMouseUp = () => {
            state.isDragging = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousedown', handleMouseDown);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(pulseInterval);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousedown', handleMouseDown);
        };
    }, [isDark, interactive]);

    return (
        <div style={{ position: 'relative', width: '100%', height: height, overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    cursor: interactive ? 'grab' : 'default'
                }}
            />
            {/* Ambient Radial Gradient Halo */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    height: '60%',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(0, 245, 155, 0.08) 0%, rgba(0, 229, 255, 0.04) 40%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
        </div>
    );
};

export default SkillSphereCanvas;
