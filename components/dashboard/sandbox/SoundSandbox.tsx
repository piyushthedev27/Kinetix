"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 220;
const WAVE_Y = 140;

export function SoundSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const freqRef = useRef(4);
  const ampRef = useRef(40);
  const phaseRef = useRef(0);
  const lastFrameRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const [freq, setFreq] = useState(4); // visual cycles across the canvas width
  const [amp, setAmp] = useState(40);
  const [playing, setPlaying] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { freqRef.current = freq; }, [freq]);
  useEffect(() => { ampRef.current = amp; }, [amp]);

  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.frequency.value = 110 + freq * 60;
    }
  }, [freq]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = Math.min(0.06, (amp / 60) * 0.06);
    }
  }, [amp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;
      phaseRef.current += dt * (2 + freqRef.current);

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Waveform
      ctx.strokeStyle = "#3c82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= CANVAS_WIDTH; x += 4) {
        const cycles = freqRef.current;
        const y = WAVE_Y + ampRef.current * Math.sin((x / CANVAS_WIDTH) * cycles * Math.PI * 2 + phaseRef.current);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Vibrating source (a small membrane on the left)
      const membraneX = 40;
      const membraneOffset = ampRef.current * 0.3 * Math.sin(phaseRef.current * 2);
      ctx.strokeStyle = "#f59a3d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(membraneX + membraneOffset, 40);
      ctx.lineTo(membraneX + membraneOffset, CANVAS_HEIGHT - 20);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Frequency: ${(110 + freqRef.current * 60).toFixed(0)} Hz   Amplitude: ${ampRef.current}`, 20, 24);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      oscRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  const togglePlay = () => {
    try {
      if (!playing) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioCtxRef.current ?? new AudioCtx();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 110 + freqRef.current * 60;
        gain.gain.value = Math.min(0.06, (ampRef.current / 60) * 0.06);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        setPlaying(true);
        setLog((prev) => [...prev, `Playing a ${(110 + freqRef.current * 60).toFixed(0)} Hz tone.`]);
      } else {
        oscRef.current?.stop();
        oscRef.current = null;
        gainRef.current = null;
        setPlaying(false);
        setLog((prev) => [...prev, "Stopped."]);
      }
    } catch {
      setLog((prev) => [...prev, "This browser blocked audio playback, but the waveform above still shows the same physics."]);
    }
  };

  const explain = () => {
    setLog((prev) => [
      ...prev,
      `Frequency controls pitch: ${(110 + freqRef.current * 60).toFixed(0)} Hz means ${(110 + freqRef.current * 60).toFixed(0)} vibrations per second — more vibrations per second sounds higher-pitched.`,
      `Amplitude controls loudness, not pitch: a bigger vibration (amplitude ${ampRef.current}) makes it louder, while the pitch stays set by frequency alone.`,
    ]);
  };

  const reset = () => {
    setFreq(4);
    setAmp(40);
    if (playing) togglePlay();
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="freq-slider">Frequency (pitch) <span className="mono">{(110 + freq * 60).toFixed(0)} Hz</span></label>
          <input id="freq-slider" type="range" min={1} max={10} step={0.5} value={freq} onChange={(e) => setFreq(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="amp-slider">Amplitude (loudness) <span className="mono">{amp}</span></label>
          <input id="amp-slider" type="range" min={10} max={70} value={amp} onChange={(e) => setAmp(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={togglePlay}>{playing ? "Stop Tone" : "Play Tone"}</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={explain}>Explain What Changed</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
