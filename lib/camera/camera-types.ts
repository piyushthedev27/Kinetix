export type CameraStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "captured"
  | "denied"
  | "unsupported"
  | "error";

export type CaptureSource = "camera" | "mock";

export type CaptureResult = {
  source: CaptureSource;
  capturedAt: string;
  durationMs: number;
  frameCount: number;
};

export type CameraAdapter = {
  requestStream: () => Promise<MediaStream>;
  stopStream: (stream: MediaStream) => void;
};
