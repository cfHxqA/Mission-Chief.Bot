// file: /js/views/MissionEditor.js
// version: 1.0.0.6, 29.04.2026 21:55

import { I18nService } from '../services/i18n.js';

export const MissionEditor = {
  /**
   * renders the mission editor view based on the latest object structure.
   * @async
   * @returns {string} html template.
   */
  render: async () => {
    return `
      <div class="view-section w-full max-w-6xl mx-auto">
        <div class="mb-6 px-1">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left" data-i18n="mission_editor.title">Einsatz-Editor</h1>
          <p class="text-sm text-slate-500 mt-1 text-left" data-i18n="mission_editor.subtitle">Konfiguration für komplexe Einsatz-Strukturen.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <form id="mission-form" class="space-y-8">
                
                <div class="space-y-4">
                  <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Basis-Daten</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2 space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Name</label>
                      <input type="text" id="m-name" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-base transition-all">
                    </div>
                    <div class="space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Base Mission ID</label>
                      <input type="text" id="m-base-id" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-base transition-all">
                    </div>
                    <div class="space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Avg. Credits</label>
                      <input type="number" id="m-credits" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                    <div class="md:col-span-2 space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Ort (Place)</label>
                      <input type="text" id="m-place" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Erweiterte Optionen (Additional)</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Filter ID</label>
                      <input type="text" id="m-filter-id" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                    <div class="space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Max. Patienten</label>
                      <input type="number" id="m-pat-max" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                    <div class="space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Min. Patienten</label>
                      <input type="number" id="m-pat-min" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                    <div class="space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Max. Gefangene</label>
                      <input type="number" id="m-prisoners" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                    <div class="md:col-span-2 space-y-1 text-left">
                      <label class="text-[10px] uppercase font-black text-slate-400">Fachrichtungs-IDs (z.B. 4, 5)</label>
                      <input type="text" id="m-spec-ids" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest">Requirements (Array)</h3>
                    <button type="button" id="add-req-row" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase"><i class="fa-solid fa-plus mr-1"></i> Add Requirement</button>
                  </div>
                  <div id="req-array-container" class="space-y-3"></div>
                </div>

                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest">Chances (Object)</h3>
                    <button type="button" id="add-chance-row" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase"><i class="fa-solid fa-plus mr-1"></i> Add Chance</button>
                  </div>
                  <div id="chance-kv-container" class="grid grid-cols-1 md:grid-cols-2 gap-3"></div>
                </div>

                <div class="pt-4 flex justify-end">
                  <button type="submit" class="bg-brand-base hover:opacity-90 text-white font-bold py-3 px-10 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg">
                    <i class="fa-solid fa-save mr-2"></i> Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-4">
            <div class="sticky top-6">
              <h3 class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-1 text-left">Live JSON Output</h3>
              <pre id="json-preview" class="bg-[#0F172A] text-emerald-400 p-5 rounded-2xl text-[10px] font-mono overflow-x-auto border border-slate-800 shadow-2xl max-h-[calc(100vh-8rem)] scrollbar-thin text-left"></pre>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * initializes the editor logic and data mapping.
   * @async
   * @returns {void}
   */
  after_render: async () => {
    I18nService.applyTranslations(document.getElementById('app-content'));
    const preview = document.getElementById('json-preview');

    /**
     * adds a requirement row (array of objects style).
     * @param {string} amount - count.
     * @param {array} ids - vehicle ids.
     */
    const addRequirementRow = (amount = '1', ids = []) => {
      const container = document.getElementById('req-array-container');
      const div = document.createElement('div');
      div.className = "flex gap-2 items-center p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 group";
      div.innerHTML = `
        <div class="w-20">
          <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Menge</label>
          <input type="number" value="${amount}" class="req-amount w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none">
        </div>
        <div class="flex-1">
          <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Fahrzeug-IDs</label>
          <input type="text" value="${ids.join(', ')}" placeholder="32, 95..." class="req-ids w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none">
        </div>
        <div class="pt-4">
          <button type="button" class="remove-row flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all w-8 h-8">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      `;
      container.appendChild(div);
      div.querySelector('.remove-row').onclick = () => { div.remove(); updatePreview(); };
      div.querySelectorAll('input').forEach(i => i.oninput = updatePreview);
    };

    /**
     * adds a chance row (key-value object style).
     * @param {string} k - chance key.
     * @param {number} v - percentage.
     */
    const addChanceRow = (k = '', v = 0) => {
      const container = document.getElementById('chance-kv-container');
      const div = document.createElement('div');
      div.className = "flex gap-2 items-center group";
      div.innerHTML = `
        <input type="text" value="${k}" placeholder="Key" class="kv-key w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-base">
        <input type="number" value="${v}" placeholder="%" class="kv-val w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none focus:border-brand-base">
        <button type="button" class="remove-row flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all w-6 h-6">
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
      `;
      container.appendChild(div);
      div.querySelector('.remove-row').onclick = () => { div.remove(); updatePreview(); };
      div.querySelectorAll('input').forEach(i => i.oninput = updatePreview);
    };

    /**
     * synchronizes form data to the live json preview.
     */
    const updatePreview = () => {
      const reqs = [];
      document.querySelectorAll('#req-array-container > div').forEach(row => {
        const amount = row.querySelector('.req-amount').value;
        const ids = row.querySelector('.req-ids').value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        if (amount && ids.length > 0) {
          const obj = {};
          obj[amount] = ids;
          reqs.push(obj);
        }
      });

      const chances = {};
      document.querySelectorAll('#chance-kv-container > div').forEach(row => {
        const k = row.querySelector('.kv-key').value;
        const v = parseInt(row.querySelector('.kv-val').value);
        if (k) chances[k] = isNaN(v) ? 0 : v;
      });

      const specIds = document.getElementById('m-spec-ids').value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));

      const data = {
        additional: {
          possible_patient: parseInt(document.getElementById('m-pat-max').value) || 0,
          possible_patient_min: parseInt(document.getElementById('m-pat-min').value) || 0,
          max_possible_prisoners: parseInt(document.getElementById('m-prisoners').value) || 0,
          filter_id: document.getElementById('m-filter-id').value,
          patient_specialization_ids: specIds,
          patient_specialization_captions: [], // optional logic could be added
          patient_specializations: "" // optional logic could be added
        },
        average_credits: parseInt(document.getElementById('m-credits').value) || 0,
        chances: chances,
        base_mission_id: document.getElementById('m-base-id').value || "0",
        name: document.getElementById('m-name').value,
        requirements: reqs,
        place: document.getElementById('m-place').value,
        overlay_index: null,
        additive_overlays: ""
      };

      preview.textContent = JSON.stringify(data, null, 2);
    };

    // listeners
    ['m-name', 'm-base-id', 'm-credits', 'm-place', 'm-filter-id', 'm-pat-max', 'm-pat-min', 'm-prisoners', 'm-spec-ids'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = updatePreview;
    });

    document.getElementById('add-req-row').onclick = () => addRequirementRow();
    document.getElementById('add-chance-row').onclick = () => addChanceRow();

    // initial setup based on your example
    addRequirementRow('5', [32, 95]);
    addRequirementRow('6', [28, 74]);
    addChanceRow('nef', 10);
    addChanceRow('patient_transport', 30);
    updatePreview();
  }
};