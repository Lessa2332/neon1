export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export const lerp = (start, end, t) => start + (end - start) * t;

export const isMobile = () => /Android|iPhone|iPad/i.test(navigator.userAgent);

export const getBatteryStatus = async () => {
  try {
    const battery = await navigator.getBattery?.();
    return battery?.level ?? 1;
  } catch {
    return 1;
  }
};

export const disposeTexture = (texture) => {
  if (texture?.isTexture) {
    texture.dispose();
    if (texture.image?.close) texture.image.close();
  }
};
