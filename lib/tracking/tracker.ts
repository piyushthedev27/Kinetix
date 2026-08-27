export type BallPosition = {
  x: number;
  y: number;
  confidence: number;
  timestamp: number;
};

export type TrackerFrame = {
  source: "camera" | "mock";
  width: number;
  height: number;
  timestamp: number;
};

export type ObjectTracker = {
  processFrame: (frame: TrackerFrame) => BallPosition | null;
  reset: () => void;
};

/** Development-only tracker. A production ML Kit/TFLite adapter can implement the same contract. */
export function createMockTracker(): ObjectTracker {
  let frameIndex = 0;

  return {
    processFrame(frame) {
      const progress = (frameIndex++ % 60) / 59;
      const x = frame.width * (0.15 + progress * 0.7);
      const y = frame.height * (0.78 - Math.sin(progress * Math.PI) * 0.48);
      return { x, y, confidence: 0.96, timestamp: frame.timestamp };
    },
    reset() {
      frameIndex = 0;
    },
  };
}
