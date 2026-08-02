'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene2() {
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // DNA Double Helix
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);
    const nodeCount = 50;
    const helixR = 1.5, helixH = 10, turns = 3;
    const nodeGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const nMat1 = new THREE.MeshStandardMaterial({color:0x3b82f6,emissive:0x3b82f6,emissiveIntensity:0.8});
    const nMat2 = new THREE.MeshStandardMaterial({color:0x8b5cf6,emissive:0x8b5cf6,emissiveIntensity:0.8});
    const s1Nodes=[], s2Nodes=[];

    for(let i=0;i<nodeCount;i++){
      const t=i/nodeCount, angle=t*Math.PI*2*turns, y=(t-0.5)*helixH;
      const x1=Math.cos(angle)*helixR, z1=Math.sin(angle)*helixR;
      const n1=new THREE.Mesh(nodeGeo,nMat1); n1.position.set(x1,y,z1); helixGroup.add(n1); s1Nodes.push(n1);
      const x2=Math.cos(angle+Math.PI)*helixR, z2=Math.sin(angle+Math.PI)*helixR;
      const n2=new THREE.Mesh(nodeGeo,nMat2); n2.position.set(x2,y,z2); helixGroup.add(n2); s2Nodes.push(n2);
      if(i%3===0){
        const rG=new THREE.CylinderGeometry(0.012,0.012,helixR*2,4);
        const rM=new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x60a5fa,emissiveIntensity:0.4,transparent:true,opacity:0.4});
        const rung=new THREE.Mesh(rG,rM); rung.position.set((x1+x2)/2,y,(z1+z2)/2); rung.lookAt(x1,y,z1); rung.rotateZ(Math.PI/2);
        helixGroup.add(rung);
      }
    }

    // Strand tubes
    const c1=new THREE.CatmullRomCurve3(s1Nodes.map(n=>n.position.clone()));
    const c2=new THREE.CatmullRomCurve3(s2Nodes.map(n=>n.position.clone()));
    helixGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c1,150,0.025,6,false),new THREE.MeshStandardMaterial({color:0x3b82f6,emissive:0x3b82f6,emissiveIntensity:0.5,transparent:true,opacity:0.6})));
    helixGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c2,150,0.025,6,false),new THREE.MeshStandardMaterial({color:0x8b5cf6,emissive:0x8b5cf6,emissiveIntensity:0.5,transparent:true,opacity:0.6})));

    // Particles
    const pC=200; const pG=new THREE.BufferGeometry(); const pP=new Float32Array(pC*3);
    for(let i=0;i<pC;i++){pP[i*3]=(Math.random()-0.5)*16;pP[i*3+1]=(Math.random()-0.5)*16;pP[i*3+2]=(Math.random()-0.5)*16;}
    pG.setAttribute('position',new THREE.BufferAttribute(pP,3));
    scene.add(new THREE.Points(pG,new THREE.PointsMaterial({color:0x93c5fd,size:0.02,transparent:true,opacity:0.4,sizeAttenuation:true})));

    scene.add(new THREE.AmbientLight(0x404060,0.6));
    const d=new THREE.DirectionalLight(0xffffff,0.6);d.position.set(5,5,5);scene.add(d);
    const pl1=new THREE.PointLight(0x3b82f6,2,15);pl1.position.set(3,0,3);scene.add(pl1);
    const pl2=new THREE.PointLight(0x8b5cf6,2,15);pl2.position.set(-3,0,-3);scene.add(pl2);

    let time=0,animId;
    const animate=()=>{
      animId=requestAnimationFrame(animate); time+=0.005;
      helixGroup.rotation.y+=0.005; helixGroup.position.y=Math.sin(time*2)*0.3;
      s1Nodes.forEach((n,i)=>{n.scale.setScalar(1+Math.sin(time*3+i*0.3)*0.3);});
      s2Nodes.forEach((n,i)=>{n.scale.setScalar(1+Math.sin(time*3+i*0.3+Math.PI)*0.3);});
      renderer.render(scene,camera);
    };
    animate();

    const handleResize=()=>{camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();renderer.setSize(container.clientWidth,container.clientHeight);};
    window.addEventListener('resize',handleResize);
    return()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(animId);renderer.dispose();if(container.contains(renderer.domElement))container.removeChild(renderer.domElement);initRef.current=false;};
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
