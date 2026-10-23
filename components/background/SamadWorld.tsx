"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

/**
 * SAMAD-OS: The Glass Passage
 *
 * The HTML portfolio is the foreground. This canvas is a non-interactive
 * world behind it. Scrolling the page advances a real perspective camera
 * through successive glass portals rather than moving a flat illustration.
 *
 * Keep the center of the opening clear for the hero's text and controls.
 */

type Quality = "high" | "low";
type Journey = { progress: RefObject<number>; motion: boolean; quality: Quality };

const PORTAL_DEPTHS = [-15, -28, -42, -56, -72, -90, -108, -126];
const STAGE_COLORS = [
  new THREE.Color("#13e7bb"),
  new THREE.Color("#0ebdc6"),
  new THREE.Color("#53b9ff"),
  new THREE.Color("#9b92ff"),
  new THREE.Color("#12dfb1"),
  new THREE.Color("#68f6d9"),
];

function useJourneyProgress() {
  const progress = useRef(0);
  const [motion, setMotion] = useState(false);
  const [quality, setQuality] = useState<Quality>("low");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");

    const updatePreferences = () => {
      setMotion(!reduced.matches);
      setQuality(mobile.matches || reduced.matches ? "low" : "high");
    };
    const updateScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      progress.current = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    };

    updatePreferences();
    updateScroll();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    reduced.addEventListener("change", updatePreferences);
    mobile.addEventListener("change", updatePreferences);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      reduced.removeEventListener("change", updatePreferences);
      mobile.removeEventListener("change", updatePreferences);
    };
  }, []);

  return { progress, motion, quality };
}

