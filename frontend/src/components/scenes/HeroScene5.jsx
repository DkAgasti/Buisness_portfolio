'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene5() {
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Neural Network Connected Nodes ---
    const netGroup = new THREE.Group();
    scene.add(netGroup);

    const nodeCount = 40;
    const connectionDist = 3.5;
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const velocities = [];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0x3b82f6 : i % 3 === 1 ? 0x8b5cf6 : 0xc084fc,
        emissive: i % 3 === 0 ? 0x3b82f6 : i % 3 === 1 ? 0x8b5cf6 : 0xc084fc,
        emissiveIntensity: 0.8,
      });
      const node = new THREE.Mesh(nodeGeo, mat);
      node.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      netGroup.add(node);
      nodes.push(node);
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      ));
    }

    // Line material for connections
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.15,
    });

    // Create pulse particles along connections
    const pulseCount = 20;
    const pulseGeo = new THREE.SphereGeometry(0.03, 4, 4);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.8 });
    const pulses = [];
    for (let i = 0; i < pulseCount; i++) {
      const pulse = new THREE.Mesh(pulseGeo, pulseMat.clone());
      pulse.visible = false;
      netGroup.add(pulse);
      pulses.push({ mesh: pulse, from: 0, to: 0, t: 0, active: false, speed: 0.005 + Math.random() * 0.01 });
    }

    // Central glow
    const glowGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    netGroup.add(glow);

    // Background dust
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) { dustPos[i*3]=(Math.random()-0.5)*18; dustPos[i*3+1]=(Math.random()-0.5)*18; dustPos[i*3+2]=(Math.random()-0.5)*18; }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.015, transparent: true, opacity: 0.3, sizeAttenuation: true })));

    // Lights
    scene.add(new THREE.AmbientLight(0x303050, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 0.4); dl.position.set(5,5,5); scene.add(dl);
    const npl1 = new THREE.PointLight(0x3b82f6, 2, 15); npl1.position.set(4,0,4); scene.add(npl1);
    const npl2 = new THREE.PointLight(0x8b5cf6, 2, 15); npl2.position.set(-4,0,-4); scene.add(npl2);

    // Track lines
    let lines = [];

    let time = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.006;

      // Move nodes
      nodes.forEach((node, i) => {
        node.position.add(velocities[i]);
        // Bounce off bounds
        ['x','y','z'].forEach(axis => {
          const bound = axis === 'x' ? 4 : 3;
          if (Math.abs(node.position[axis]) > bound) velocities[i][axis] *= -1;
        });
        // Pulse size
        const s = 1 + Math.sin(time * 2 + i) * 0.4;
        node.scale.setScalar(s);
      });

      // Remove old lines
      lines.forEach(l => { netGroup.remove(l); l.geometry.dispose(); });
      lines = [];

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if (dist < connectionDist) {
            const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].position.clone(), nodes[j].position.clone()]);
            const mat = lineMat.clone();
            mat.opacity = 0.15 * (1 - dist / connectionDist);
            const line = new THREE.Line(geo, mat);
            netGroup.add(line);
            lines.push(line);
          }
        }
      }

      // Activate pulses
      pulses.forEach(p => {
        if (!p.active) {
          if (Math.random() < 0.02) {
            p.from = Math.floor(Math.random() * nodeCount);
            p.to = Math.floor(Math.random() * nodeCount);
            if (p.from !== p.to && nodes[p.from].position.distanceTo(nodes[p.to].position) < connectionDist) {
              p.active = true;
              p.t = 0;
              p.mesh.visible = true;
            }
          }
        } else {
          p.t += p.speed;
          if (p.t >= 1) {
            p.active = false;
            p.mesh.visible = false;
          } else {
            p.mesh.position.lerpVectors(nodes[p.from].position, nodes[p.to].position, p.t);
            p.mesh.material.opacity = Math.sin(p.t * Math.PI) * 0.8;
          }
        }
      });

      netGroup.rotation.y += 0.001;
      glow.scale.setScalar(1 + Math.sin(time * 1.5) * 0.2);
      glow.material.opacity = 0.1 + Math.sin(time * 1.5) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => { camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize',handleResize); cancelAnimationFrame(animId); renderer.dispose(); lines.forEach(l=>l.geometry.dispose()); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); initRef.current=false; };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
