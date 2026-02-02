import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
    const mountRef = useRef(null);

    const velocities = useMemo(() => Array.from({ length: 7000 }, () => new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1)), []);

    useEffect(() => {
        let renderer;
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // FIX: Wrap the entire effect in a try/catch to prevent a crash from blocking the entire UI
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            camera.position.z = 300;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            currentMount.appendChild(renderer.domElement);
            
            const particleCount = 7000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() * 2 - 1) * 400;
                positions[i * 3 + 1] = (Math.random() * 2 - 1) * 400;
                positions[i * 3 + 2] = (Math.random() * 2 - 1) * 400;

                const color = new THREE.Color();
                color.setHSL(0.5 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.1);
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 1.5,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.8,
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);

            let mouseX = 0, mouseY = 0;
            const handleMouseMove = (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            };
            document.addEventListener('mousemove', handleMouseMove);

            let animationFrameId;
            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);

                const time = Date.now() * 0.00005;
                camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 50 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                
                particles.rotation.y = time * 0.5;

                renderer.render(scene, camera);
            };
            animate();
            
            const handleResize = () => {
                if (!renderer || !camera) return;
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('mousemove', handleMouseMove);
                if (renderer && renderer.domElement.parentNode === currentMount) {
                    currentMount.removeChild(renderer.domElement);
                }
            };
        } catch (error) {
            console.error("Failed to initialize particle background:", error);
        }
    }, [velocities]);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}