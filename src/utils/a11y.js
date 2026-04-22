export function setupAccessibility() {
  // Кнопки з правильними ARIA-атрибутами
  document.querySelectorAll('button').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', btn.textContent.trim());
    }
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Підтримка prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    document.documentElement.classList.add('reduce-motion');
    // Вимкнути анімації частинок, шейдерні ефекти
    CONFIG.rotationSpeed = 0.0003;
    CONFIG.particleCount = 4;
  }
  mediaQuery.addEventListener?.('change', (e) => {
    document.documentElement.classList.toggle('reduce-motion', e.matches);
  });

  // Контрастність для дальтоніків (опціонально)
  const highContrast = localStorage.getItem('ar_high_contrast') === 'true';
  if (highContrast) {
    document.documentElement.classList.add('high-contrast');
  }
}

// CSS для reduce-motion
/*
.reduce-motion .particles-group,
.reduce-motion .hologram-plane {
  animation: none !important;
  transition: none !important;
}
.reduce-motion .spinner {
  animation-duration: 3s;
}
*/
