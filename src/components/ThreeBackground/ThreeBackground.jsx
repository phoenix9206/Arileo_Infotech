import React, { useLayoutEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
  uniform float uScroll;
  uniform float uTime;
  
  attribute vec3 aSphere;
  attribute vec3 aMonitor;
  attribute vec3 aPlane;
  attribute float aRandom;
  
  varying vec3 vColor;
  
  void main() {
    vec3 pos = aSphere;
    vec3 color = vec3(0.2, 0.6, 1.0); // Default Blue-ish
    
    // Phase 1: Sphere -> Monitor (0.0 to 0.33)
    if (uScroll < 0.33) {
      float t = smoothstep(0.0, 0.33, uScroll);
      pos = mix(aSphere, aMonitor, t);
      color = mix(vec3(0.2, 0.8, 1.0), vec3(0.4, 0.6, 1.0), t);
    } 
    // Phase 2: Monitor -> Paper Plane (0.33 to 0.66)
    else if (uScroll < 0.66) {
      float t = smoothstep(0.33, 0.66, uScroll);
      pos = mix(aMonitor, aPlane, t);
      color = mix(vec3(0.4, 0.6, 1.0), vec3(1.0, 1.0, 1.0), t);
    } 
    // Phase 3: Paper Plane Move (0.66 to 1.0)
    else {
      pos = aPlane;
      float t = (uScroll - 0.66) / 0.34;
      // Fly to right and slightly up
      pos.x += t * 15.0; 
      pos.y += t * 5.0;
      pos.z -= t * 5.0; // Move away slightly
      
      // Rotate slightly as it flies
      float angle = -t * 0.5;
      float cz = cos(angle);
      float sz = sin(angle);
      // Simple 2D rotation matrix for Z axis tilt if needed, but translation is enough for impact
      
      color = vec3(1.0, 1.0, 1.0);
    }

    // Add some noise breathing
    pos.x += sin(uTime * 2.0 + aRandom * 10.0) * 0.05;
    pos.y += cos(uTime * 1.5 + aRandom * 10.0) * 0.05;
    pos.z += sin(uTime * 1.0 + aRandom * 10.0) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = (4.0 * (1.0 - uScroll * 0.3)) * (10.0 / -mvPosition.z);
    
    vColor = color;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Circular particle
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Soft edge
    float alpha = 1.0 - smoothstep(0.3, 0.5, r);
    
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

function ParticleMorph() {
  const meshRef = useRef();
  const { viewport } = useThree();

  // Data Generation
  const { positionsSphere, positionsMonitor, positionsPlane, randoms } =
    useMemo(() => {
      const count = 4000;
      const sphere = new Float32Array(count * 3);
      const monitor = new Float32Array(count * 3);
      const plane = new Float32Array(count * 3);
      const randoms = new Float32Array(count);

      // Sphere Generation
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 2.5;

        sphere[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        sphere[i * 3 + 2] = r * Math.cos(phi);

        randoms[i] = Math.random();
      }

      // Monitor Generation (Curved Screen)
      // Width ~5, Height ~3
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 6.0;
        const y = (Math.random() - 0.5) * 3.5;
        // Curve: Z is dependent on distance from center X
        const z = Math.pow(x * 0.3, 2.0) * 0.5;

        monitor[i * 3 + 0] = x;
        monitor[i * 3 + 1] = y;
        monitor[i * 3 + 2] = z;
      }

      // Paper Plane Generation
      // Triangle 1: (2,0,0), (-1,1,0), (-1,-1,0) - Main Dart
      // Refined Telegram shape:
      // Tip: (1.5, 0, 0)
      // Wings: (-1.5, 1.2, 0), (-1.5, -1.2, 0)
      // Notch: (-0.8, 0, 0)
      // We sample two triangles:
      // T1: Tip, WingTop, Notch
      // T2: Tip, WingBot, Notch

      const tip = new THREE.Vector3(2.0, 0, 0);
      const wingTop = new THREE.Vector3(-1.0, 1.5, 0);
      const wingBot = new THREE.Vector3(-1.0, -1.5, 0);
      const notch = new THREE.Vector3(-0.5, 0, 0);

      for (let i = 0; i < count; i++) {
        let p = new THREE.Vector3();

        // 50% chance for each wing
        if (Math.random() > 0.5) {
          // Top Wing
          let r1 = Math.random();
          let r2 = Math.random();
          if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
          }
          // p = A + r1(B-A) + r2(C-A)
          // A=Tip, B=WingTop, C=Notch
          p.copy(tip)
            .addScaledVector(wingTop.clone().sub(tip), r1)
            .addScaledVector(notch.clone().sub(tip), r2);
        } else {
          // Bot Wing
          let r1 = Math.random();
          let r2 = Math.random();
          if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
          }
          // A=Tip, B=WingBot, C=Notch
          p.copy(tip)
            .addScaledVector(wingBot.clone().sub(tip), r1)
            .addScaledVector(notch.clone().sub(tip), r2);
        }

        // Add some "thickness" or scatter
        p.z += (Math.random() - 0.5) * 0.1;

        plane[i * 3 + 0] = p.x;
        plane[i * 3 + 1] = p.y;
        plane[i * 3 + 2] = p.z;
      }

      return {
        positionsSphere: sphere,
        positionsMonitor: monitor,
        positionsPlane: plane,
        randoms,
      };
    }, []);

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useLayoutEffect(() => {
    const scrollProxy = { value: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body", // Scroll entire page
        start: "top top",
        end: "bottom bottom",
        scrub: 2, // Smooth scrubbing
      },
    });

    tl.to(scrollProxy, {
      value: 1,
      ease: "none",
      onUpdate: () => {
        if (meshRef.current) {
          meshRef.current.material.uniforms.uScroll.value = scrollProxy.value;
        }
      },
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" // Initial position (Sphere)
          count={positionsSphere.length / 3}
          array={positionsSphere}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSphere"
          count={positionsSphere.length / 3}
          array={positionsSphere}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aMonitor"
          count={positionsMonitor.length / 3}
          array={positionsMonitor}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPlane"
          count={positionsPlane.length / 3}
          array={positionsPlane}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleMorph />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
}
