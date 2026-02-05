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


// function DraggableEarth({ children, scale = 1.20 }) {
//   const groupRef = useRef();
//   const { gl } = useThree();

//   const isDragging = useRef(false);
//   const last = useRef({ x: 0, y: 0 });
//   const velocity = useRef({ x: 0, y: 0 });

// //   useFrame(() => {
// //     if (!isDragging.current) {
// //       // inertia
// //       velocity.current.x *= 0.95;
// //       velocity.current.y *= 0.95;

// //       groupRef.current.rotation.y += velocity.current.x;
// //       groupRef.current.rotation.x += velocity.current.y;
// //     }

// //     // clamp vertical rotation (no flip)
// //     groupRef.current.rotation.x = THREE.MathUtils.clamp(
// //       groupRef.current.rotation.x,
// //       -Math.PI / 2,
// //       Math.PI / 2
// //     );
// //   });

//     useFrame(() => {
//         // inertia
//         velocity.current.x *= 0.94;
//         velocity.current.y *= 0.94;

//         groupRef.current.rotation.y += velocity.current.x;
//         groupRef.current.rotation.x += velocity.current.y;

//         // clamp vertical rotation
//         groupRef.current.rotation.x = THREE.MathUtils.clamp(
//             groupRef.current.rotation.x,
//             -Math.PI / 2 + 0.1,
//             Math.PI / 2 - 0.1
//         );
//     });


//   const onPointerDown = (e) => {
//     isDragging.current = true;
//     velocity.current.x = 0;
//     velocity.current.y = 0;
//     last.current = { x: e.clientX, y: e.clientY };
//   };

//   const onPointerMove = (e) => {
//     if (!isDragging.current) return;

//     const dx = e.clientX - last.current.x;
//     const dy = e.clientY - last.current.y;

//     const rotSpeed = 0.005;

//     velocity.current.x = dx * rotSpeed;
//     velocity.current.y = dy * rotSpeed;

//     groupRef.current.rotation.y += velocity.current.x;
//     groupRef.current.rotation.x += velocity.current.y;

//     last.current = { x: e.clientX, y: e.clientY };
//   };

//   const onPointerUp = () => {
//     isDragging.current = false;
//   };

//   return (
//     <group
//       ref={groupRef}
//       scale={scale}
//       onPointerDown={onPointerDown}
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//       onPointerLeave={onPointerUp}
//     >
//       {children}
//     </group>
//   );
// }

// function DraggableEarth({ children, scale = 1.3 }) {
//   const groupRef = useRef();
//   const { size } = useThree();

//   const dragging = useRef(false);
//   const lastVec = useRef(new THREE.Vector3());
//   const rotationQuat = useRef(new THREE.Quaternion());

//   // Project mouse to virtual sphere
//   const getArcballVector = (x, y) => {
//     const v = new THREE.Vector3(
//       (2 * x - size.width) / size.width,
//       (size.height - 2 * y) / size.height,
//       0
//     );

//     const length = v.x * v.x + v.y * v.y;

//     if (length <= 1) {
//       v.z = Math.sqrt(1 - length);
//     } else {
//       v.normalize();
//     }

//     return v;
//   };

//   const onPointerDown = (e) => {
//     console.log("pointer down");

//     dragging.current = true;
//     lastVec.current = getArcballVector(e.clientX, e.clientY);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging.current) return;

//     const currVec = getArcballVector(e.clientX, e.clientY);

//     const axis = new THREE.Vector3()
//       .crossVectors(lastVec.current, currVec)
//       .normalize();

//     const angle = Math.acos(
//       Math.min(1, lastVec.current.dot(currVec))
//     );

//     if (!isNaN(angle) && axis.lengthSq() > 0) {
//       rotationQuat.current.setFromAxisAngle(axis, angle);
//       groupRef.current.quaternion.premultiply(rotationQuat.current);
//     }

//     lastVec.current = currVec;
//   };

//   const onPointerUp = () => {
//     dragging.current = false;
//   };

