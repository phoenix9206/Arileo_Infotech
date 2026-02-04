import { useRef, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SceneContent = () => {
  const sphereRef = useRef();
  const cylinderRef = useRef();
  const { camera, viewport } = useThree();

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.2;
    }
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y += delta * 0.1;
    }
  });

  useLayoutEffect(() => {
    // Initial setup
    camera.position.set(0, 0, 5);

    let ctx = gsap.context(() => {
      if (sphereRef.current) {
        sphereRef.current.position.set(0, 0, 0);
        sphereRef.current.scale.set(2, 2, 2);
      }
      if (cylinderRef.current) {
        cylinderRef.current.position.set(-viewport.width*1.5, 0, -1); // Start offscreen left
        cylinderRef.current.visible = false;
        cylinderRef.current.scale.set(0.8, 0.8, 0.8);
      }

      // Globe Animation Timeline
      const tlGlobe = gsap.timeline({
        scrollTrigger: {
          trigger: "#solution",
          start: "top bottom",
          end: "center 30%",
          scrub: 2,
          onEnter: () => {
            if (sphereRef.current) sphereRef.current.visible = true;
          },
          onEnterBack: () => {
            if (sphereRef.current) sphereRef.current.visible = true;
          },
          onLeave: () => {
            if (sphereRef.current) sphereRef.current.visible = false;
          },
        },
        defaults: { ease: "none" },
      });

      tlGlobe.to(sphereRef.current.position, {
        x: (viewport.width / 2) + 1,
        z: 3,
      });

      // Cylinder Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#services",
          start: "top bottom",
          end: () => document.querySelector("#solution").clientHeight * 4.5, // Lasts longer
          scrub: 2,
          onEnter: () => {
            if (cylinderRef.current) cylinderRef.current.visible = true;
          },
          onEnterBack: () => {
            if (cylinderRef.current) cylinderRef.current.visible = true;
          },
          onLeave: () => {
            if (cylinderRef.current) cylinderRef.current.visible = false;
          },
          onLeaveBack: () => {
            if (cylinderRef.current) cylinderRef.current.visible = false;
          },
        },
      });

      // 1. Move from Left to Center (keeping horizontal orientation)
      tl.to(cylinderRef.current.position, {
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(
        cylinderRef.current.position,
        {
          z: 6, // Move past camera
          duration: 3,
          ease: "none",
        },
        "<"
      );
    });

    return () => ctx.revert();
  }, [viewport, camera]);

  return (
    <>
      <Sphere args={[1.5, 30, 30]} ref={sphereRef} scale={2}>
        <meshStandardMaterial
          color="#0047FF"
          wireframe={true}
          roughness={0.1}
          metalness={0.2}
        />
      </Sphere>

      <Cylinder
        ref={cylinderRef}
        args={[2.5, 2.5, 20, 50, 1, true]} // RadiusTop, RadiusBot, Height(Length), RadialSegments, HeightSegments, OpenEnded
        visible={false}
      >
        <meshStandardMaterial
          color="#0047FF"
          wireframe={true}
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.5}
        />
      </Cylinder>
    </>
  );
};

const Create3DBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-1 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <SceneContent />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Create3DBackground;
