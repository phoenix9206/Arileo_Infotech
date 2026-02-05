import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";


/* ------------------ DOTS ------------------ */


const TORONTO_LAT = 43.6532;
const TORONTO_LON = -79.3832;
const MASS = 0.08;     // lower = heavier
const MAX_VELOCITY = 0.05; // safety clamp



function TorontoSpot() {
  const radius = 2.65;

  const lat = 43.6532;     // degrees
  const lon = -79.3832;   // degrees (west = negative)

  const [x, y, z] = latLonToVec3(lat, lon, radius + 0.01);

  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.02, 16, 16]} />
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



function EarthBorders() {
  const geometryRef = useRef();

  useEffect(() => {
    fetch("/data/coastlines.geojson")
      .then((res) => res.json())
      .then((data) => {
        const positions = [];
        const radius = 2.65;

        data.features.forEach((feature) => {
          const { type, coordinates } = feature.geometry;

          const lines =
            type === "LineString"
              ? [coordinates]
              : coordinates; // MultiLineString

          lines.forEach((line) => {
            for (let i = 0; i < line.length - 1; i++) {
              const [lon1, lat1] = line[i];
              const [lon2, lat2] = line[i + 1];

              const p1 = latLonToVec3(lat1, lon1, radius);
              const p2 = latLonToVec3(lat2, lon2, radius);

              positions.push(...p1, ...p2);
            }
          });
        });

        geometryRef.current.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );

        geometryRef.current.attributes.position.needsUpdate = true;
      });
  }, []);

  return (
    <lineSegments>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial
        color="#ffffff"
        opacity={0.8}
        transparent
      />
    </lineSegments>
  );
}


function latLonToVec3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}



function DraggableEarth({ children, scale = 1.15 }) {
  const groupRef = useRef();

  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // rotation state
  const spin = useRef(0);
  const tilt = useRef(0);

  // angular velocity (THIS is the missing piece)
  const velocitySpin = useRef(0);
  const velocityTilt = useRef(0);

  const initialized = useRef(false);

  // tuning (these values matter)
  const MAX_TILT = Math.PI / 2;
  const DRAG_SPEED = 0.0025;      // mouse sensitivity
  const FRICTION = 0.92;          // lower = longer inertia
  const AUTO_SPIN_SPEED = 0.0035; // idle rotation
  // const IDLE_DELAY = 0.1;         // ms before auto-spin

  // const lastInteraction = useRef(performance.now());

  // 🌍 initial orientation (Toronto in front)
  useEffect(() => {
    if (!initialized.current && groupRef.current) {
      spin.current = -THREE.MathUtils.degToRad(TORONTO_LON + 90);
      tilt.current = 0;

      velocitySpin.current = 0;
      velocityTilt.current = 0;

      groupRef.current.rotation.set(0, spin.current, 0);
      initialized.current = true;
    }
  }, []);

  const onPointerDown = (e) => {
    e.stopPropagation();
    dragging.current = true;

    last.current = { x: e.clientX, y: e.clientY };

    // stop inertia when grabbing
    velocitySpin.current = 0;
    velocityTilt.current = 0;

    lastInteraction.current = performance.now();
  };


  
const onPointerMove = (e) => {
  if (!dragging.current) return;

  const dx = e.clientX - last.current.x;
  const dy = e.clientY - last.current.y;

  const targetSpinVel = dx * DRAG_SPEED;
  const targetTiltVel = dy * DRAG_SPEED;

  // heavy feel (velocity easing)
  velocitySpin.current +=
    (targetSpinVel - velocitySpin.current) * MASS;

  velocityTilt.current +=
    (targetTiltVel - velocityTilt.current) * MASS;

  // clamp safety
  velocitySpin.current = THREE.MathUtils.clamp(
    velocitySpin.current,
    -MAX_VELOCITY,
    MAX_VELOCITY
  );

  velocityTilt.current = THREE.MathUtils.clamp(
    velocityTilt.current,
    -MAX_VELOCITY,
    MAX_VELOCITY
  );

  last.current = { x: e.clientX, y: e.clientY };
};


  const onPointerUp = () => {
    dragging.current = false;
    lastInteraction.current = performance.now();
  };

  // 🌍 physics loop


useFrame((_, delta) => {
  if (!groupRef.current) return;

  // apply momentum always
  spin.current += velocitySpin.current;
  tilt.current += velocityTilt.current;

  // clamp tilt
  tilt.current = THREE.MathUtils.clamp(
    tilt.current,
    -MAX_TILT,
    MAX_TILT
  );

  if (!dragging.current) {
    const damping = Math.pow(FRICTION, delta * 60);
    velocitySpin.current *= damping;
    velocityTilt.current *= damping;



    const AUTO_TARGET = AUTO_SPIN_SPEED;

velocitySpin.current +=
  (AUTO_TARGET - velocitySpin.current) * 0.03;

  }

  groupRef.current.rotation.set(
    tilt.current,
    spin.current,
    0
  );
});


  return (
    <group ref={groupRef} scale={scale}>
      {/* invisible interaction sphere */}
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



function pointInPolygon(point, vs) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}



function LandDotsFromGeoJSON() {
  const geometryRef = useRef();

  useEffect(() => {
    fetch("/data/land.geojson")
      .then((res) => res.json())
      .then((data) => {
        const positions = [];
        const radius = 2.65;

        const STEP = 1.2; // degrees between dots (lower = denser)

        data.features.forEach((feature) => {
          const { type, coordinates } = feature.geometry;

          const polygons =
            type === "Polygon"
              ? [coordinates]
              : coordinates; // MultiPolygon

          polygons.forEach((polygon) => {
            const ring = polygon[0]; // outer boundary

            // bounding box
            let minLat = 90,
              maxLat = -90,
              minLon = 180,
              maxLon = -180;

            ring.forEach(([lon, lat]) => {
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
              minLon = Math.min(minLon, lon);
              maxLon = Math.max(maxLon, lon);
            });

            // for (let lat = minLat; lat <= maxLat; lat += STEP) {
            //   for (let lon = minLon; lon <= maxLon; lon += STEP) {
            for (let lat = minLat; lat <= maxLat; lat += STEP) {
              const lonStep = STEP / Math.cos(THREE.MathUtils.degToRad(lat));

              for (let lon = minLon; lon <= maxLon; lon += lonStep) {

                if (pointInPolygon([lon, lat], ring)) {
                  const [x, y, z] = latLonToVec3(lat, lon, radius);
                  positions.push(x, y, z);
                }
              }
            }
          });
        });

        geometryRef.current.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        geometryRef.current.attributes.position.needsUpdate = true;
      });
  }, []);

  return (
    <points>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        opacity={0.9}
        transparent
      />
    </points>
  );
}



/* ------------------ MAIN ------------------ */
export default function DottedEarth() {
  return (
    <div className="earth-layer">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}
      eventSource={document.body}
      eventPrefix="client">
        <ambientLight intensity={0.6} />

        <DraggableEarth scale={0.9}> // Make the earth bigger or smaller in size
          <LandDotsFromGeoJSON />
          <EarthBorders />
          <LatLongLines />
          <TorontoSpot />
        </DraggableEarth>

      </Canvas>
    </div>
  );
}