//   return (
//     <group
//       ref={groupRef}
//       scale={scale}
//       onPointerDown={onPointerDown}
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//       onPointerLeave={onPointerUp}
//     >
//       {children}
//     </group>
//   );
// }



// function DraggableEarth({ children, scale = 1.3 }) {
//   const groupRef = useRef();
//   const { size } = useThree();

//   const dragging = useRef(false);
//   const lastVec = useRef(new THREE.Vector3());

//   const projectOnSphere = (x, y) => {
//     const v = new THREE.Vector3(
//       (2 * x - size.width) / size.width,
//       (size.height - 2 * y) / size.height,
//       0
//     );

//     const len = v.lengthSq();
//     if (len <= 1) {
//       v.z = Math.sqrt(1 - len);
//     } else {
//       v.normalize();
//     }

//     return v;
//   };

//   const onPointerDown = (e) => {
//     e.stopPropagation();
//     dragging.current = true;
//     lastVec.current = projectOnSphere(e.clientX, e.clientY);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging.current) return;

//     const currVec = projectOnSphere(e.clientX, e.clientY);

//     const axis = new THREE.Vector3()
//       .crossVectors(lastVec.current, currVec)
//       .normalize();

//     const angle = Math.acos(
//       Math.min(1, lastVec.current.dot(currVec))
//     );

//     if (axis.lengthSq() > 0 && !isNaN(angle)) {
//       const quat = new THREE.Quaternion();
//       quat.setFromAxisAngle(axis, angle);
//       groupRef.current.quaternion.premultiply(quat);
//     }

//     lastVec.current = currVec;
//   };

//   const onPointerUp = () => {
//     dragging.current = false;
//   };

//   return (
//     <group
//       ref={groupRef}
//       scale={scale}
//       onPointerDown={onPointerDown}
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//       onPointerLeave={onPointerUp}
//     >
//       {children}
//     </group>
//   );
// }

// function DraggableEarth({ children, scale = 1.15 }) {
//   const groupRef = useRef();
//   const { size } = useThree();

//   const DRAG_SPEED = 3.0; // increase if still slow
//   const DAMPING = 0.97;

//   const dragging = useRef(false);
//   const lastVec = useRef(new THREE.Vector3());
//   const velocity = useRef(new THREE.Vector3());

//   const projectOnSphere = (x, y) => {
//     const v = new THREE.Vector3(
//       (2 * x - size.width) / size.width,
//       (size.height - 2 * y) / size.height,
//       0
//     );

//     const len = v.lengthSq();
//     if (len <= 1) v.z = Math.sqrt(1 - len);
//     else v.normalize();

//     return v;
//   };

//   useFrame(() => {
//     if (!dragging.current) {
//       // inertia
//       velocity.current.multiplyScalar(DAMPING);

//       const angle = velocity.current.length();
//       if (angle > 0.00001) {
//         const axis = velocity.current.clone().normalize();
//         const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
//         groupRef.current.quaternion.premultiply(quat);
//       }
//     }
//   });

//   const onPointerDown = (e) => {
//     e.stopPropagation();
//     dragging.current = true;
//     velocity.current.set(0, 0, 0);
//     lastVec.current = projectOnSphere(e.clientX, e.clientY);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging.current) return;

//     const currVec = projectOnSphere(e.clientX, e.clientY);

//     const axis = new THREE.Vector3()
//       .crossVectors(lastVec.current, currVec);

//     const angle = Math.acos(
//       Math.min(1, lastVec.current.dot(currVec)) * DRAG_SPEED
//     );

//     if (axis.lengthSq() > 0 && !isNaN(angle)) {
//       axis.normalize();

//       const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
//       groupRef.current.quaternion.premultiply(quat);

//       // save velocity for inertia
//       velocity.current.copy(axis).multiplyScalar(angle);
//     }

//     lastVec.current = currVec;
//   };

//   const onPointerUp = () => {
//     dragging.current = false;
//   };

