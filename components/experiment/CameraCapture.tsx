"use client";

import { Camera, CircleStop, RotateCcw, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { browserCamera } from "@/lib/camera/browser-camera";
import type { CameraStatus, CaptureResult } from "@/lib/camera/camera-types";
import { PhysicsMotion } from "@/components/kinetix-motion";

type CameraCaptureProps = {
  onCaptured?: (result: CaptureResult) => void;
};

const statusCopy: Record<CameraStatus, string> = {
  idle: "Camera is ready when you are.",
  requesting: "Requesting camera permission…",
  ready: "Camera preview ready.",
  recording: "Recording your throw…",
  captured: "Capture saved for processing.",
  denied: "Camera permission was denied.",
  unsupported: "Camera APIs are unavailable here.",
  error: "We could not start the camera.",
};

export function CameraCapture({ onCaptured }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startedAtRef = useRef<number>(0);
  const demoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [result, setResult] = useState<CaptureResult | null>(null);

  useEffect(() => {
    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      if (streamRef.current) browserCamera.stopStream(streamRef.current);
    };
  }, []);

  const saveResult = (capture: CaptureResult) => {
    setResult(capture);
    setStatus("captured");
    onCaptured?.(capture);
  };

  const enableCamera = async () => {
    setStatus("requesting");
    try {
      const stream = await browserCamera.requestStream();
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setStatus("ready");
    } catch (error) {
      const reason = error instanceof DOMException ? error.name : "error";
      setStatus(reason === "NotAllowedError" || reason === "SecurityError" ? "denied" : reason === "NotSupportedError" ? "unsupported" : "error");
    }
  };

  const startRecording = () => {
    startedAtRef.current = Date.now();
    const stream = streamRef.current;
    if (stream && typeof MediaRecorder !== "undefined") {
      try {
        const recorder = new MediaRecorder(stream);
        recorder.onstop = () => {
          saveResult({ source: "camera", capturedAt: new Date().toISOString(), durationMs: Date.now() - startedAtRef.current, frameCount: 0 });
        };
        recorder.start();
        recorderRef.current = recorder;
      } catch {
        setStatus("error");
        return;
      }
    }
    setStatus("recording");
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      recorderRef.current = null;
      return;
    }
    saveResult({ source: "camera", capturedAt: new Date().toISOString(), durationMs: Date.now() - startedAtRef.current, frameCount: 0 });
  };

  const useDemoCapture = () => {
    startedAtRef.current = Date.now();
    setStatus("recording");
    demoTimerRef.current = setTimeout(() => {
      saveResult({ source: "mock", capturedAt: new Date().toISOString(), durationMs: Date.now() - startedAtRef.current, frameCount: 48 });
    }, 650);
  };

  const reset = () => {
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setResult(null);
    setStatus(streamRef.current ? "ready" : "idle");
  };

  return (
    <div className="camera-capture" aria-label="Projectile camera capture">
      <div className="capture-view">
        <video ref={videoRef} className={`camera-capture__video ${streamRef.current ? "is-visible" : ""}`} aria-label="Camera preview" muted playsInline />
        <div className="camera-capture__fallback" aria-hidden={Boolean(streamRef.current)}>
          <div className="camera-ground" />
          <PhysicsMotion className="phone-physics" />
          <span className="ball" />
        </div>
        <span className={`tracking ${status === "recording" || status === "captured" ? "is-active" : ""}`}>
          {status === "recording" ? "Recording" : status === "captured" ? "Capture ready" : "Tracking preview"}
        </span>
        <div className="hud">
          <div><span>ANGLE</span><strong>38°</strong></div>
          <div><span>SPEED</span><strong>5.8 m/s</strong></div>
          <div><span>TIME</span><strong>{status === "recording" ? "0.62 s" : "—"}</strong></div>
        </div>
      </div>

      <div className="camera-capture__status" role="status">
        <span className={`status-dot status-dot--${status}`} />
        <span>{statusCopy[status]}</span>
        {result ? <small>{result.source === "camera" ? "Browser camera" : "Development fallback"}</small> : null}
      </div>

      <div className="camera-capture__actions">
        {status === "idle" || status === "denied" || status === "unsupported" || status === "error" ? (
          <>
            <button type="button" className="button primary" onClick={enableCamera}><Camera size={16} />Enable camera</button>
            <button type="button" className="button secondary" onClick={useDemoCapture}><Video size={16} />Use demo capture</button>
          </>
        ) : null}
        {status === "requesting" ? <button type="button" className="button secondary" disabled>Requesting permission…</button> : null}
        {status === "ready" ? <button type="button" className="button primary" onClick={startRecording}><Video size={16} />Start recording</button> : null}
        {status === "recording" ? <button type="button" className="button primary" onClick={stopRecording}><CircleStop size={16} />Stop and save</button> : null}
        {status === "captured" ? <button type="button" className="button secondary" onClick={reset}><RotateCcw size={16} />Retake</button> : null}
      </div>
    </div>
  );
}
