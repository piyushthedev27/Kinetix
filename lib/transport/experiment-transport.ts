export type ConnectionState = "connecting" | "connected" | "streaming" | "paused" | "disconnected" | "reconnecting" | "error";

export type LiveExperimentEvent = {
  type: "frame" | "status";
  timestamp: number;
  payload?: unknown;
};

export type ExperimentTransport = {
  connect: () => Promise<void>;
  disconnect: () => void;
  pause: () => void;
  resume: () => void;
  subscribe: (listener: (event: LiveExperimentEvent) => void) => () => void;
};

/** Development transport used until the Office Kit/WebSocket service is available. */
export function createMockTransport(): ExperimentTransport {
  let timer: ReturnType<typeof setInterval> | undefined;
  const listeners = new Set<(event: LiveExperimentEvent) => void>();
  let connected = false;

  const emit = (event: LiveExperimentEvent) => listeners.forEach((listener) => listener(event));

  return {
    async connect() {
      connected = true;
      emit({ type: "status", timestamp: Date.now(), payload: "connected" satisfies ConnectionState });
      timer = setInterval(() => {
        if (connected) emit({ type: "frame", timestamp: Date.now() });
      }, 900);
    },
    disconnect() {
      connected = false;
      if (timer) clearInterval(timer);
      timer = undefined;
      emit({ type: "status", timestamp: Date.now(), payload: "disconnected" satisfies ConnectionState });
    },
    pause() {
      connected = false;
      emit({ type: "status", timestamp: Date.now(), payload: "paused" satisfies ConnectionState });
    },
    resume() {
      connected = true;
      emit({ type: "status", timestamp: Date.now(), payload: "streaming" satisfies ConnectionState });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
