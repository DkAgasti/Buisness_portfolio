'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene4() {
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Geometric Crystal Diamond ---
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
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.8 });
    crystalGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Inner crystal (smaller, rotated)
    const innerCrystalGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerCrystalMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.6, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.3 });
    const innerCrystal = new THREE.Mesh(innerCrystalGeo, innerCrystalMat);
    innerCrystal.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    crystalGroup.add(innerCrystal);

    const innerWire = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.22, 0),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.6 })
    );
    innerWire.rotation.copy(innerCrystal.rotation);
    crystalGroup.add(innerWire);

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(2.8 + i * 0.4, 0.008, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x3b82f6 : i === 1 ? 0x8b5cf6 : 0xc084fc, transparent: true, opacity: 0.4 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (i * 0.3);
      ringMesh.rotation.y = i * 0.5;
      crystalGroup.add(ringMesh);
    }

    // Edge glow particles
    const vertices = crystalGeo.getAttribute('position');
    const edgeParticles = new THREE.BufferGeometry();
    const epCount = 100;
    const epPos = new Float32Array(epCount * 3);
    for (let i = 0; i < epCount; i++) {
      const vi = Math.floor(Math.random() * (vertices.count - 1));
      const vi2 = (vi + 1) % vertices.count;
      const t = Math.random();
      epPos[i*3] = vertices.getX(vi) * (1-t) + vertices.getX(vi2) * t;
      epPos[i*3+1] = vertices.getY(vi) * (1-t) + vertices.getY(vi2) * t;
      epPos[i*3+2] = vertices.getZ(vi) * (1-t) + vertices.getZ(vi2) * t;
    }
    edgeParticles.setAttribute('position', new THREE.BufferAttribute(epPos, 3));
    crystalGroup.add(new THREE.Points(edgeParticles, new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.04, transparent: true, opacity: 0.8, sizeAttenuation: true })));

    // Background particles
    const bgCount = 200;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) { bgPos[i*3]=(Math.random()-0.5)*16; bgPos[i*3+1]=(Math.random()-0.5)*16; bgPos[i*3+2]=(Math.random()-0.5)*16; }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.02, transparent: true, opacity: 0.4, sizeAttenuation: true })));

    // Lights
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8); dl.position.set(3,3,5); scene.add(dl);
    const pl1 = new THREE.PointLight(0x3b82f6, 2, 12); pl1.position.set(3,0,3); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x8b5cf6, 2, 12); pl2.position.set(-3,0,-3); scene.add(pl2);
    const pl3 = new THREE.PointLight(0xec4899, 1, 8); pl3.position.set(0,3,0); scene.add(pl3);

    let time = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;
      crystal.rotation.y += 0.005;
      crystal.rotation.x = Math.sin(time) * 0.1;
      innerCrystal.rotation.y -= 0.007;
      innerCrystal.rotation.z += 0.003;
      innerWire.rotation.copy(innerCrystal.rotation);
      crystalGroup.children.forEach((c, i) => {
        if (c.geometry && c.geometry.type === 'TorusGeometry') {
          c.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
        }
      });
      crystalGroup.position.y = Math.sin(time * 0.8) * 0.15;
      crystalMat.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => { camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize',handleResize); cancelAnimationFrame(animId); renderer.dispose(); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); initRef.current=false; };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