function GlassBeam({
  position,
  size,
  color,
  opacity = 0.55,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          color="#0e5261"
          metalness={0.55}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          transparent
          opacity={opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
          emissive="#064c58"
          emissiveIntensity={0.18}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

function PortalFrame({ depth, index }: { depth: number; index: number }) {
  const width = 8.2 + (index % 2) * 0.55;
  const top = 5.2;
  const bottom = -4.55;
  const height = top - bottom;
  const color = index % 3 === 2 ? "#5cbdd7" : "#20beaf";

  return (
    <group position={[0, 0, depth]}>
      {/* Portal is OPEN in the center: no beam behind the hero's lettering. */}
      <GlassBeam
        position={[-width, (top + bottom) / 2, 0]}
        size={[0.24, height, 0.45]}
        color={color}
        opacity={index === 0 ? 0.34 : 0.55}
      />
      <GlassBeam
        position={[width, (top + bottom) / 2, 0]}
        size={[0.24, height, 0.45]}
        color={color}
        opacity={index === 0 ? 0.34 : 0.55}
      />
      <GlassBeam
        position={[0, top, 0]}
        size={[width * 2 + 0.26, 0.2, 0.45]}
        color={color}
        opacity={index === 0 ? 0.32 : 0.55}
      />
      <mesh position={[0, top, 0]}>
        <boxGeometry args={[width * 2 + 0.2, 0.025, 0.48]} />
        <meshBasicMaterial
          color={index === 1 || index === 2 ? "#60ffdb" : "#189b9b"}
          transparent
          opacity={index === 1 || index === 2 ? 0.68 : 0.26}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-width, -4.43, 0]}>
        <boxGeometry args={[0.15, 0.03, 2.5]} />
        <meshBasicMaterial color="#39d8c1" transparent opacity={0.28} />
      </mesh>
      <mesh position={[width, -4.43, 0]}>
        <boxGeometry args={[0.15, 0.03, 2.5]} />
        <meshBasicMaterial color="#39d8c1" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function GlassMonolith({
  position,
  scale,
  rotation,
  motion,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  motion: boolean;
}) {
  const element = (
    <group position={position} rotation={rotation}>
      <mesh scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#1b9896"
          metalness={0.35}
          roughness={0.09}
          clearcoat={1}
          transparent
          opacity={0.46}
          depthWrite={false}
          side={THREE.DoubleSide}
          emissive="#034b55"
          emissiveIntensity={0.3}
        />
      </mesh>
      <lineSegments scale={scale}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="#58f4df" transparent opacity={0.49} depthWrite={false} />
      </lineSegments>
      <mesh scale={[scale[0] * 1.02, 0.03, scale[2] * 1.02]} position={[0, scale[1] / 2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4cebd7" transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );

  return motion ? (
    <Float speed={0.28} floatIntensity={0.06} rotationIntensity={0.012}>
      {element}
    </Float>
  ) : element;
}

function GlassBlade({
  position,
  scale,
  rotation,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#47e9db"
          metalness={0.25}
          roughness={0.09}
          clearcoat={1}
          transparent
          opacity={0.31}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="#64bfbf" transparent opacity={0.33} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function WorldArchitecture({ motion, quality }: { motion: boolean; quality: Quality }) {
  return (
    <>
      {PORTAL_DEPTHS.map((depth, index) => (
        <PortalFrame key={depth} depth={depth} index={index} />
      ))}

      {/* Foreground structures frame the opening rather than crossing its center. */}
      <GlassMonolith
        position={[-5.2, -0.45, -12]}
        scale={[0.65, 4.3, 1.1]}
        rotation={[0.06, 0.32, -0.08]}
        motion={motion}
      />
      <GlassMonolith
        position={[5.0, 0.55, -15]}
        scale={[0.62, 4.8, 1]}
        rotation={[-0.05, -0.34, 0.09]}
        motion={motion}
      />
      <GlassBlade
        position={[-4.1, 0.9, -16]}
        rotation={[0.1, 0.18, -0.3]}
        scale={[0.14, 4.2, 1.25]}
      />
      <GlassBlade
        position={[4.0, 1.4, -20]}
        rotation={[-0.07, -0.2, 0.34]}
        scale={[0.14, 4.0, 1.1]}
      />

      {/* Deeper crystal structures reveal themselves as the camera enters. */}
      {(quality === "high" ? [-35, -51, -68, -85, -104, -120] : [-35, -68, -104]).map((depth, index) => (
        <group key={depth}>
          <GlassMonolith
            position={[-5.8 - (index % 2) * 0.6, -0.3, depth]}
            scale={[0.8, 5.5 + (index % 3) * 0.75, 1.3]}
            rotation={[0.03, 0.35, -0.1]}
            motion={motion}
          />
          <GlassMonolith
            position={[5.8 + (index % 2) * 0.6, 0.1, depth - 5]}
            scale={[0.82, 5.0 + (index % 3), 1.35]}
            rotation={[0.03, -0.35, 0.08]}
            motion={motion}
          />
          <GlassBlade
            position={[-7.5, 1.2, depth - 6]}
            rotation={[0.06, 0.26, -0.16]}
            scale={[0.18, 6.5, 1.4]}
          />
          <GlassBlade
            position={[7.4, 0.8, depth - 10]}
            rotation={[-0.04, -0.3, 0.22]}
            scale={[0.17, 5.8, 1.3]}
          />
        </group>
      ))}
    </>
  );
}

function Ground() {
  const lines = useMemo(() => {
    const coordinates: number[] = [];

    for (const x of [-9.2, -6, -3.5, 3.5, 6, 9.2]) {
      coordinates.push(x, -4.55, 5, x, -4.55, -148);
    }
    for (let z = 0; z >= -145; z -= 9) {
      coordinates.push(-9.5, -4.55, z, 9.5, -4.55, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates, 3));
    return geometry;
  }, []);

  useEffect(() => () => lines.dispose(), [lines]);

  return (
    <group>
      <mesh position={[0, -4.66, -70]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 230]} />
        <meshStandardMaterial color="#020c10" roughness={0.28} metalness={0.63} />
      </mesh>
      <lineSegments>
        <primitive object={lines} attach="geometry" />
        <lineBasicMaterial color="#1bb8ba" transparent opacity={0.19} depthWrite={false} />
      </lineSegments>
      <mesh position={[0, -4.5, -66]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 140]} />
        <meshBasicMaterial color="#087f78" transparent opacity={0.016} depthWrite={false} />
      </mesh>
    </group>
  );
}

function LightRunner({ motion }: { motion: boolean }) {
  const runner = useRef<THREE.Group>(null);
  const reflection = useRef<THREE.Mesh>(null);

  useFrame(({ clock, camera }) => {
    if (!runner.current) return;
    const progress = motion ? (clock.elapsedTime * 0.08) % 1 : 0.25;

    // Always in front of the camera, never close enough to cover hero text.
    const z = camera.position.z - 42 + progress * 27;
    const x = Math.sin(clock.elapsedTime * 0.7) * 1.55;
    runner.current.position.set(x, -4.12, z);

    if (reflection.current) {
      const material = reflection.current.material as THREE.MeshBasicMaterial;
      material.opacity = motion ? 0.025 + 0.012 * Math.sin(clock.elapsedTime * 1.4) : 0.025;
    }
  });

  return (
    <group ref={runner}>
      <mesh>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshBasicMaterial color="#62ffe0" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.17, 0]}>
        <torusGeometry args={[0.5, 0.014, 8, 40]} />
        <meshBasicMaterial color="#39ebd4" transparent opacity={0.09} depthWrite={false} />
      </mesh>
      <mesh ref={reflection} position={[0, -0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.85, 32]} />
        <meshBasicMaterial color="#1ac8af" transparent opacity={0.035} depthWrite={false} />
      </mesh>
      <pointLight color="#16c8c2" intensity={1.4} distance={5} decay={2} />
    </group>
  );
}

function JourneyRig({ progress, motion }: Journey) {
  const mouse = useRef({ x: 0, y: 0 });
  const left = useRef<THREE.PointLight>(null);
  const right = useRef<THREE.PointLight>(null);
  const fog = useRef<THREE.Fog>(null);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame(({ camera }, delta) => {
    const p = motion ? progress.current : 0;
    // From the entry hall (z=7) through all eight portals to the final chamber.
    const targetZ = 7 - p * 119;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.35, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, motion ? mouse.current.x * 0.42 : 0, 1.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, motion ? 0.25 - mouse.current.y * 0.21 : 0.25, 1.5, delta);
    camera.lookAt(camera.position.x * 0.12, 0.1, camera.position.z - 20);

    // Lighting transitions as the user passes the major portfolio chapters.
    const phase = p * (STAGE_COLORS.length - 1);
    const index = Math.min(STAGE_COLORS.length - 2, Math.floor(phase));
    const blend = THREE.MathUtils.smoothstep(phase - index, 0, 1);
    if (left.current) {
      left.current.color.lerpColors(STAGE_COLORS[index], STAGE_COLORS[index + 1], blend);
      left.current.position.z = camera.position.z - 23;
    }
    if (right.current) {
      right.current.color.lerpColors(STAGE_COLORS[index + 1], STAGE_COLORS[index], blend);
      right.current.position.z = camera.position.z - 38;
    }
    if (fog.current) {
      fog.current.far = THREE.MathUtils.damp(fog.current.far, 52 + 9 * Math.sin(p * Math.PI * 2), 1.2, delta);
    }
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={["#010b10", 13, 58]} />
      <pointLight ref={left} position={[-7, 1.5, -28]} color="#13e7bb" intensity={14} distance={38} decay={2} />
      <pointLight ref={right} position={[7, 2, -65]} color="#0ebdc6" intensity={16} distance={40} decay={2} />
    </>
  );
}

function WorldScene({ progress, motion, quality }: Journey) {
  return (
    <>
      <color attach="background" args={["#01080c"]} />
      <ambientLight intensity={0.35} color="#62dacd" />
      <hemisphereLight args={["#74c8c8", "#02090c", 0.7]} />
      <directionalLight position={[4, 7, 5]} intensity={1.6} color="#8bfff1" />
      <Stars radius={105} depth={80} count={quality === "high" ? 950 : 280} factor={1.9} saturation={0.45} fade speed={motion ? 0.15 : 0} />
      <Ground />
      <WorldArchitecture motion={motion} quality={quality} />
      <Sparkles
        count={quality === "high" ? 190 : 56}
        scale={[19, 10, 154]}
        position={[0, 0, -70]}
        size={1.25}
        speed={motion ? 0.17 : 0}
        color="#8df9f3"
        opacity={0.42}
      />
      <LightRunner motion={motion} />
      <JourneyRig progress={progress} motion={motion} quality={quality} />
    </>
  );
}

export default function SamadWorld({ preview = false }: { preview?: boolean }) {
  const { progress, motion, quality } = useJourneyProgress();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <Canvas
        dpr={quality === "high" ? [1, 1.5] : 1}
        camera={{ position: [0, 0.25, 7], fov: 55, near: 0.15, far: 110 }}
        gl={{ antialias: quality === "high", alpha: false, powerPreference: "high-performance" }}
        frameloop={motion ? "always" : "demand"}
        style={{ pointerEvents: "none" }}
        fallback={<div className="absolute inset-0 bg-gradient-to-b from-[#031922] via-[#020a10] to-black" />}
      >
        <Suspense fallback={null}>
          <WorldScene progress={progress} motion={motion} quality={quality} />
        </Suspense>
      </Canvas>
      {/* Soft aperture protects the hero; edge vignette deepens the corridor. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.17)_0%,transparent_48%,rgba(0,0,0,0.78)_100%)]" />
      {!preview && <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#01080c]/15" />}
    </div>
  );
}
