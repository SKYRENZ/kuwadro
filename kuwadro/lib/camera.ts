/**
 * Camera utility functions — separated from UI components.
 * Handles stream acquisition, frame capture, and cleanup.
 */

export const startCameraStream = async (
  videoElement: HTMLVideoElement,
  constraints?: MediaStreamConstraints
): Promise<MediaStream> => {
  const defaultConstraints: MediaStreamConstraints = {
    video: { facingMode: 'user', width: 640, height: 480 },
    ...constraints,
  };

  const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
  videoElement.srcObject = stream;
  return stream;
};

export const captureFrame = (videoElement: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Mirror the image horizontally to match the CSS mirror on the video
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/png');
};

export const stopCameraStream = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};
