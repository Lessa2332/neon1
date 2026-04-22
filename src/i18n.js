export const translations = {
  uk: {
    status_idle: '👋 Покажіть долоню',
    status_hand: '🖐️ Рука виявлена! Стисніть кулак',
    status_active: '✨ SmartLessa активована! ✨',
    gesture_hint: '🤜 стисніть кулак, щоб покликати лисичку',
    gesture_confirm: '🤜✅ Кулак! Лисичка з\'являється...',
    video_missing: '⚠️ Відео відсутнє, але ефект працює',
    camera_error: '❌ Немає доступу до камери',
    ar_error: '❌ Помилка AR, спробуйте перезавантажити',
    btn_camera: '📷 Камера',
    btn_reset: '⟳ Скинути',
    btn_replay: '🎬 Повторити відео',
    btn_play: '🦊 Грати в гру',
    overlay_text: '🦊 Торкніться, щоб запустити лисичку 🦊',
    overlay_cta: '👉 ТУТ 👈'
  },
  en: {
    status_idle: '👋 Show your palm',
    status_hand: '🖐️ Hand detected! Make a fist',
    status_active: '✨ SmartLessa activated! ✨',
    gesture_hint: '🤜 Make a fist to summon the fox',
    gesture_confirm: '🤜✅ Fist! Fox is appearing...',
    video_missing: '⚠️ Video missing, but effects work',
    camera_error: '❌ Camera access denied',
    ar_error: '❌ AR error, try reloading',
    btn_camera: '📷 Camera',
    btn_reset: '⟳ Reset',
    btn_replay: '🎬 Replay video',
    btn_play: '🦊 Play game',
    overlay_text: '🦊 Tap to activate the fox 🦊',
    overlay_cta: '👉 TAP HERE 👈'
  }
};

export class I18n {
  constructor(defaultLang = 'uk') {
    this.lang = localStorage.getItem('ar_lang') || defaultLang;
    this.listeners = [];
  }

  t(key) {
    return translations[this.lang]?.[key] || translations.uk[key] || key;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.lang = lang;
      localStorage.setItem('ar_lang', lang);
      this.listeners.forEach(cb => cb(lang));
      document.documentElement.lang = lang;
    }
  }

  onChange(cb) {
    this.listeners.push(cb);
    return () => this.listeners = this.listeners.filter(l => l !== cb);
  }
}

export const i18n = new I18n();
