"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Quality = "high" | "low";

const HALO_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HALO_FRAGMENT = `
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * vec2(1.0, 1.0);
    float r = length(p);
    float mist = exp(-r * r * 22.0) * 0.26;
    float corona = exp(-pow((r - 0.29) * 15.0, 2.0)) * 0.16;
    float outer = exp(-pow((r - 0.43) * 21.0, 2.0)) * 0.065;
    float rays = pow(max(0.0, cos(atan(p.y, p.x) * 12.0)), 34.0) * exp(-r * 4.5) * 0.1;
    float strength = mist + corona + outer + rays;
    gl_FragColor = vec4(0.07, 0.85, 0.67, strength);
  }
`;

function AtmosphericHalo() {
  return (
    <mesh position={[0, 0.45, -10]} renderOrder={-2}>
      <planeGeometry args={[16, 13]} />
      <shaderMaterial
        vertexShader={HALO_VERTEX}
        fragmentShader={HALO_FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

type SpireProps = {
  position: [number, number, number];
  height: number;
  width: number;
  angle: number;
  index: number;
  motion: boolean;
};

function GlassSpire({ position, height, width, angle, index, motion }: SpireProps) {
  const depth = width * 0.75;
  const center = height / 2;
  const color = index % 3 === 0 ? "#24edbd" : "#10bcaa";
  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(width + 0.025, height + 0.025, depth + 0.025);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [width, height, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const tower = (
    <group position={position} rotation={[0, angle, 0]}>
      {/* A tinted, reflective body instead of an almost invisible refractive volume. */}
      <mesh position={[0, center, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshPhysicalMaterial
          color="#137b69"
          metalness={0.42}
          roughness={0.13}
          clearcoat={1}
          clearcoatRoughness={0.07}
          transparent
          opacity={0.64}
          depthWrite={false}
          side={THREE.DoubleSide}
          emissive="#05695a"
          emissiveIntensity={0.32}
        />
      </mesh>
      {/* Dark internal faces create contrast and visible glass-like depth. */}
      <mesh position={[0, center, -depth * 0.18]}>
        <boxGeometry args={[width * 0.82, height * 0.96, depth * 0.22]} />
        <meshStandardMaterial color="#062b2e" metalness={0.66} roughness={0.21} transparent opacity={0.66} depthWrite={false} />
      </mesh>
      <lineSegments position={[0, center, 0]}>
        <primitive object={geometry} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.73} depthWrite={false} />
      </lineSegments>
      <mesh position={[-width * 0.35, center, depth * 0.51]}>
        <boxGeometry args={[0.018, height * 0.9, 0.016]} />
        <meshBasicMaterial color="#79ffe1" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, height + 0.04, 0]}>
        <boxGeometry args={[width * 1.02, 0.055, depth * 1.03]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[width * 1.14, 0.16, depth * 1.15]} />
        <meshStandardMaterial color="#0b2829" emissive="#007e6c" emissiveIntensity={0.35} metalness={0.8} roughness={0.23} />
      </mesh>
    </group>
  );

  return motion ? (
    <Float speed={0.42 + (index % 3) * 0.1} rotationIntensity={0.012} floatIntensity={0.065}>
      {tower}
    </Float>
  ) : tower;
}

function CrystalShard({ position, scale, rotation, motion }: {
  position: [number, number, number];
  scale: number;
  rotation: number;
  motion: boolean;
}) {
  const element = (
    <group position={position} rotation={[0.2, rotation, 0.27]} scale={scale}>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#19aa98" metalness={0.38} roughness={0.11} clearcoat={1} transparent opacity={0.78} depthWrite={false} emissive="#026b60" emissiveIntensity={0.25} />
      </mesh>
      <mesh scale={1.01}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#a4fff0" wireframe transparent opacity={0.58} depthWrite={false} />
      </mesh>
    </group>
  );
  return motion ? <Float speed={0.7} floatIntensity={0.22} rotationIntensity={0.1}>{element}</Float> : element;
}

function Architecture({ quality, motion }: { quality: Quality; motion: boolean }) {
  const towers = useMemo(() => {
    const output: SpireProps[] = [];
    const count = quality === "high" ? 6 : 4;
    for (const side of [-1, 1]) {
      for (let i = 0; i < count; i++) {
        output.push({
          position: [side * (3.3 + (i % 3) * 1.05), -2.95, -1.0 - i * 1.7],
          height: 2.5 + ((i * 3 + (side + 1) * 2) % 5) * 0.83,
          width: 0.78 + (i % 2) * 0.48,
          angle: side * (0.12 + (i % 3) * 0.14),
          index: i + (side === 1 ? count : 0),
          motion,
        });
      }
    }
    return output;
  }, [quality, motion]);

  return (
    <group>
      {towers.map((tower) => <GlassSpire key={tower.index} {...tower} />)}
      {quality === "high" && (
        <>
          <CrystalShard position={[-2.9, 1.65, -3]} scale={0.38} rotation={0.4} motion={motion} />
          <CrystalShard position={[3.2, 2.1, -4.7]} scale={0.3} rotation={1.2} motion={motion} />
          <CrystalShard position={[-4.8, 0.85, -2]} scale={0.22} rotation={1.8} motion={motion} />
          <CrystalShard position={[4.9, 0.2, -4.2]} scale={0.25} rotation={0.8} motion={motion} />
        </>
      )}
      <gridHelper args={[44, 32, "#07524b", "#042421"]} position={[0, -3.01, -3]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.08, -5]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#020c0e" metalness={0.64} roughness={0.25} />
      </mesh>
    </group>
  );
}

function EnergyCore({ quality, motion }: { quality: Quality; motion: boolean }) {
  const core = useRef<THREE.Group>(null);
  const gyroscopeA = useRef<THREE.Group>(null);
  const gyroscopeB = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!motion) return;
    if (core.current) core.current.rotation.y += delta * 0.045;
    if (gyroscopeA.current) gyroscopeA.current.rotation.z += delta * 0.09;
    if (gyroscopeB.current) gyroscopeB.current.rotation.x -= delta * 0.12;
    if (core.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.35) * 0.012;
      core.current.scale.setScalar(pulse);
    }
  });
  return (
    <group position={[0, 0.15, -4.1]}>
      {/* The large circles frame the hero rather than sitting directly behind every letter. */}
      <group ref={core}>
        {[3.38, 3.07, 2.73].map((radius, i) => (
          <group key={radius} rotation={[0.16 + i * 0.1, i * 0.16, i * 0.11]}>
            <mesh>
              <torusGeometry args={[radius, i === 1 ? 0.045 : 0.029, 10, quality === "high" ? 128 : 64]} />
              <meshBasicMaterial color={i === 0 ? "#077e73" : i === 1 ? "#3affce" : "#09a69f"} toneMapped={false} transparent opacity={i === 1 ? 0.86 : 0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh scale={1.015}>
              <torusGeometry args={[radius, 0.13, 8, quality === "high" ? 96 : 48]} />
              <meshBasicMaterial color="#16c6aa" transparent opacity={0.09} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        ))}
        <group ref={gyroscopeA} rotation={[0.4, 0.3, -0.15]}>
          <mesh>
            <torusGeometry args={[1.58, 0.047, 10, 88]} />
            <meshBasicMaterial color="#6affdf" toneMapped={false} transparent opacity={0.86} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
        <group ref={gyroscopeB} rotation={[1.04, 0, 0.4]}>
          <mesh>
            <torusGeometry args={[1.12, 0.037, 10, 80]} />
            <meshBasicMaterial color="#8bfcea" toneMapped={false} transparent opacity={0.73} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
        <Float speed={motion ? 1.05 : 0} rotationIntensity={motion ? 0.12 : 0} floatIntensity={motion ? 0.13 : 0}>
          <mesh rotation={[0.16, 0.22, 0.12]}>
            <icosahedronGeometry args={[0.81, 1]} />
            <meshPhysicalMaterial color="#10c09d" metalness={0.67} roughness={0.12} clearcoat={1} transparent opacity={0.88} emissive="#007964" emissiveIntensity={0.64} />
          </mesh>
          <mesh rotation={[0.16, 0.22, 0.12]} scale={1.025}>
            <icosahedronGeometry args={[0.81, 1]} />
            <meshBasicMaterial color="#8cffe5" wireframe transparent opacity={0.56} depthWrite={false} />
          </mesh>
        </Float>
      </group>
      <mesh position={[0, -0.95, -0.2]}>
        <cylinderGeometry args={[0.12, 0.3, 4.6, 20, 1, true]} />
        <meshBasicMaterial color="#2fffd4" transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.7, -0.1]}>
        <cylinderGeometry args={[2.35, 2.6, 0.25, 64]} />
        <meshStandardMaterial color="#091e21" metalness={0.72} roughness={0.23} />
      </mesh>
      {[1.4, 1.85, 2.28].map((radius, i) => (
        <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.51 + i * 0.018, -0.1]}>
          <torusGeometry args={[radius, i === 1 ? 0.06 : 0.032, 8, 88]} />
          <meshBasicMaterial color={i === 1 ? "#55ffdb" : "#0bb399"} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      ))}
      <pointLight color="#2cfbd4" intensity={quality === "high" ? 24 : 12} distance={12} decay={2} position={[0, -0.3, 1.5]} />
      <pointLight color="#009c8d" intensity={11} distance={10} decay={2} position={[0, -2.3, 0]} />
    </group>
  );
}

