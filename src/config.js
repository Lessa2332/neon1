export const CONFIG = {
  // AR/Tracking
  detectionFPS: 26,
  fistAngleThreshold: 65,
  fistHoldFrames: 2,
  
  // Візуал
  braceletBaseRadius: 0.195,
  hologramOffsetY: 0.34,
  rotationSpeed: 0.0011,
  
  // Продуктивність
  maxPixelRatio: 1.6,
  fpsCheckInterval: 2000,
  
  // Аудіо
  audioEnabled: true,
  proximitySoundDistance: 2.0,
  
  // UX
  hideHologramAfterHandLostMs: 2500,
  defaultLanguage: 'uk',
  
  // URLs
  hologramVideoUrl: 'assets/video/guide_hologram.mp4',
  mediaPipeModelUrl: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  
  // Easter Eggs
  foxBonusStreak: 5
};

export default CONFIG;
