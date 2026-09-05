"use client";

import { RoundedBox, Text } from "@react-three/drei";
import { DoubleSide, type MeshStandardMaterialParameters } from "three";

interface GroundProps {
  width?: number;
  depth?: number;
  color?: string;
}

export function Ground({ width = 20, depth = 20, color = "#dde3d8" }: GroundProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} side={DoubleSide} />
    </mesh>
  );
}

interface Ruler3DProps {
  /** World-space length of one labeled unit. */
  unitSize?: number;
  /** Number of labeled units drawn along +X from the origin. */
  count?: number;
  /** Position of unit 0. */
  origin?: [number, number, number];
  color?: string;
}

export function Ruler3D({ unitSize = 0.6, count = 12, origin = [0, 0, 0], color = "#8b96a3" }: Ruler3DProps) {
  const [ox, oy, oz] = origin;
  const ticks = Array.from({ length: count + 1 }, (_, i) => i);

  return (
    <group>
      {ticks.map((u) => {
        const tall = u % 2 === 0;
        const x = ox + u * unitSize;
        return (
          <group key={u} position={[x, oy, oz]}>
            <mesh position={[0, tall ? 0.06 : 0.04, 0]}>
              <boxGeometry args={[0.02, tall ? 0.12 : 0.08, 0.02]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {tall && (
              <Text position={[0, 0.22, 0]} fontSize={0.14} color="#56616d" anchorX="center" anchorY="middle">
                {String(u)}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

interface RoundedBlockProps {
  size?: [number, number, number];
  color?: string;
  materialProps?: Partial<MeshStandardMaterialParameters>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
}

export function RoundedBlock({
  size = [0.5, 0.5, 0.5],
  color = "#b7e33a",
  materialProps,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
}: RoundedBlockProps) {
  return (
    <RoundedBox args={size} radius={0.05} smoothness={4} position={position} rotation={rotation} castShadow={castShadow}>
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} {...materialProps} />
    </RoundedBox>
  );
}
