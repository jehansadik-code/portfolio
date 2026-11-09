"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { liquidPalette, visualQuality } from "@/lib/design-tokens";
import { useVisualQuality } from "@/hooks/use-visual-quality";
import fragmentShader from "@/components/scene/shaders/liquid-glass.frag.glsl";
import vertexShader from "@/components/scene/shaders/liquid-glass.vert.glsl";

function GlassSculpture() {
  const material = useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uCyan: { value: new THREE.Color(liquidPalette.cyan) }, uViolet: { value: new THREE.Color(liquidPalette.violet) }, uMagenta: { value: new THREE.Color(liquidPalette.magenta) } }, vertexShader, fragmentShader }), []);
  const sculpture = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    if (sculpture.current) { sculpture.current.rotation.y += delta * .17; sculpture.current.rotation.x = THREE.MathUtils.lerp(sculpture.current.rotation.x, pointer.y * .18, .035); }
  });
  return <Float speed={1.3} rotationIntensity={.24} floatIntensity={.45}><group ref={sculpture}><mesh material={material}><icosahedronGeometry args={[1.32, 5]} /></mesh><mesh rotation={[1.1, .3, -.45]} scale={1.48}><torusGeometry args={[.82, .034, 16, 100]} /><meshBasicMaterial color={liquidPalette.cyan} transparent opacity={.52} /></mesh><mesh rotation={[-.62, .6, .25]} scale={1.73}><torusGeometry args={[.84, .018, 12, 90]} /><meshBasicMaterial color={liquidPalette.magenta} transparent opacity={.45} /></mesh></group></Float>;
}

function Particles({ count }: { count: number }) {
  const positions = useMemo(() => Float32Array.from({ length: count * 3 }, (_, index) => { const axis = index % 3; return (Math.sin(index * 12.9898 + axis * 3.1) * 43758.5453 % 1) * 5 - 2.5; }), [count]);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={.025} color={liquidPalette.cyan} transparent opacity={.58} sizeAttenuation /></points>;
}

function SceneContents({ quality }: { quality: "high" | "low" }) {
  return <><ambientLight intensity={1.5} /><pointLight position={[3, 2, 3]} color={liquidPalette.cyan} intensity={9} distance={8} /><pointLight position={[-3, -2, 2]} color={liquidPalette.magenta} intensity={7} distance={7} /><GlassSculpture /><Particles count={quality === "high" ? visualQuality.particles.high : visualQuality.particles.low} /><Preload all /></>;
}

export default function HeroScene() {
  const quality = useVisualQuality();
  return <Canvas className="hero-canvas" dpr={quality === "high" ? visualQuality.desktopDpr : visualQuality.mobileDpr} camera={{ position: [0, 0, 4.2], fov: 42 }} gl={{ alpha: true, antialias: quality === "high", powerPreference: "high-performance" }}><SceneContents quality={quality} /></Canvas>;
}
