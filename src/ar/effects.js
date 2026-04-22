import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export const hologramVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;
    pos.x += sin(uTime * 22.0 + pos.y * 12.0) * 0.003;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const hologramFragmentShader = `
  uniform sampler2D uVideo;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec4 color = texture2D(uVideo, vUv);
    float greenness = color.g - (color.r + color.b) * 0.5;
    if (greenness > 0.30) discard;
    
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    float scan = sin(vUv.y * 1100.0 + uTime * 35.0) * 0.11;
    float noise = fract(sin(dot(vUv * 15.0, vec2(12.9898, 78.233))) * 43758.5453 + uTime * 15.0);
    
    vec3 holo = mix(color.rgb * 0.85, vec3(0.12, 1.0, 0.38), 0.65);
    holo += vec3(0.0, 1.25, 0.6) * fresnel * 2.5;
    holo += scan + noise * 0.16;
    holo *= 0.9 + sin(uTime * 13.0) * 0.1;
    
    gl_FragColor = vec4(holo, 0.85 + fresnel * 0.5);
  }
`;

export class PostProcessing {
  constructor(renderer, scene, camera, config) {
    this.config = config;
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    
    if (config.postProcessing) {
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.35,  // strength
        0.5,   // radius
        0.1    // threshold
      );
      this.composer.addPass(bloom);
    }
  }
  
  render() {
    this.composer.render();
  }
  
  setEnabled(enabled) {
    this.composer.passes[1].enabled = enabled; // bloom pass
  }
}
