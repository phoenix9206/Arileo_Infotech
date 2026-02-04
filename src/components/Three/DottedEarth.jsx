// import { Canvas, useFrame } from "@react-three/fiber";
// import { useMemo, useRef } from "react";
// import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";


/* ------------------ DOTS ------------------ */
// function EarthDots() {
//   const pointsRef = useRef();

//   const geometry = useMemo(() => {
//     const g = new THREE.BufferGeometry();
//     const points = [];

//     const radius = 2.6;
//     const latSegments = 90;
//     const lonSegments = 180;

//     for (let i = 0; i < latSegments; i++) {
//       const theta = (i / latSegments) * Math.PI;

//       for (let j = 0; j < lonSegments; j++) {
//         const phi = (j / lonSegments) * Math.PI * 2;

//         const x = radius * Math.sin(theta) * Math.cos(phi);
//         const y = radius * Math.cos(theta);
//         const z = radius * Math.sin(theta) * Math.sin(phi);

//         points.push(x, y, z);
//       }
//     }

//     g.setAttribute(
//       "position",
//       new THREE.Float32BufferAttribute(points, 3)
//     );

//     return g;
//   }, []);

//   useFrame((_, delta) => {
//     pointsRef.current.rotation.y += delta * 0.08;
//   });

//   return (
//     <points ref={pointsRef} geometry={geometry}>
//       <pointsMaterial
//         size={0.025}
//         color="#ffffff"
//         opacity={0.8}
//         transparent
//       />
//     </points>
//   );
// }


function DraggableEarth({ children, scale = 1.20 }) {
  const groupRef = useRef();
  const { gl } = useThree();

  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

//   useFrame(() => {
//     if (!isDragging.current) {
//       // inertia
//       velocity.current.x *= 0.95;
//       velocity.current.y *= 0.95;

//       groupRef.current.rotation.y += velocity.current.x;
//       groupRef.current.rotation.x += velocity.current.y;
//     }

//     // clamp vertical rotation (no flip)
//     groupRef.current.rotation.x = THREE.MathUtils.clamp(
//       groupRef.current.rotation.x,
//       -Math.PI / 2,
//       Math.PI / 2
//     );
//   });

    useFrame(() => {
        // inertia
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;

        groupRef.current.rotation.y += velocity.current.x;
        groupRef.current.rotation.x += velocity.current.y;

        // clamp vertical rotation
        groupRef.current.rotation.x = THREE.MathUtils.clamp(
            groupRef.current.rotation.x,
            -Math.PI / 2 + 0.1,
            Math.PI / 2 - 0.1
        );
    });


  const onPointerDown = (e) => {
    isDragging.current = true;
    velocity.current.x = 0;
    velocity.current.y = 0;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    const rotSpeed = 0.005;

    velocity.current.x = dx * rotSpeed;
    velocity.current.y = dy * rotSpeed;

    groupRef.current.rotation.y += velocity.current.x;
    groupRef.current.rotation.x += velocity.current.y;

    last.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <group
      ref={groupRef}
      scale={scale}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {children}
    </group>
  );
}



function EarthDots() {
  const pointsRef = useRef();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const points = [];

    const radius = 2.6;
    const img = new Image();
    img.src = "/textures/earth_mask.png";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, img.width, img.height).data;

      const latSegments = 180;
      const lonSegments = 360;

      for (let lat = 0; lat < latSegments; lat++) {
        const theta = (lat / latSegments) * Math.PI;

        for (let lon = 0; lon < lonSegments; lon++) {
          const phi = (lon / lonSegments) * Math.PI * 2;

          // Map lat/lon to image coords
          const xImg = Math.floor((1 - lon / lonSegments) * img.width);
          const yImg = Math.floor((lat / latSegments) * img.height);

          const idx = (yImg * img.width + xImg) * 4;
          const brightness = data[idx]; // red channel

          // Only land (white areas)
          if (brightness > 100) {
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.cos(theta);
            const z = radius * Math.sin(theta) * Math.sin(phi);
            points.push(x, y, z);
          }
        }
      }

      g.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3)
      );
    };

    return g;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.9}
      />
    </points>
  );
}



/* ------------------ WIREFRAME ------------------ */
function EarthWireframe() {
  const wireRef = useRef();

  useFrame((_, delta) => {
    wireRef.current.rotation.y += delta * 0.08;
  });

  return (
    <mesh ref={wireRef}>
      <sphereGeometry args={[2.6, 32, 32]} />
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        opacity={0.15}
        transparent
      />
    </mesh>
  );
}

/* ------------------ MAIN ------------------ */
export default function DottedEarth() {
  return (
    <div className="earth-layer">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <DraggableEarth scale={1.15}>

        <EarthDots />
        </DraggableEarth>
        {/* <EarthWireframe /> */}
        {/* <LatLongLines /> */}
      </Canvas>
    </div>
  );
}
