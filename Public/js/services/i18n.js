// file: /js/services/i18n.js
// version: 1.0.0.2, 29.04.2026 17:10

/**
 * Service for managing internationalization (i18n).
 * Provides translation loading, lookup, and DOM binding utilities.
 * @namespace I18nService
 */
export const I18nService = {
  /** @type {Object.<string, any>} Loaded translation dictionary */
  translations: {},

  /** @type {string} Currently active language code */
  currentLang: localStorage.getItem('app_lang') || 'en',

  /**
   * Initializes the i18n service by loading the language file
   * and applying translations to the document.
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    try {
      const response = await fetch(`./lang/${this.currentLang}.json`);
      if (!response.ok) throw new Error('Language pack not found');

      this.translations = await response.json();

      // Automatically apply translations to static content
      this.applyTranslations(document.body);
    } catch (err) {
      console.error('i18n initialization failed:', err);
    }
  },

  /**
   * Resolves a translation key using dot-notation.
   * Falls back to the key if no translation is found.
   * @param {string} key - Translation key (e.g. "menu.title")
   * @returns {string} Translated string or the key as fallback
   */
  t: (key) => {
    const value = key
      .split('.')
      .reduce((obj, i) => (obj ? obj[i] : null), I18nService.translations);

    return value || key;
  },

  /**
   * Scans a DOM subtree for elements with [data-i18n] attributes
   * and replaces their text content with translated values.
   * @param {HTMLElement} [root=document] - Root element to start scanning from
   * @returns {void}
   */
  applyTranslations(root = document) {
    const elements = root.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  },

  /**
   * Sets the active language and reloads the application.
   * @param {string} langcode - Language code (e.g. "en", "de")
   * @returns {void}
   */
  setLanguage(langcode) {
    localStorage.setItem('app_lang', langcode);
    window.location.reload();
  }
};