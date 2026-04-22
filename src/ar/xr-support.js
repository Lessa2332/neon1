export async function checkXRSupport() {
  const xr = navigator.xr;
  if (!xr) return { available: false, reason: 'no_xr' };
  
  try {
    const supported = await xr.isSessionSupported('immersive-ar');
    if (supported) {
      // Перевірка Depth API (для occlusion)
      const depthSupported = 'requestDepthInformation' in XRFrame.prototype;
      return { 
        available: true, 
        immersive: true,
        depthAPI: depthSupported,
        hitTest: 'requestHitTestSource' in XRSession.prototype
      };
    }
    return { available: false, reason: 'session_unsupported' };
  } catch(e) {
    return { available: false, reason: 'error', error: e.message };
  }
}

export async function enterAR(scene, camera, renderer) {
  if (!navigator.xr) return false;
  
  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['depth-sensing', 'local-floor']
  });
  
  renderer.xr.enabled = true;
  renderer.xr.setSession(session);
  
  // Додати hit-test для розміщення об'єктів на поверхнях
  session.requestReferenceSpace('local').then((refSpace) => {
    session.requestAnimationFrame((time, frame) => {
      const hitTestSource = await session.requestHitTestSource({ space: refSpace });
      // ... логіка обробки результатів
    });
  });
  
  return session;
}
