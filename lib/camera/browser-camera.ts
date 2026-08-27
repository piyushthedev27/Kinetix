import type { CameraAdapter } from "./camera-types";

export const browserCamera: CameraAdapter = {
  async requestStream() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new DOMException("Camera APIs are not available in this browser.", "NotSupportedError");
    }

    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
  },
  stopStream(stream) {
    stream.getTracks().forEach((track) => track.stop());
  },
};
