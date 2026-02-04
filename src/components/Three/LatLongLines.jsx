import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function LatLongLines({
  radius = 2.62,
  latCount = 12,
  lonCount = 12,
}) {
  const groupRef = useRef();

  const lines = useMemo(() => {
    const group = new THREE.Group();

    const material = new THREE.LineBasicMaterial({
      color: "#ffffff",
      opacity: 0.15,
      transparent: true,
    });

    /* -------- LATITUDE (PARALLELS) -------- */
    for (let i = 1; i < latCount; i++) {
      const theta = (i / latCount) * Math.PI - Math.PI / 2;
      const y = radius * Math.sin(theta);
      const r = radius * Math.cos(theta);

      const points = [];
      const segments = 128;

      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            r * Math.cos(phi),
            y,
            r * Math.sin(phi)
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(geometry, material));
    }

    /* -------- LONGITUDE (MERIDIANS) -------- */
    for (let i = 0; i < lonCount; i++) {
      const phi = (i / lonCount) * Math.PI * 2;
      const points = [];
      const segments = 128;

      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI - Math.PI / 2;

        points.push(
          new THREE.Vector3(
            radius * Math.cos(theta) * Math.cos(phi),
            radius * Math.sin(theta),
            radius * Math.cos(theta) * Math.sin(phi)
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(geometry, material));
    }

    return group;
  }, [radius, latCount, lonCount]);

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.06;
  });

  return <primitive ref={groupRef} object={lines} />;
}
