// file: /js/views/Editor.js
// version: 1.0.0.0, 29.04.2026 19:15

import { I18nService } from '../services/i18n.js';

export const VehicleEditor = {
  /**
   * renders the vehicle editor view.
   * @async
   * @returns {string} html template.
   */
  render: async () => {
    const { t } = I18nService;
    return `
      <div class="view-section w-full max-w-4xl mx-auto">
        <div class="mb-6 px-1">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left" data-i18n="vehicle_editor.title">Fahrzeug-Editor</h1>
          <p class="text-sm text-slate-500 mt-1 text-left" data-i18n="vehicle_editor.subtitle">Konfiguration der Fahrzeug-Erkennungsmuster.</p>
        </div>

        <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <form id="vehicle-form" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest" data-i18n="vehicle_editor.object_id">Objekt ID</label>
                <input type="number" id="v-object" value="0" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-base transition-all">
              </div>
              <div class="flex items-center pt-6">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="v-matchless" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-base"></div>
                  <span class="ml-3 text-sm font-medium text-slate-500 dark:text-slate-400" data-i18n="vehicle_editor.matchless">Matchless</span>
                </label>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider" data-i18n="vehicle_editor.base_patterns">Basis-Muster</h3>
                <button type="button" id="add-base" class="text-brand-base hover:text-indigo-400 text-xs font-bold transition-colors">
                  <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="vehicle_editor.add_pattern">Hinzufügen</span>
                </button>
              </div>
              <div id="base-container" class="space-y-2"></div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider" data-i18n="vehicle_editor.extend_patterns">Erweiterte Anforderungen</h3>
                <button type="button" id="add-extend" class="text-brand-base hover:text-indigo-400 text-xs font-bold transition-colors">
                  <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="vehicle_editor.add_extend">Hinzufügen</span>
                </button>
              </div>
              <div id="extend-container" class="space-y-2"></div>
            </div>

            <div class="pt-4 flex justify-end">
              <button type="submit" class="bg-brand-base hover:opacity-90 text-white font-bold py-2.5 px-8 rounded-xl transition-all uppercase text-xs tracking-widest">
                <i class="fa-solid fa-save mr-2"></i> <span data-i18n="common.save">Speichern</span>
              </button>
            </div>
          </form>
        </div>

        <div class="mt-8">
          <h3 class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-1">JSON Vorschau</h3>
          <pre id="json-preview" class="bg-slate-900 text-emerald-500 p-6 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800 shadow-xl"></pre>
        </div>
      </div>
    `;
  },

  /**
   * initializes form logic and dynamic rows.
   * @async
   * @returns {void}
   */
  after_render: async () => {
    I18nService.applyTranslations(document.getElementById('app-content'));
    
    const baseContainer = document.getElementById('base-container');
    const extendContainer = document.getElementById('extend-container');
    const preview = document.getElementById('json-preview');
    const form = document.getElementById('vehicle-form');

    const addBaseRow = (val = '') => {
      const row = document.createElement('div');
      row.className = "flex gap-2 group";
      row.innerHTML = `
        <input type="text" value="${val}" placeholder="${I18nService.t('vehicle_editor.placeholder_regex')}" class="base-input flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-base transition-all">
        <button type="button" class="remove-row px-3 text-slate-300 hover:text-rose-500 transition-colors"><i class="fa-solid fa-trash-can text-xs"></i></button>
      `;
      baseContainer.appendChild(row);
      row.querySelector('.remove-row').onclick = () => { row.remove(); updatePreview(); };
      row.querySelector('input').oninput = updatePreview;
    };

    const addExtendRow = (key = '', val = 1) => {
      const row = document.createElement('div');
      row.className = "flex gap-2 group";
      row.innerHTML = `
        <input type="text" value="${key}" placeholder="${I18nService.t('vehicle_editor.placeholder_key')}" class="ext-key flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-base transition-all">
        <input type="number" value="${val}" class="ext-val w-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-base transition-all">
        <button type="button" class="remove-row px-3 text-slate-300 hover:text-rose-500 transition-colors"><i class="fa-solid fa-trash-can text-xs"></i></button>
      `;
      extendContainer.appendChild(row);
      row.querySelector('.remove-row').onclick = () => { row.remove(); updatePreview(); };
      row.querySelectorAll('input').forEach(i => i.oninput = updatePreview);
    };

    const updatePreview = () => {
      const data = {
        object: parseInt(document.getElementById('v-object').value) || 0,
        is_matchless: document.getElementById('v-matchless').checked,
        pattern: {
          base: Array.from(document.querySelectorAll('.base-input')).map(i => i.value).filter(v => v !== '')
        }
      };

      const extendInputs = document.querySelectorAll('#extend-container > div');
      if (extendInputs.length > 0) {
        data.pattern.extend = {};
        extendInputs.forEach(row => {
          const key = row.querySelector('.ext-key').value;
          const val = parseInt(row.querySelector('.ext-val').value);
          if (key !== '') data.pattern.extend[key] = val;
        });
      }

      preview.textContent = JSON.stringify(data, null, 2);
    };

    document.getElementById('add-base').onclick = () => addBaseRow();
    document.getElementById('add-extend').onclick = () => addExtendRow();
    document.getElementById('v-object').oninput = updatePreview;
    document.getElementById('v-matchless').onchange = updatePreview;

    form.onsubmit = (e) => {
      e.preventDefault();
      window.addSystemLog("Fahrzeug-Konfiguration gespeichert.", "success");
      console.log("Saving JSON:", preview.textContent);
    };

    // Initial rows
    addBaseRow("(Löschfahrzeuge|Löschfahrzeug) \\(LF\\)");
    updatePreview();
  }
};