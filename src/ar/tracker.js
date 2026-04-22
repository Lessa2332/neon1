import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { CONFIG } from '../config.js';
import { isFistGesture, getFingerCurlAngle } from '../utils/gestures.js';

export class HandTracker {
  constructor(config) {
    this.config = config;
    this.landmarker = null;
    this.videoEl = document.getElementById('video');
    this.onHandDetected = null;
    this.onFistDetected = null;
  }
  
  async init() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm"
    );
    
    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: CONFIG.mediaPipeModelUrl,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 1
    });
  }
  
  async startCamera(facingMode = 'environment') {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode, 
        width: { ideal: 1280 }, 
        height: { ideal: 720 } 
      }
    });
    this.videoEl.srcObject = stream;
    await this.videoEl.play();
  }
  
  startLoop() {
    let lastTime = 0;
    const interval = 1000 / this.config.detectionFPS;
    
    const loop = (time) => {
      requestAnimationFrame(loop);
      if (time - lastTime < interval) return;
      if (!this.landmarker || this.videoEl.readyState < 2) return;
      
      try {
        const results = this.landmarker.detectForVideo(this.videoEl, time);
        this.processResults(results);
      } catch(e) {
        console.warn('Tracking error:', e);
      }
      lastTime = time;
    };
    loop(performance.now());
  }
  
  processResults(results) {
    if (results.landmarks?.[0]) {
      const lm = results.landmarks[0];
      if (this.onHandDetected) this.onHandDetected(lm);
      
      if (isFistGesture(lm, CONFIG.fistAngleThreshold)) {
        if (this.onFistDetected) this.onFistDetected(lm);
      }
    }
  }
  
  dispose() {
    this.landmarker?.close();
    this.videoEl.srcObject?.getTracks().forEach(t => t.stop());
  }
}