function CameraRig() {
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      target.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);
  useFrame(({ camera }, delta) => {
    const idealX = target.current.x * 0.38;
    const idealY = 1.12 - target.current.y * 0.16;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, idealX, 1.25, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, idealY, 1.25, delta);
    camera.lookAt(0, -0.25, -4.1);
  });
  return null;
}

function WorldScene({ quality, motion }: { quality: Quality; motion: boolean }) {
  return (
    <>
      <color attach="background" args={["#01070a"]} />
      <fog attach="fog" args={["#01090a", 13, 39]} />
      <ambientLight intensity={0.55} color="#8be8d6" />
      <hemisphereLight args={["#a3fff1", "#001516", 1.25]} />
      <directionalLight position={[5, 8, 5]} intensity={2.3} color="#9affde" />
      <pointLight position={[-5, 3, 0]} intensity={26} color="#00ab93" distance={22} decay={2} />
      <pointLight position={[6, 1, -4]} intensity={20} color="#00b4bf" distance={20} decay={2} />
      <AtmosphericHalo />
      <Stars radius={72} depth={31} count={quality === "high" ? 1000 : 300} factor={1.7} saturation={0.4} fade speed={motion ? 0.15 : 0} />
      <Architecture quality={quality} motion={motion} />
      <EnergyCore quality={quality} motion={motion} />
      <Sparkles count={quality === "high" ? 140 : 40} scale={[16, 8, 14]} size={1.45} speed={motion ? 0.18 : 0} color="#62ffe3" opacity={0.64} />
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
        camera={{ position: [0, 1.12, 11.6], fov: 48, near: 0.1, far: 90 }}
        gl={{ antialias: quality === "high", alpha: false, powerPreference: "high-performance" }}
        frameloop={motion ? "always" : "demand"}
        style={{ pointerEvents: "none" }}
        fallback={<div className="absolute inset-0 bg-gradient-to-b from-[#032924] via-[#020a0a] to-black" />}
      >
        <Suspense fallback={null}>
          <WorldScene quality={quality} motion={motion} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_17%,rgba(0,0,0,0.24)_69%,rgba(0,0,0,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#01070a]/55" />
    </div>
  );
}
