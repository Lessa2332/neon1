export class AdaptiveQuality {
  constructor(renderer, config) {
    this.renderer = renderer;
    this.config = config;
    this.fpsHistory = [];
    this.qualityLevel = 2; // 0=low, 1=medium, 2=high
    this.lastCheck = 0;
    this.checkInterval = 2000; // перевірка кожні 2 сек
  }

  measureFPS() {
    const now = performance.now();
    const fps = 1000 / (now - (this.lastFrame || now));
    this.lastFrame = now;
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 30) this.fpsHistory.shift();
    return this.fpsHistory.reduce((a,b) => a+b, 0) / this.fpsHistory.length;
  }

  adjust() {
    const now = performance.now();
    if (now - this.lastCheck < this.checkInterval) return;
    this.lastCheck = now;

    const avgFPS = this.measureFPS();
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    
    // Динамічне масштабування якості
    if (avgFPS < 20 && this.qualityLevel > 0) {
      this.qualityLevel--;
      this.applyQuality();
      console.log(`⬇️ Quality down: ${this.qualityLevel}/2 (FPS: ${avgFPS.toFixed(1)})`);
    } else if (avgFPS > 45 && this.qualityLevel < 2 && isMobile) {
      this.qualityLevel++;
      this.applyQuality();
      console.log(`⬆️ Quality up: ${this.qualityLevel}/2 (FPS: ${avgFPS.toFixed(1)})`);
    }
  }

  applyQuality() {
    const levels = {
      0: { // Low
        pixelRatio: 1.0,
        particleCount: 8,
        shadowQuality: false,
        postProcessing: false,
        detectionFPS: 15
      },
      1: { // Medium
        pixelRatio: 1.3,
        particleCount: 16,
        shadowQuality: false,
        postProcessing: true,
        detectionFPS: 24
      },
      2: { // High
        pixelRatio: Math.min(window.devicePixelRatio, 1.6),
        particleCount: 24,
        shadowQuality: true,
        postProcessing: true,
        detectionFPS: 30
      }
    };
    
    const settings = levels[this.qualityLevel];
    this.renderer.setPixelRatio(settings.pixelRatio);
    this.config.particleCount = settings.particleCount;
    this.config.detectionFPS = settings.detectionFPS;
    // Додатково: вимкнути bloom/фог на низькій якості
  }

  getQualityIndicator() {
    return ['🔴 LOW', '🟡 MED', '🟢 HIGH'][this.qualityLevel];
  }
}
