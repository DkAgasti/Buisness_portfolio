'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene3() {
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Galaxy Spiral ---
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Spiral arms
    const armCount = 4;
    const pointsPerArm = 400;
    const totalPoints = armCount * pointsPerArm;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);
    const sizes = new Float32Array(totalPoints);

    const colorInner = new THREE.Color(0x8b5cf6);
    const colorOuter = new THREE.Color(0x3b82f6);

    for (let arm = 0; arm < armCount; arm++) {
      const armAngle = (arm / armCount) * Math.PI * 2;
      for (let i = 0; i < pointsPerArm; i++) {
        const idx = arm * pointsPerArm + i;
        const t = i / pointsPerArm;
        const radius = t * 5;
        const spin = t * 3;
        const angle = armAngle + spin;

        // Add randomness
        const rx = (Math.random() - 0.5) * 0.5 * t;
        const ry = (Math.random() - 0.5) * 0.3 * (1 - t * 0.7);
        const rz = (Math.random() - 0.5) * 0.5 * t;

        positions[idx*3] = Math.cos(angle) * radius + rx;
        positions[idx*3+1] = ry;
        positions[idx*3+2] = Math.sin(angle) * radius + rz;

        const c = new THREE.Color().lerpColors(colorInner, colorOuter, t);
        colors[idx*3] = c.r;
        colors[idx*3+1] = c.g;
        colors[idx*3+2] = c.b;

        sizes[idx] = (1 - t * 0.6) * 0.04;
      }
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyGroup.add(galaxy);

    // Center glow
    const coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.8 });
    galaxyGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const coreGlow = new THREE.SphereGeometry(0.6, 16, 16);
    const coreGlowMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.2 });
    galaxyGroup.add(new THREE.Mesh(coreGlow, coreGlowMat));

    // Outer dust ring
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 5 + Math.random() * 3;
      const a = Math.random() * Math.PI * 2;
      dustPos[i*3] = Math.cos(a) * r;
      dustPos[i*3+1] = (Math.random() - 0.5) * 0.5;
      dustPos[i*3+2] = Math.sin(a) * r;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    galaxyGroup.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.015, transparent: true, opacity: 0.3, sizeAttenuation: true })));

    galaxyGroup.rotation.x = 0.5;

    // Lights
    scene.add(new THREE.AmbientLight(0x202040, 0.5));
    const pLight = new THREE.PointLight(0x8b5cf6, 3, 15);
    pLight.position.set(0, 0, 0);
    scene.add(pLight);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      galaxyGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => { camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize',handleResize); cancelAnimationFrame(animId); renderer.dispose(); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); initRef.current=false; };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
