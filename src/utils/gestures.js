export function getFingerCurlAngle(lm, tip, pip, mcp) {
  const v1 = { 
    x: lm[pip].x - lm[mcp].x, 
    y: lm[pip].y - lm[mcp].y, 
    z: (lm[pip].z||0) - (lm[mcp].z||0) 
  };
  const v2 = { 
    x: lm[tip].x - lm[pip].x, 
    y: lm[tip].y - lm[pip].y, 
    z: (lm[tip].z||0) - (lm[pip].z||0) 
  };
  
  const dot = v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
  const len1 = Math.hypot(v1.x, v1.y, v1.z) || 1;
  const len2 = Math.hypot(v2.x, v2.y, v2.z) || 1;
  
  return Math.acos(Math.max(-1, Math.min(1, dot / (len1 * len2)))) * (180 / Math.PI);
}

export function isFistGesture(lm, threshold = 65) {
  const fingers = [[8,6,5], [12,10,9], [16,14,13], [20,18,17]];
  let closed = 0;
  
  for (let [tip, pip, mcp] of fingers) {
    if (getFingerCurlAngle(lm, tip, pip, mcp) < threshold) closed++;
  }
  
  const thumbAngle = getFingerCurlAngle(lm, 4, 3, 2);
  if (thumbAngle < 70) closed++;
  
  return closed >= 4;
}

export function isOpenPalmGesture(lm, threshold = 120) {
  const fingers = [[8,6,5], [12,10,9], [16,14,13], [20,18,17]];
  let open = 0;
  
  for (let [tip, pip, mcp] of fingers) {
    if (getFingerCurlAngle(lm, tip, pip, mcp) > threshold) open++;
  }
  
  return open >= 3;
}