//   return (
//     <group
//       ref={groupRef}
//       scale={scale}
//       onPointerDown={onPointerDown}
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//       onPointerLeave={onPointerUp}
//     >
//       {children}
//     </group>
//   );
// }

// function DraggableEarth({ children, scale = 1.15 }) {
//   const groupRef = useRef();
//   const { size } = useThree();

//   const AUTO_ROTATE_SPEED = 0.0006; // subtle, premium feel
//   const IDLE_DELAY = 0.2;          // seconds before auto-spin resumes


//   const DRAG_SPEED = 2.0;
//   const DAMPING = 0.97;

//   const dragging = useRef(false);
//   const lastVec = useRef(new THREE.Vector3());
//   const velocity = useRef(new THREE.Vector3());
//   const lastInteractionTime = useRef(0);


//   const projectOnSphere = (x, y) => {
//     const v = new THREE.Vector3(
//       (2 * x - size.width) / size.width,
//       (size.height - 2 * y) / size.height,
//       0
//     );

//     const len = v.lengthSq();
//     if (len <= 1) v.z = Math.sqrt(1 - len);
//     else v.normalize();

//     return v;
//   };

//   // useFrame(() => {

//   //   if (!dragging.current) {
//   //     velocity.current.multiplyScalar(DAMPING);

//   //     const angle = velocity.current.length();
//   //     if (angle > 0.00001) {
//   //       const axis = velocity.current.clone().normalize();
//   //       const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
//   //       groupRef.current.quaternion.premultiply(quat);
//   //     }
//   //   }
//   // });

//   useFrame((_, delta) => {
//   const now = performance.now();

//   if (!dragging.current) {
//     // inertia
//     velocity.current.multiplyScalar(DAMPING);

//     const angle = velocity.current.length();
//     if (angle > 0.00001) {
//       const axis = velocity.current.clone().normalize();
//       const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
//       groupRef.current.quaternion.premultiply(quat);
//     }

//     // auto-rotate after idle
//     if (
//       angle < 0.00005 &&
//       now - lastInteractionTime.current > IDLE_DELAY * 1000
//     ) {
//       // groupRef.current.rotation.y += AUTO_ROTATE_SPEED;
//       const autoQuat = new THREE.Quaternion().setFromAxisAngle(
//         new THREE.Vector3(0, 1, 0), // Y axis
//         AUTO_ROTATE_SPEED
//       );
//       groupRef.current.quaternion.premultiply(autoQuat);
//     }
//   }
// });



//   const onPointerDown = (e) => {
//     e.stopPropagation();
//     dragging.current = true;
//     velocity.current.set(0, 0, 0);
//     lastInteractionTime.current = performance.now();
//     lastVec.current = projectOnSphere(e.clientX, e.clientY);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging.current) return;

//     const currVec = projectOnSphere(e.clientX, e.clientY);
//     const axis = new THREE.Vector3().crossVectors(lastVec.current, currVec);

//     const angle =
//       Math.acos(Math.min(1, lastVec.current.dot(currVec))) * DRAG_SPEED;

//     if (axis.lengthSq() > 0 && !isNaN(angle)) {
//       axis.normalize();
//       const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
//       groupRef.current.quaternion.premultiply(quat);
//       velocity.current.copy(axis).multiplyScalar(angle);
//     }

//     lastVec.current = currVec;
//   };

//   const onPointerUp = () => {
//     dragging.current = false;
//     lastInteractionTime.current = performance.now();
//   };

//   return (
//     <group ref={groupRef} scale={scale}>
//       {/* 🔥 Invisible interaction sphere */}
//       <mesh
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={onPointerUp}
//         onPointerLeave={onPointerUp}
//       >
//         <sphereGeometry args={[2.8, 32, 32]} />
//         {/* <meshBasicMaterial transparent opacity={0} /> */}
//         <meshBasicMaterial
//     transparent
//     opacity={0}
//     depthWrite={false}   // 🔥 IMPORTANT
//   />
//       </mesh>

