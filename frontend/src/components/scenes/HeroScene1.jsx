'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene1() {
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Morphing Organic Blob
    const sphereGeo = new THREE.IcosahedronGeometry(2.5, 5);
    const posAttr = sphereGeo.getAttribute('position');
    const origPos = new Float32Array(posAttr.array);
    const blobMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.8, wireframe: true, transparent: true, opacity: 0.5 });
    const blob = new THREE.Mesh(sphereGeo, blobMat);
    scene.add(blob);

    const innerGeo = new THREE.IcosahedronGeometry(1.8, 4);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.8, wireframe: true, transparent: true, opacity: 0.2 });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    const ringCount = 250;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2;
      const r = 3 + Math.random() * 0.5;
      ringPos[i*3] = Math.cos(a) * r;
      ringPos[i*3+1] = (Math.random()-0.5)*1.5;
      ringPos[i*3+2] = Math.sin(a) * r;
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    const ring = new THREE.Points(ringGeo, new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.025, transparent: true, opacity: 0.7, sizeAttenuation: true }));
    scene.add(ring);

    const pCount = 150;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount*3);
    for (let i=0;i<pCount;i++){pPos[i*3]=(Math.random()-0.5)*14;pPos[i*3+1]=(Math.random()-0.5)*14;pPos[i*3+2]=(Math.random()-0.5)*14;}
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc084fc, size: 0.02, transparent: true, opacity: 0.5, sizeAttenuation: true }));
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0x404040, 0.5));
    const dl = new THREE.DirectionalLight(0x3b82f6, 1); dl.position.set(3,3,5); scene.add(dl);
    const pl = new THREE.PointLight(0x8b5cf6, 1.5, 10); pl.position.set(-3,2,3); scene.add(pl);

    function noise3D(x,y,z){return Math.sin(x*1.5)*Math.cos(y*1.5)*Math.sin(z*1.5)+Math.sin(x*3.1+y*2.3)*0.5+Math.cos(z*2.7+x*1.7)*0.3;}

    let time = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;
      const pos = sphereGeo.getAttribute('position');
      for (let i=0;i<pos.count;i++){
        const ox=origPos[i*3],oy=origPos[i*3+1],oz=origPos[i*3+2];
        const n=noise3D(ox*0.8+time,oy*0.8+time*0.7,oz*0.8+time*0.5);
        const s=1+n*0.15;
        pos.array[i*3]=ox*s;pos.array[i*3+1]=oy*s;pos.array[i*3+2]=oz*s;
      }
      pos.needsUpdate = true;
      blob.rotation.y+=0.003; blob.rotation.x+=0.001;
      ring.rotation.y+=0.002; particles.rotation.y+=0.0005;
      blobMat.emissiveIntensity=0.5+Math.sin(time*2)*0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => { camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize',handleResize); cancelAnimationFrame(animId); renderer.dispose(); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); initRef.current=false; };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
