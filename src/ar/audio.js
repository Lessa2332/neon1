export class SpatialAudio {
  constructor() {
    this.listener = null;
    this.sounds = new Map();
    this.enabled = true;
    
    // Ініціалізація Web Audio API
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.listener = this.ctx.listener;
    
    // Позиція слухача (камера)
    if (this.listener.positionX) {
      this.listener.positionX.value = 0;
      this.listener.positionY.value = 0;
      this.listener.positionZ.value = 3.3;
    }
  }

  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
      return true;
    } catch(e) {
      console.warn(`Failed to load sound: ${name}`, e);
      return false;
    }
  }

  playSpatial(name, position3D, options = {}) {
    if (!this.enabled || !this.sounds.has(name)) return;
    
    const buffer = this.sounds.get(name);
    const source = this.ctx.createBufferSource();
    const panner = this.ctx.createPanner();
    
    // Налаштування панорамування
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'exponential';
    panner.refDistance = 1;
    panner.maxDistance = 10;
    panner.rolloffFactor = 1.2;
    
    // Позиція звуку (конвертація з Three.js)
    panner.positionX.value = position3D.x;
    panner.positionY.value = position3D.y;
    panner.positionZ.value = position3D.z;
    
    // Параметри відтворення
    source.buffer = buffer;
    source.playbackRate.value = options.pitch || 1;
    
    // Гучність залежно від відстані до камери
    const distance = Math.sqrt(
      position3D.x**2 + position3D.y**2 + (position3D.z - 3.3)**2
    );
    const gain = this.ctx.createGain();
    gain.gain.value = Math.max(0, 1 - distance / 8) * (options.volume || 0.7);
    
    // З'єднання нод
    source.connect(panner).connect(gain).connect(this.ctx.destination);
    source.start();
    
    return { source, gain }; // для подальшого контролю
  }

  // Звук при наближенні руки до браслета
  playProximitySound(distance, baseVolume = 0.3) {
    if (!this.sounds.has('spark')) return;
    
    // Чим ближче — тим гучніше і вищий пітч
    const normalized = Math.max(0, Math.min(1, 1 - distance / 2));
    this.playSpatial('spark', 
      { x: (Math.random()-0.5)*0.3, y: 0.2, z: 0.1 },
      { 
        volume: baseVolume + normalized * 0.5,
        pitch: 0.8 + normalized * 0.6
      }
    );
  }
}
