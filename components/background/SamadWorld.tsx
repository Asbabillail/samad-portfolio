"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Quality = "high" | "low";

function GlassSpire({ position, height, rotation = 0, quality }: { position: [number, number, number]; height: number; rotation?: number; quality: Quality }) {
  return (
    <Float speed={0.6} rotationIntensity={0.06} floatIntensity={0.18}>
      <group position={position} rotation={[0, rotation, 0]}>
        <mesh position={[0, height / 2 - 1.7, 0]}>
          <boxGeometry args={[0.68, height, 0.68]} />
          <meshPhysicalMaterial color="#0a6658" metalness={0.18} roughness={0.1} transmission={quality === "high" ? 0.82 : 0.3} thickness={1.1} transparent opacity={0.82} depthWrite={false} />
        </mesh>
        <mesh position={[0, height / 2 - 1.7, 0]}>
          <boxGeometry args={[0.72, height + 0.03, 0.72]} />
          <meshBasicMaterial color="#21ffca" wireframe transparent opacity={0.17} />
        </mesh>
        <mesh position={[0, height - 1.7, 0]}>
          <boxGeometry args={[0.78, 0.035, 0.78]} />
          <meshBasicMaterial color="#49ffdb" toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function EnergyCore({ quality }: { quality: Quality }) {
  const core = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.075;
    if (outer.current) outer.current.rotation.z += delta * 0.14;
    if (inner.current) inner.current.rotation.x -= delta * 0.18;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.045;
    if (inner.current) inner.current.scale.setScalar(pulse);
  });
  return (
    <group ref={core} position={[0, 0.15, -2.5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]}>
        <cylinderGeometry args={[2.8, 3.1, 0.22, 64]} />
        <meshStandardMaterial color="#061a1b" metalness={0.8} roughness={0.24} />
      </mesh>
      {[1.7, 2.15, 2.65].map((radius, index) => (
        <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.08 + index * 0.035, 0]}>
          <torusGeometry args={[radius, index === 1 ? 0.048 : 0.027, 8, quality === "high" ? 96 : 48]} />
          <meshBasicMaterial color={index === 1 ? "#5affdc" : "#00bfa5"} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={outer} rotation={[0.4, 0, 0.2]}>
        <torusGeometry args={[1.62, 0.046, 10, 96]} />
        <meshBasicMaterial color="#27edc2" toneMapped={false} />
      </mesh>
      <mesh ref={inner} rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[1.18, 0.038, 10, 96]} />
        <meshBasicMaterial color="#91ffe7" toneMapped={false} />
      </mesh>
      <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.22}>
        <mesh>
          <icosahedronGeometry args={[0.78, 1]} />
          <meshPhysicalMaterial color="#2fffd3" metalness={0.32} roughness={0.12} transmission={quality === "high" ? 0.6 : 0.15} thickness={1.5} emissive="#087c6b" emissiveIntensity={0.55} />
        </mesh>
        <mesh scale={1.02}>
          <icosahedronGeometry args={[0.78, 1]} />
          <meshBasicMaterial color="#b2fff1" wireframe transparent opacity={0.36} />
        </mesh>
      </Float>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.12, 4.8, 12, 1, true]} />
        <meshBasicMaterial color="#1fffd0" transparent opacity={0.3} depthWrite={false} toneMapped={false} />
      </mesh>
      <pointLight color="#19ffbd" intensity={quality === "high" ? 28 : 14} distance={11} decay={2} />
    </group>
  );
}

function Architecture({ quality }: { quality: Quality }) {
  const structures = useMemo(() => {
    const result: { position: [number, number, number]; height: number; rotation: number }[] = [];
    for (let side of [-1, 1]) {
      for (let i = 0; i < (quality === "high" ? 7 : 4); i++) {
        result.push({
          position: [side * (3.6 + (i % 3) * 0.92), -1.15, -1.5 - i * 1.9],
          height: 2.8 + ((i * 7) % 5) * 0.72,
          rotation: (i % 3) * 0.28,
        });
      }
    }
    return result;
  }, [quality]);
  return (
    <group>
      {structures.map((item, i) => <GlassSpire key={i} {...item} quality={quality} />)}
      <gridHelper args={[42, 28, "#087f72", "#063b39"]} position={[0, -2.34, -3]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.38, -5]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#020809" metalness={0.35} roughness={0.4} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    const targetX = pointer.x * 0.5;
    const targetY = 1.15 + pointer.y * 0.23;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 1.1, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 1.1, delta);
    camera.lookAt(0, 0, -2.5);
  });
  return null;
}

function WorldScene({ quality, motion }: { quality: Quality; motion: boolean }) {
  return (
    <>
      <color attach="background" args={["#020708"]} />
      <fog attach="fog" args={["#020708", 12, 35]} />
      <ambientLight intensity={0.38} color="#91fff0" />
      <directionalLight position={[5, 8, 4]} intensity={2.1} color="#a8ffeb" />
      <pointLight position={[-7, 3, 1]} intensity={18} color="#007d77" distance={20} />
      <Stars radius={65} depth={32} count={quality === "high" ? 850 : 260} factor={2} saturation={0.5} fade speed={motion ? 0.3 : 0} />
      <Architecture quality={quality} />
      <EnergyCore quality={quality} />
      <Sparkles count={quality === "high" ? 115 : 35} scale={[13, 7, 15]} size={1.6} speed={motion ? 0.22 : 0} color="#55ffdd" opacity={0.48} />
      {motion && <CameraRig />}
    </>
  );
}

export default function SamadWorld({ preview = false }: { preview?: boolean }) {
  const [quality, setQuality] = useState<Quality>("low");
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setMotion(!reduced.matches);
      setQuality(mobile.matches || reduced.matches ? "low" : "high");
    };
    update();
    reduced.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, []);
  return (
    <div aria-hidden="true" className={preview ? "absolute inset-0 overflow-hidden" : "fixed inset-0 z-0 pointer-events-none overflow-hidden"}>
      <Canvas
        dpr={quality === "high" ? [1, 1.5] : 1}
        camera={{ position: [0, 1.15, 11.5], fov: 48, near: 0.1, far: 90 }}
        gl={{ antialias: quality === "high", alpha: false, powerPreference: "high-performance" }}
        frameloop={motion ? "always" : "demand"}
        style={{ pointerEvents: "none" }}
        fallback={<div className="absolute inset-0 bg-gradient-to-b from-[#021b19] via-[#020809] to-black" />}
      >
        <Suspense fallback={null}>
          <WorldScene quality={quality} motion={motion} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.82)_100%)]" />
    </div>
  );
}
