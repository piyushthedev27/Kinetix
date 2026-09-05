"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Text } from "@react-three/drei";
import { Ground } from "../sandbox3d/primitives";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

type Category = "renewable" | "nonrenewable";

interface Source { id: string; name: string; correct: Category; fact: string }

const SOURCES: Source[] = [
  { id: "solar", name: "Solar", correct: "renewable", fact: "The sun's energy is effectively inexhaustible on human timescales." },
  { id: "wind", name: "Wind", correct: "renewable", fact: "Wind comes from the sun's uneven heating of the atmosphere — it won't run out." },
  { id: "hydro", name: "Hydropower", correct: "renewable", fact: "Flowing water is continuously replenished by the water cycle." },
  { id: "biomass", name: "Biomass", correct: "renewable", fact: "Plants regrow, so biomass can be replenished if managed sustainably." },
  { id: "coal", name: "Coal", correct: "nonrenewable", fact: "Formed over millions of years — we burn it far faster than it forms." },
  { id: "petroleum", name: "Petroleum", correct: "nonrenewable", fact: "Like coal, it took millions of years to form and is used up much faster." },
  { id: "gas", name: "Natural Gas", correct: "nonrenewable", fact: "A fossil fuel with a limited underground supply." },
  { id: "nuclear", name: "Nuclear (uranium)", correct: "nonrenewable", fact: "Uranium is a mined mineral resource — finite, even though it isn't a fossil fuel." },
];

function SortingScene({ answers, revealed }: { answers: Record<string, Category | undefined>; revealed: boolean }) {
  return (
    <>
      <Ground width={9} depth={5} color="#e4e8e2" />
      <mesh position={[-1.6, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 4.8]} />
        <meshStandardMaterial color="#dff0d8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.6, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 4.8]} />
        <meshStandardMaterial color="#f7dede" transparent opacity={0.6} />
      </mesh>
      <Text position={[-1.6, 0.02, -2.1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color="#3baa70" anchorX="center">RENEWABLE</Text>
      <Text position={[1.6, 0.02, -2.1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color="#e35d5d" anchorX="center">NON-RENEWABLE</Text>

      {SOURCES.map((s, i) => {
        const answer = answers[s.id];
        const col = i % 4;
        const row = Math.floor(i / 4);
        const baseX = answer === "renewable" ? -1.6 : answer === "nonrenewable" ? 1.6 : 0;
        const x = baseX + (col - 1.5) * 0.5;
        const z = -0.8 + row * 1.2;
        const isCorrect = revealed && answer === s.correct;
        const isWrong = revealed && answer !== undefined && answer !== s.correct;
        const color = isCorrect ? "#3baa70" : isWrong ? "#e35d5d" : answer ? "#8b96a3" : "#c8d0ca";
        return (
          <group key={s.id} position={[x, 0.16, z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            <Text position={[0, 0.28, 0]} fontSize={0.1} color="#56616d" anchorX="center">{s.name}</Text>
          </group>
        );
      })}
    </>
  );
}

export function SourcesOfEnergySandbox3D() {
  const [answers, setAnswers] = useState<Record<string, Category | undefined>>({});
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Sort every source, then check your answers."]);

  const setAnswer = (id: string, cat: Category) => {
    setAnswers((prev) => ({ ...prev, [id]: cat }));
    setRevealed(false);
  };

  const checkAll = () => {
    const unanswered = SOURCES.filter((s) => !answers[s.id]);
    if (unanswered.length > 0) {
      setLog((prev) => [...prev, `Sort all ${SOURCES.length} sources before checking — ${unanswered.length} left.`]);
      return;
    }
    const correctCount = SOURCES.filter((s) => answers[s.id] === s.correct).length;
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `You got ${correctCount} of ${SOURCES.length} correct.`,
      "Renewable sources are replenished naturally on a human timescale (sun, wind, flowing water, regrown plants). Non-renewable sources — fossil fuels and mined fuels — took millions of years to form and are being used up far faster than nature remakes them.",
    ]);
  };

  const reset = () => {
    setAnswers({});
    setRevealed(false);
    setLog(["Sort every source, then check your answers."]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-source-grid">
        {SOURCES.map((s) => {
          const answer = answers[s.id];
          const isCorrect = revealed && answer === s.correct;
          const isWrong = revealed && answer !== s.correct;
          return (
            <div key={s.id} className="kx-sandbox-source-card" data-result={isCorrect ? "correct" : isWrong ? "incorrect" : undefined}>
              <div className="kx-sandbox-source-name">{s.name}</div>
              <div className="kx-sandbox-chip-row">
                <button type="button" className="kx-sandbox-chip" data-active={answer === "renewable"} onClick={() => setAnswer(s.id, "renewable")}>Renewable</button>
                <button type="button" className="kx-sandbox-chip" data-active={answer === "nonrenewable"} onClick={() => setAnswer(s.id, "nonrenewable")}>Non-renewable</button>
              </div>
              {revealed && <p className="kx-sandbox-source-fact">{s.fact}</p>}
            </div>
          );
        })}
      </div>

      <Scene3DShell cameraPosition={[0, 3.4, 4]} target={[0, 0, -0.4]} minDistance={2.5} maxDistance={10}>
        <SortingScene answers={answers} revealed={revealed} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={checkAll}>Check Answers</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
