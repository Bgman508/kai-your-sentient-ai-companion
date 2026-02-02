import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function KaiVisualizer() {
    const mountRef = useRef(null);
    const [kaiState, setKaiState] = useState('idle'); // idle, listening, thinking, responding
    const sceneRef = useRef(null);
    const coreRef = useRef(null);
    const orbsRef = useRef([]);
    const particlesRef = useRef([]);
    const neuronsRef = useRef([]);
    
    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;
        
        let renderer, camera, scene, animationFrameId;

        try {
            // Scene Setup
            scene = new THREE.Scene();
            sceneRef.current = scene;
            camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            camera.position.z = 12;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            currentMount.appendChild(renderer.domElement);

            // === CENTRAL CONSCIOUSNESS CORE ===
            const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
            const coreMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    glowIntensity: { value: 1.0 },
                    coreColor: { value: new THREE.Color(0x00ffff) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform float glowIntensity;
                    uniform vec3 coreColor;
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    
                    void main() {
                        float intensity = pow(0.4 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                        float pulse = 0.8 + 0.2 * sin(time * 2.0);
                        vec3 glow = coreColor * intensity * glowIntensity * pulse;
                        
                        // Add noise for organic feel
                        float noise = sin(vPosition.x * 10.0 + time) * sin(vPosition.y * 10.0 + time) * 0.1;
                        glow += noise;
                        
                        gl_FragColor = vec4(glow, intensity * 0.8);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            scene.add(core);
            coreRef.current = core;

            // === SATELLITE ORBS ===
            const orbCount = 8;
            const orbs = [];
            const orbMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    orbColor: { value: new THREE.Color(0x4444ff) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 orbColor;
                    varying vec3 vNormal;
                    void main() {
                        float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 1.5);
                        float shimmer = 0.7 + 0.3 * sin(time * 3.0);
                        vec3 glow = orbColor * intensity * shimmer;
                        gl_FragColor = vec4(glow, intensity * 0.6);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            for (let i = 0; i < orbCount; i++) {
                const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const orb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
                
                // Random colors for each orb
                const hue = (i / orbCount) * 0.3 + 0.4; // Blue to purple range
                orb.material.uniforms.orbColor.value.setHSL(hue, 0.8, 0.6);
                
                // Orbital properties
                orb.userData = {
                    radius: 3 + Math.random() * 2,
                    speed: 0.3 + Math.random() * 0.4,
                    offset: (i / orbCount) * Math.PI * 2,
                    verticalOffset: (Math.random() - 0.5) * 2,
                    verticalSpeed: 0.2 + Math.random() * 0.3
                };
                
                scene.add(orb);
                orbs.push(orb);
            }
            orbsRef.current = orbs;

            // === NEURAL CONNECTIONS ===
            const neuronCount = 15;
            const neurons = [];
            
            for (let i = 0; i < neuronCount; i++) {
                const points = [];
                const segmentCount = 20;
                
                for (let j = 0; j <= segmentCount; j++) {
                    points.push(new THREE.Vector3());
                }
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: 0x00ffaa,
                    transparent: true,
                    opacity: 0.3,
                    blending: THREE.AdditiveBlending
                });
                
                const line = new THREE.Line(geometry, material);
                line.userData = { 
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 0.5
                };
                
                scene.add(line);
                neurons.push(line);
            }
            neuronsRef.current = neurons;

            // === PARTICLE SYSTEM ===
            const particleCount = 500;
            const particlePositions = new Float32Array(particleCount * 3);
            const particleColors = new Float32Array(particleCount * 3);
            const particleSizes = new Float32Array(particleCount);
            
            const particles = [];
            
            for (let i = 0; i < particleCount; i++) {
                const particle = {
                    position: new THREE.Vector3(
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ),
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02
                    ),
                    life: Math.random(),
                    maxLife: 0.5 + Math.random() * 0.5
                };
                particles.push(particle);
                
                particlePositions[i * 3] = particle.position.x;
                particlePositions[i * 3 + 1] = particle.position.y;
                particlePositions[i * 3 + 2] = particle.position.z;
                
                // Bioluminescent colors
                const hue = 0.4 + Math.random() * 0.2;
                const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
                particleColors[i * 3] = color.r;
                particleColors[i * 3 + 1] = color.g;
                particleColors[i * 3 + 2] = color.b;
                
                particleSizes[i] = 2 + Math.random() * 3;
            }

            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
            particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

            const particleMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    uniform float time;
                    
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        float pulseFactor = 0.8 + 0.2 * sin(time * 4.0 + position.x * 10.0);
                        gl_PointSize = size * pulseFactor * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    
                    void main() {
                        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                        gl_FragColor = vec4(vColor, alpha * 0.8);
                    }
                `,
                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particleSystem);
            particlesRef.current = particles;

            // === MOUSE INTERACTION ===
            let mouseX = 0, mouseY = 0;
            const handleMouseMove = (event) => {
                const rect = currentMount.getBoundingClientRect();
                mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            };
            currentMount.addEventListener('mousemove', handleMouseMove);

            // === ANIMATION LOOP ===
            const clock = new THREE.Clock();
            
            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                const time = clock.getElapsedTime();

                // Update shader uniforms
                core.material.uniforms.time.value = time;
                orbs.forEach(orb => {
                    orb.material.uniforms.time.value = time;
                });
                particleMaterial.uniforms.time.value = time;

                // Animate core breathing
                const breathScale = 1 + Math.sin(time * 1.2) * 0.05;
                core.scale.setScalar(breathScale);
                core.rotation.y += 0.005;
                core.rotation.x += 0.002;

                // Animate satellite orbs
                orbs.forEach((orb, i) => {
                    const userData = orb.userData;
                    const angle = time * userData.speed + userData.offset;
                    const verticalOffset = Math.sin(time * userData.verticalSpeed + i) * userData.verticalOffset;
                    
                    orb.position.x = Math.cos(angle) * userData.radius;
                    orb.position.z = Math.sin(angle) * userData.radius;
                    orb.position.y = verticalOffset;
                    
                    // Subtle rotation
                    orb.rotation.y += 0.01;
                });

                // Animate neural connections
                neurons.forEach((neuron, i) => {
                    const userData = neuron.userData;
                    const positions = neuron.geometry.attributes.position.array;
                    
                    // Connect random orbs or core
                    const startOrb = orbs[i % orbs.length];
                    const endOrb = i < orbs.length - 1 ? orbs[i + 1] : core;
                    
                    const start = startOrb.position;
                    const end = endOrb.position;
                    
                    for (let j = 0; j < positions.length; j += 3) {
                        const t = (j / 3) / (positions.length / 3 - 1);
                        const curve = Math.sin(t * Math.PI) * 0.5;
                        const noise = Math.sin(time * userData.speed + userData.phase + t * 5) * 0.2;
                        
                        positions[j] = start.x + (end.x - start.x) * t + curve * noise;
                        positions[j + 1] = start.y + (end.y - start.y) * t + curve;
                        positions[j + 2] = start.z + (end.z - start.z) * t + curve * noise;
                    }
                    
                    neuron.geometry.attributes.position.needsUpdate = true;
                    
                    // Pulse opacity
                    neuron.material.opacity = 0.1 + 0.2 * Math.sin(time * 2 + userData.phase);
                });

                // Animate particles
                particles.forEach((particle, i) => {
                    // Move particle
                    particle.position.add(particle.velocity);
                    
                    // Attract to core or nearby orbs
                    const coreDistance = particle.position.distanceTo(core.position);
                    if (coreDistance > 6) {
                        const attraction = core.position.clone().sub(particle.position).normalize().multiplyScalar(0.001);
                        particle.velocity.add(attraction);
                    }
                    
                    // Update life
                    particle.life += 0.01;
                    if (particle.life > particle.maxLife) {
                        particle.life = 0;
                        particle.position.set(
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 10
                        );
                    }
                    
                    // Update positions buffer
                    particlePositions[i * 3] = particle.position.x;
                    particlePositions[i * 3 + 1] = particle.position.y;
                    particlePositions[i * 3 + 2] = particle.position.z;
                });
                
                particleGeometry.attributes.position.needsUpdate = true;

                // Camera follows mouse subtly
                camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
                camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            };

            animate();

            // === RESIZE HANDLER ===
            const handleResize = () => {
                if (!renderer || !camera || !currentMount) return;
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            // === STATE SIMULATION ===
            const stateInterval = setInterval(() => {
                const states = ['idle', 'listening', 'thinking', 'responding'];
                const newState = states[Math.floor(Math.random() * states.length)];
                setKaiState(newState);
            }, 5000);

            return () => {
                cancelAnimationFrame(animationFrameId);
                clearInterval(stateInterval);
                window.removeEventListener('resize', handleResize);
                currentMount.removeEventListener('mousemove', handleMouseMove);
                if (renderer && renderer.domElement && renderer.domElement.parentNode === currentMount) {
                    currentMount.removeChild(renderer.domElement);
                }
            };

        } catch (error) {
            console.error("Failed to initialize Kai's living consciousness:", error);
        }
    }, []);

    // React to state changes
    useEffect(() => {
        if (coreRef.current && orbsRef.current.length > 0) {
            const core = coreRef.current;
            const orbs = orbsRef.current;
            
            switch (kaiState) {
                case 'listening':
                    core.material.uniforms.glowIntensity.value = 1.5;
                    core.material.uniforms.coreColor.value.setHex(0x00ff88);
                    break;
                case 'thinking':
                    core.material.uniforms.glowIntensity.value = 2.0;
                    core.material.uniforms.coreColor.value.setHex(0xffaa00);
                    break;
                case 'responding':
                    core.material.uniforms.glowIntensity.value = 1.8;
                    core.material.uniforms.coreColor.value.setHex(0xff4400);
                    break;
                default:
                    core.material.uniforms.glowIntensity.value = 1.0;
                    core.material.uniforms.coreColor.value.setHex(0x00ffff);
            }
        }
    }, [kaiState]);

    return (
        <div className="relative w-full h-full">
            <div ref={mountRef} className="w-full h-full" />
            <div className="absolute top-4 right-4 text-xs text-cyan-400/70 uppercase tracking-wider">
                State: {kaiState}
            </div>
        </div>
    );
}