//       {/* Visible content */}
//       {children}
//     </group>
//   );
// }


function TorontoSpot() {
  const radius = 2.6; // slightly above Earth dots

  const lat = THREE.MathUtils.degToRad(43.6532);   // Toronto latitude
  const lon = THREE.MathUtils.degToRad(-79.3832);  // Toronto longitude (WEST = negative)

  const position = [
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.sin(lon),
  ];

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color="#1ea7ff" toneMapped={false} />
    </mesh>
  );
}

function LatLongLines() {
  const groupRef = useRef();

  const radius = 2.6;
  const latStep = 15; // degrees between latitude lines
  const lonStep = 15; // degrees between longitude lines

  const lines = useMemo(() => {
    const elements = [];

    // -------- LATITUDE LINES --------
    for (let lat = -90 + latStep; lat < 90; lat += latStep) {
      const points = [];
      const latRad = THREE.MathUtils.degToRad(lat);
      const y = radius * Math.sin(latRad);
      const r = radius * Math.cos(latRad);

      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            r * Math.cos(theta),
            y,
            r * Math.sin(theta)
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      elements.push(
        <line key={`lat-${lat}`} geometry={geometry}>
          <lineBasicMaterial color="#ffffff" opacity={0.15} transparent />
        </line>
      );
    }

    // -------- LONGITUDE LINES --------
    for (let lon = 0; lon < 360; lon += lonStep) {
      const points = [];
      const lonRad = THREE.MathUtils.degToRad(lon);

      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI - Math.PI / 2;
        points.push(
          new THREE.Vector3(
            radius * Math.cos(phi) * Math.cos(lonRad),
            radius * Math.sin(phi),
            radius * Math.cos(phi) * Math.sin(lonRad)
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      elements.push(
        <line key={`lon-${lon}`} geometry={geometry}>
          <lineBasicMaterial color="#ffffff" opacity={0.15} transparent />
        </line>
      );
    }

    return elements;
  }, []);

  return <group ref={groupRef}>{lines}</group>;
}


function DraggableEarth({ children, scale = 1.15 }) {
  const groupRef = useRef();
  const { size } = useThree();

  const DRAG_SPEED = 0.2;
  const DAMPING = 0.97;
  const AUTO_ROTATE_SPEED = 0.0007;
  const IDLE_DELAY = 1.2; // seconds

  const dragging = useRef(false);
  const lastVec = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const lastInteractionTime = useRef(0);

  const projectOnSphere = (x, y) => {
    const v = new THREE.Vector3(
      (2 * x - size.width) / size.width,
      (size.height - 2 * y) / size.height,
      0
    );

    const len = v.lengthSq();
    if (len <= 1) v.z = Math.sqrt(1 - len);
    else v.normalize();

    return v;
  };

  useFrame(() => {
    if (!groupRef.current) return;

    const now = performance.now();

    if (!dragging.current) {
      // inertia
      velocity.current.multiplyScalar(DAMPING);

      const angle = velocity.current.length();
      if (angle > 0.00001) {
        const axis = velocity.current.clone().normalize();
        const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        groupRef.current.quaternion.premultiply(quat);
      }

      // 🌍 auto-spin around LOCAL up axis (this is the key)
      if (
        angle < 0.00005 &&
        now - lastInteractionTime.current > IDLE_DELAY * 1000
      ) {
        const localUp = new THREE.Vector3(0, 1, 0)
          .applyQuaternion(groupRef.current.quaternion)
          .normalize();

        const autoQuat = new THREE.Quaternion().setFromAxisAngle(
          localUp,
          AUTO_ROTATE_SPEED
        );

        groupRef.current.quaternion.premultiply(autoQuat);
      }
    }
  });

  const onPointerDown = (e) => {
    e.stopPropagation();
    dragging.current = true;
    velocity.current.set(0, 0, 0);
    lastInteractionTime.current = performance.now();
    lastVec.current = projectOnSphere(e.clientX, e.clientY);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const currVec = projectOnSphere(e.clientX, e.clientY);
    const axis = new THREE.Vector3().crossVectors(lastVec.current, currVec);

    const angle =
      Math.acos(Math.min(1, lastVec.current.dot(currVec))) * DRAG_SPEED;

    if (axis.lengthSq() > 0 && !isNaN(angle)) {
      axis.normalize();
      const quat = new THREE.Quaternion().setFromAxisAngle(axis, angle);
      groupRef.current.quaternion.premultiply(quat);
      velocity.current.copy(axis).multiplyScalar(angle);
    }

    lastVec.current = currVec;
  };

  const onPointerUp = () => {
    dragging.current = false;
    lastInteractionTime.current = performance.now();
  };

  return (
    <group ref={groupRef} scale={scale}>
      {/* Invisible interaction sphere */}
      <mesh
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {children}
    </group>
  );
}




// function EarthDots() {
//   const pointsRef = useRef();

//   const geometry = useMemo(() => {
//     const g = new THREE.BufferGeometry();
//     const points = [];

//     const radius = 2.6;
//     const img = new Image();
//     img.src = "/textures/earth_mask.png";

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     img.onload = () => {
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);

//       const data = ctx.getImageData(0, 0, img.width, img.height).data;

//       const latSegments = 180;
//       const lonSegments = 360;

//       for (let lat = 0; lat < latSegments; lat++) {
//         const theta = (lat / latSegments) * Math.PI;

//         for (let lon = 0; lon < lonSegments; lon++) {
//           const phi = (lon / lonSegments) * Math.PI * 2;

//           // Map lat/lon to image coords
//           const xImg = Math.floor((1 - lon / lonSegments) * img.width);
//           const yImg = Math.floor((lat / latSegments) * img.height);

//           const idx = (yImg * img.width + xImg) * 4;
//           const brightness = data[idx]; // red channel

//           // Only land (white areas)
//           if (brightness > 100) {
//             const x = radius * Math.sin(theta) * Math.cos(phi);
//             const y = radius * Math.cos(theta);
//             const z = radius * Math.sin(theta) * Math.sin(phi);
//             points.push(x, y, z);
//           }
//         }
//       }

//       g.setAttribute(
//         "position",
//         new THREE.Float32BufferAttribute(points, 3)
//       );
//     };

//     return g;
//   }, []);

//   // useFrame((_, delta) => {
//   //   if (pointsRef.current) {
//   //     pointsRef.current.rotation.y += delta * 0.06;
//   //   }
//   // });

//   return (
//     <points ref={pointsRef} geometry={geometry}>
//       <pointsMaterial
//         size={0.025}
//         color="#ffffff"
//         transparent
//         opacity={0.9}
//       />
//     </points>
//   );
// }

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

          const xImg = Math.floor((1 - lon / lonSegments) * img.width);
          const yImg = Math.floor((lat / latSegments) * img.height);

          const idx = (yImg * img.width + xImg) * 4;
          if (data[idx] > 100) {
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.cos(theta);
            const z = radius * Math.sin(theta) * Math.sin(phi);
            points.push(x, y, z);
          }
        }
      }

      g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    };

    return g;
  }, []);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.025} color="#ffffff" opacity={0.9} transparent />
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

function TestInteract() {
  return (
    <mesh
      onPointerDown={() => console.log("DOWN")}
      onPointerMove={() => console.log("MOVE")}
    >
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial wireframe color="white" />
    </mesh>
  );
}


/* ------------------ MAIN ------------------ */
export default function DottedEarth() {
  return (
    <div className="earth-layer">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}
      eventSource={document.body}
      eventPrefix="client"
  >
    {/* <TestInteract /> */}
        <ambientLight intensity={0.6} />
        <DraggableEarth scale={1.15}>
          <EarthDots />
          <LatLongLines />
          <TorontoSpot />
        </DraggableEarth>
        {/* <EarthWireframe /> */}
        {/* <LatLongLines /> */}
      </Canvas>
    </div>
  );
}
