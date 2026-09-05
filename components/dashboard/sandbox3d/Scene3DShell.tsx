"use client";

import { Suspense, useRef, type ComponentRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { RotateCcw } from "lucide-react";

const BG = "#eef1ec";

interface Scene3DShellProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  groundY?: number;
}

export function Scene3DShell({
  children,
  cameraPosition = [4.5, 4.2, 6.5],
  target = [0, 0, 0],
  minDistance = 3,
  maxDistance = 14,
  groundY = 0,
}: Scene3DShellProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  return (
    <div className="kx-sandbox3d-wrap">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: cameraPosition, fov: 32 }}
        gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.15, outputColorSpace: SRGBColorSpace }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 16, 30]} />
        <hemisphereLight args={["#ffffff", "#b9c2b5", 0.45]} />
        <ambientLight intensity={0.12} />
        <directionalLight
          position={[5, 7.5, 3.5]}
          intensity={2.1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.35} color="#dce6ff" />
        <Suspense fallback={null}>
          {children}
          <ContactShadows position={[0, groundY + 0.001, 0]} opacity={0.6} blur={1.6} far={6} scale={14} resolution={512} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={target}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.08}
          maxPolarAngle={Math.PI - 0.08}
          minDistance={minDistance}
          maxDistance={maxDistance}
          enablePan={false}
        />
      </Canvas>

      <button
        type="button"
        className="kx-sandbox-fullscreen-btn kx-sandbox3d-reset-btn"
        onClick={() => controlsRef.current?.reset()}
      >
        <RotateCcw size={13} /> Reset view
      </button>
      <div className="kx-sandbox3d-hint">Drag to rotate · Scroll to zoom</div>
    </div>
  );
}
