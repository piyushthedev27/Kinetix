"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Line, Text } from "@react-three/drei";
import { DoubleSide } from "three";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const FOCAL_LENGTH = 1.4;
const PX_PER_UNIT = 0.028;

type MirrorType = "concave" | "convex";

function lineIntersect(p1: [number, number], d1: [number, number], p2: [number, number], d2: [number, number]) {
  const denom = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(denom) < 1e-6) return null;
  const t1 = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / denom;
  return { x: p1[0] + d1[0] * t1, y: p1[1] + d1[1] * t1, t1 };
}

function computeImage(mirrorType: MirrorType, distance: number) {
  const isConcave = mirrorType === "concave";
  const f = isConcave ? -FOCAL_LENGTH : FOCAL_LENGTH;
  const focusX = f;
  const objH = 0.5;
  const objX = -distance;
  const objTip: [number, number] = [objX, objH];

  const mirrorHitA: [number, number] = [0, objH];
  const dirA: [number, number] = isConcave ? [focusX - mirrorHitA[0], 0 - mirrorHitA[1]] : [mirrorHitA[0] - focusX, mirrorHitA[1] - 0];

  const dirToPole: [number, number] = [0 - objTip[0], 0 - objTip[1]];
  const dirB: [number, number] = [-dirToPole[0], dirToPole[1]];
  const poleHit: [number, number] = [0, 0];

  const hit = lineIntersect(mirrorHitA, dirA, poleHit, dirB);
  return { objTip, mirrorHitA, dirA, poleHit, dirB, hit, focusX, objH };
}

function MirrorScene({ mirrorType, distance }: { mirrorType: MirrorType; distance: number }) {
  const { objTip, mirrorHitA, dirA, poleHit, dirB, hit, focusX } = useMemo(() => computeImage(mirrorType, distance), [mirrorType, distance]);
  const isConcave = mirrorType === "concave";
  const centerX = focusX * 2;

  const rayLen = 4;
  const dir = hit && hit.t1 >= 0 ? 1 : -1;
  const magA = Math.hypot(dirA[0], dirA[1]) || 1;
  const magB = Math.hypot(dirB[0], dirB[1]) || 1;
  const rayAEnd: [number, number, number] = [mirrorHitA[0] + (dirA[0] / magA) * rayLen * dir, mirrorHitA[1] + (dirA[1] / magA) * rayLen * dir, 0];
  const rayBEnd: [number, number, number] = [poleHit[0] + (dirB[0] / magB) * rayLen * dir, poleHit[1] + (dirB[1] / magB) * rayLen * dir, 0];

  return (
    <>
      {/* Mirror surface: a shallow spherical cap */}
      <mesh rotation={[0, isConcave ? Math.PI / 2 : -Math.PI / 2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[FOCAL_LENGTH * 2, 32, 32, 0, Math.PI * 2, Math.PI / 2 - 0.35, 0.7]} />
        <meshStandardMaterial color="#b9c2c9" roughness={0.1} metalness={0.7} side={DoubleSide} />
      </mesh>

      <Line points={[[-3.5, 0, 0], [3.5, 0, 0]]} color="#c8d0ca" dashed dashSize={0.08} gapSize={0.06} />
      {[{ x: focusX, label: "F" }, { x: centerX, label: "C" }].map(({ x, label }) => (
        <Text key={label} position={[x, -0.2, 0]} fontSize={0.13} color="#56616d" anchorX="center">{label}</Text>
      ))}

      <Line points={[[objTip[0], 0, 0], [objTip[0], objTip[1], 0]]} color="#f59a3d" lineWidth={3} />
      <Line points={[[mirrorHitA[0], mirrorHitA[1], 0], rayAEnd]} color="#f59a3d" lineWidth={2} />
      <Line points={[[poleHit[0], poleHit[1], 0], rayBEnd]} color="#f59a3d" lineWidth={2} transparent opacity={0.6} />

      {hit && (
        <Line
          points={[[hit.x, 0, 0], [hit.x, hit.y, 0]]}
          color="#3c82f6"
          lineWidth={3}
          dashed={hit.t1 < 0}
          dashSize={0.06}
          gapSize={0.05}
        />
      )}
    </>
  );
}

export function CurvedMirrorSandbox3D() {
  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [distance, setDistance] = useState(2.2);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const { hit, objH } = computeImage(mirrorType, distance);
    let resultText = "Rays are parallel — the image forms at infinity. Try a different distance.";
    if (hit) {
      const real = hit.t1 >= 0;
      const inverted = hit.y < 0;
      const imgH = Math.abs(hit.y);
      const sizeLabel = Math.abs(imgH - objH) <= 0.05 ? "same-size" : imgH > objH ? "magnified" : "diminished";
      resultText = `${real ? "Real" : "Virtual"}, ${inverted ? "inverted" : "erect"}, ${sizeLabel} image at ${Math.abs(hit.x / PX_PER_UNIT / 40).toFixed(0)} units ${real ? "in front of" : "behind"} the mirror.`;
    }
    setLog((prev) => [...prev, resultText]);
  };

  const reset = () => {
    setMirrorType("concave");
    setDistance(2.2);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Mirror type</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={mirrorType === "concave"} onClick={() => setMirrorType("concave")}>Concave</button>
            <button type="button" className="kx-sandbox-chip" data-active={mirrorType === "convex"} onClick={() => setMirrorType("convex")}>Convex</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="distance-slider-3d">Object distance <span className="mono">{Math.round(distance * 20)} u</span></label>
          <input id="distance-slider-3d" type="range" min={0.6} max={3.4} step={0.05} value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.6, 1.6, 4.4]} target={[0, 0.2, 0]} minDistance={2.8} maxDistance={10} groundY={-1}>
        <MirrorScene mirrorType={mirrorType} distance={distance} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal}>Describe the Image</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
