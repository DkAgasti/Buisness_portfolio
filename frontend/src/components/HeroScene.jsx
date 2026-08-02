'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const containerRef = useRef(null);
  const initRef = useRef(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;

    // Check WebGL support first
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglFailed(true);
      initRef.current = false;
      return;
    }

    let renderer;
    let animId;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      setWebglFailed(true);
      initRef.current = false;
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Crystal Diamond Group ---
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    // Main crystal (octahedron)
    const crystalGeo = new THREE.OctahedronGeometry(2, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.3,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystal);

    // Wireframe overlay
    const wireGeo = new THREE.OctahedronGeometry(2.02, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    crystalGroup.add(wireframe);

    // Inner crystal (smaller, rotated)
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.25,
    });
    const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
    innerCrystal.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    crystalGroup.add(innerCrystal);

    // Inner wireframe
    const innerWireGeo = new THREE.OctahedronGeometry(1.22, 0);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
    innerWire.rotation.copy(innerCrystal.rotation);
    crystalGroup.add(innerWire);

    // --- Orbiting Rings ---
    const ringConfigs = [
      { radius: 2.8, color: 0x3b82f6, tiltX: 1.1, tiltY: 0.2, thickness: 0.01 },
      { radius: 3.3, color: 0x8b5cf6, tiltX: 1.85, tiltY: -0.4, thickness: 0.008 },
      { radius: 3.8, color: 0xc084fc, tiltX: 1.5, tiltY: 0.6, thickness: 0.008 },
    ];

    const ringMeshes = [];
    ringConfigs.forEach((cfg) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.thickness, 8, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = cfg.tiltX;
      ring.rotation.y = cfg.tiltY;
      crystalGroup.add(ring);
      ringMeshes.push(ring);
    });

    // --- Edge Glow Particles ---
    const epCount = 100;
    const epGeo = new THREE.BufferGeometry();
    const epPos = new Float32Array(epCount * 3);
    const vertices = crystalGeo.getAttribute('position');
    for (let i = 0; i < epCount; i++) {
      const vi = Math.floor(Math.random() * (vertices.count - 1));
      const vi2 = (vi + 1) % vertices.count;
      const t = Math.random();
      epPos[i * 3] = vertices.getX(vi) * (1 - t) + vertices.getX(vi2) * t;
      epPos[i * 3 + 1] = vertices.getY(vi) * (1 - t) + vertices.getY(vi2) * t;
      epPos[i * 3 + 2] = vertices.getZ(vi) * (1 - t) + vertices.getZ(vi2) * t;
    }
    epGeo.setAttribute('position', new THREE.BufferAttribute(epPos, 3));
    crystalGroup.add(
      new THREE.Points(
        epGeo,
        new THREE.PointsMaterial({
          color: 0x93c5fd,
          size: 0.04,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
        })
      )
    );

    // --- Background Particles ---
    const bgCount = 250;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 20;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgParticles = new THREE.Points(
      bgGeo,
      new THREE.PointsMaterial({
        color: 0x60a5fa,
        size: 0.02,
        transparent: true,
        opacity: 0.35,
        sizeAttenuation: true,
      })
    );
    scene.add(bgParticles);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(3, 3, 5);
    scene.add(dl);
    const pl1 = new THREE.PointLight(0x3b82f6, 2, 15);
    pl1.position.set(4, 0, 4);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x8b5cf6, 2, 15);
    pl2.position.set(-4, 0, -4);
    scene.add(pl2);
    const pl3 = new THREE.PointLight(0xec4899, 0.8, 10);
    pl3.position.set(0, 4, 0);
    scene.add(pl3);

    // --- Drag Interaction ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      // Apply drag to velocity
      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Listen on window so drag works even over text/buttons
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- Animation ---
    let time = 0;
    const autoSpeedY = 0.003;
    const autoSpeedX = 0.001;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;

      // Apply velocity with friction (momentum after drag release)
      if (!isDragging) {
        velocityX *= 0.97;
        velocityY *= 0.97;
      }

      // Crystal: gentle slow auto-rotation
      crystal.rotation.y += 0.004;
      crystal.rotation.x = Math.sin(time * 0.5) * 0.08;
      wireframe.rotation.copy(crystal.rotation);

      // Inner crystal: own slow counter-rotation
      innerCrystal.rotation.y -= 0.006;
      innerCrystal.rotation.z += 0.003;
      innerWire.rotation.copy(innerCrystal.rotation);

      // Orbital rings: COMPLETELY FIXED - no rotation at all

      // Float crystal gently
      crystalGroup.position.y = Math.sin(time * 0.8) * 0.15;

      // Pulse emissive
      crystalMat.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.2;

      // Background particles slow rotation
      bgParticles.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (animId) cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      }
      crystalGeo.dispose(); crystalMat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      innerGeo.dispose(); innerMat.dispose();
      innerWireGeo.dispose(); innerWireMat.dispose();
      epGeo.dispose(); bgGeo.dispose();
      ringConfigs.forEach((_, i) => {
        ringMeshes[i].geometry.dispose();
        ringMeshes[i].material.dispose();
      });
      initRef.current = false;
    };
  }, []);

  // CSS fallback when WebGL is not available
  if (webglFailed) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2">
          {/* CSS Crystal */}
          <div className="w-48 h-48 relative animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute inset-0 rotate-45 border-2 border-blue-500/40 bg-blue-500/5 rounded-sm" />
            <div className="absolute inset-4 rotate-[30deg] border-2 border-purple-500/30 bg-purple-500/5 rounded-sm" />
          </div>
          {/* CSS Orbit rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/20 rounded-full" style={{ transform: 'translate(-50%,-50%) rotateX(60deg) rotateZ(15deg)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-purple-500/15 rounded-full" style={{ transform: 'translate(-50%,-50%) rotateX(70deg) rotateZ(-30deg)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] border border-pink-400/10 rounded-full" style={{ transform: 'translate(-50%,-50%) rotateX(50deg) rotateZ(40deg)' }} />
        </div>
        {/* Particles via dots */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
