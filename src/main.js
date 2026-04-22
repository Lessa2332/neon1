import { CONFIG } from './config.js';
import { i18n } from './i18n.js';
import { setupAccessibility } from './utils/a11y.js';
import { ARRenderer } from './ar/renderer.js';
import { HandTracker } from './ar/tracker.js';
import { SpatialAudio } from './ar/audio.js';
import { checkXRSupport } from './ar/xr-support.js';
import { AdaptiveQuality } from './utils/performance.js';

class App {
  async init() {
    setupAccessibility();
    await this.initAssets();
    this.initModules();
    this.bindUI();
    this.start();
  }
  
  async initAssets() {
    // Завантаження відео, аудіо, моделей
  }
  
  initModules() {
    this.renderer = new ARRenderer(CONFIG);
    this.tracker = new HandTracker(CONFIG);
    this.audio = new SpatialAudio();
    this.perf = new AdaptiveQuality(this.renderer, CONFIG);
  }
  
  bindUI() {
    // Обробники кнопок, мови, жестів
  }
  
  start() {
    this.renderer.animate();
    this.tracker.startLoop();
  }
}

new App().init();
