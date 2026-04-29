// file: /js/views/editor/MissionEditor.js
// version: 1.1.1.1, 29.04.2026 21:05

import { I18nService } from '../../services/i18n.js';

export const MissionEditor = {
  /**
   * renders the mission editor view.
   * @async
   * @returns {string} html template.
   */
  render: async () => {
    return `
      <div class="view-section w-full max-w-6xl mx-auto text-left">
        <div class="mb-6 px-1 flex justify-between items-end">
          <div class="text-left">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="editor.mission.title"></h1>
            <p class="text-sm text-slate-500 mt-1" data-i18n="editor.mission.subtitle"></p>
          </div>
          <div class="flex gap-2">
            <input type="file" id="import-json" class="hidden" accept=".mscm">
            <button type="button" onclick="document.getElementById('import-json').click()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-brand-base hover:text-white transition-all shadow-sm">
              <i class="fa-solid fa-file-import mr-2"></i> <span data-i18n="editor.mission.import_btn"></span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <form id="mission-form" class="space-y-8">
                
                <div class="space-y-4">
                  <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2" data-i18n="editor.mission.base_data"></h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <label class="text-[10px] uppercase font-black text-slate-400" data-i18n="editor.mission.name"></label>
                      <input type="text" id="m-name" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-base transition-all">
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] uppercase font-black text-slate-400" data-i18n="editor.mission.base_id"></label>
                      <input type="text" id="m-base-id" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-base transition-all">
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] uppercase font-black text-slate-400" data-i18n="editor.mission.credits"></label>
                      <input type="number" id="m-credits" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] uppercase font-black text-slate-400" data-i18n="editor.mission.overlays"></label>
                      <input type="text" id="m-overlays" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all">
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest" data-i18n="editor.mission.requirements_title"></h3>
                    <button type="button" id="add-req-row" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase transition-colors">
                      <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="editor.mission.add_requirement"></span>
                    </button>
                  </div>
                  <div id="req-array-container" class="space-y-3"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest" data-i18n="editor.mission.additional_title"></h3>
                      <button type="button" data-add-kv="additional" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase transition-colors">
                        <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="editor.mission.add_generic"></span>
                      </button>
                    </div>
                    <div id="additional-kv-container" class="space-y-2"></div>
                  </div>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest" data-i18n="editor.mission.chances_title"></h3>
                      <button type="button" data-add-kv="chance" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase transition-colors">
                        <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="editor.mission.add_generic"></span>
                      </button>
                    </div>
                    <div id="chance-kv-container" class="space-y-2"></div>
                  </div>
                </div>

                <div class="pt-4 flex justify-end">
                  <button type="submit" class="bg-brand-base hover:opacity-90 text-white font-bold py-3 px-10 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg">
                    <i class="fa-solid fa-download mr-2"></i> <span data-i18n="editor.mission.save_btn"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-4">
            <div class="sticky top-6">
              <h3 class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-1 text-left" data-i18n="editor.mission.json_preview"></h3>
              <pre id="json-preview" class="bg-[#0F172A] text-emerald-400 p-5 rounded-2xl text-[10px] font-mono overflow-x-auto border border-slate-800 shadow-2xl max-h-[calc(100vh-8rem)] scrollbar-thin text-left"></pre>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  after_render: async () => {
    I18nService.applyTranslations(document.getElementById('app-content'));
    const preview = document.getElementById('json-preview');
    const { t } = I18nService;
    
    let fullDataStore = {
      additional: {},
      average_credits: 0,
      chances: {},
      base_mission_id: "0",
      name: "",
      requirements: [],
      place: "",
      overlay_index: null,
      additive_overlays: ""
    };

    const addRequirementRow = (amount = '1', ids = []) => {
      const container = document.getElementById('req-array-container');
      const div = document.createElement('div');
      div.className = "flex gap-2 items-center p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 group";
      div.innerHTML = `
        <div class="w-20 text-left">
          <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">${t('editor.mission.amount_label')}</label>
          <input type="number" value="${amount}" class="req-amount w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none">
        </div>
        <div class="flex-1 text-left">
          <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">${t('editor.mission.vehicle_ids_label')}</label>
          <input type="text" value="${ids.join(', ')}" placeholder="${t('editor.mission.vehicle_ids_placeholder')}" class="req-ids w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none">
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

    const addKVRow = (containerid, k = '', v = 0) => {
      const container = document.getElementById(`${containerid}-kv-container`);
      const div = document.createElement('div');
      div.className = "flex gap-2 items-center group";
      const valToSet = (Array.isArray(v)) ? v.join(', ') : v;
      const isNum = typeof v === 'number' && !Array.isArray(v);

      div.innerHTML = `
        <input type="text" value="${k}" placeholder="${t('editor.mission.key_placeholder')}" class="kv-key w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none">
        <input type="${isNum ? 'number' : 'text'}" value="${valToSet}" placeholder="${t('editor.mission.val_placeholder')}" class="kv-val w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none">
        <button type="button" class="remove-row flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all w-6 h-6">
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
      `;
      container.appendChild(div);
      div.querySelector('.remove-row').onclick = () => { div.remove(); updatePreview(); };
      div.querySelectorAll('input').forEach(i => i.oninput = updatePreview);
    };

    const updatePreview = () => {
      const getKVObject = (containerid) => {
        const obj = {};
        document.querySelectorAll(`#${containerid}-kv-container > div`).forEach(row => {
          const k = row.querySelector('.kv-key').value;
          const vInput = row.querySelector('.kv-val');
          let v = vInput.value;

          if (k) {
            if (k === 'patient_specialization_ids') {
              obj[k] = v.split(',').map(i => parseInt(i.trim())).filter(i => !isNaN(i));
            } else if (k === 'patient_specialization_captions') {
              obj[k] = v.split(',').map(s => s.trim()).filter(s => s !== "");
            } else {
              const parsedV = vInput.type === 'number' ? parseInt(v) : v;
              obj[k] = (vInput.type === 'number' && isNaN(parsedV)) ? 0 : parsedV;
            }
          }
        });
        return obj;
      };

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

      fullDataStore.name = document.getElementById('m-name').value;
      fullDataStore.base_mission_id = document.getElementById('m-base-id').value;
      fullDataStore.average_credits = parseInt(document.getElementById('m-credits').value) || 0;
      fullDataStore.additive_overlays = document.getElementById('m-overlays').value;
      fullDataStore.requirements = reqs;
      fullDataStore.additional = getKVObject('additional');
      fullDataStore.chances = getKVObject('chance');

      preview.textContent = JSON.stringify(fullDataStore, null, 2);
    };

    const exportMSCM = () => {
      const baseId = fullDataStore.base_mission_id || '0';
      const overlay = fullDataStore.additive_overlays || 'empty';
      const fileName = `${baseId}-${overlay}.mscm`;
      const blob = new Blob([preview.textContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      window.addSystemLog(`${t('editor.mission.log_export_success')} ${fileName}`, "success");
    };

    document.getElementById('import-json').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let raw = event.target.result;
          raw = raw.replace(/,\s*([\]}])/g, '$1'); // Trailing Comma Fix
          const data = JSON.parse(raw);
          fullDataStore = data;

          document.getElementById('req-array-container').innerHTML = '';
          document.getElementById('additional-kv-container').innerHTML = '';
          document.getElementById('chance-kv-container').innerHTML = '';

          document.getElementById('m-name').value = data.name || '';
          document.getElementById('m-base-id').value = data.base_mission_id || '0';
          document.getElementById('m-credits').value = data.average_credits || 0;
          document.getElementById('m-overlays').value = data.additive_overlays || '';

          if (Array.isArray(data.requirements)) {
            data.requirements.forEach(reqObj => {
              const amount = Object.keys(reqObj)[0];
              addRequirementRow(amount, reqObj[amount]);
            });
          }
          if (data.chances) Object.entries(data.chances).forEach(([k, v]) => addKVRow('chance', k, v));
          if (data.additional) Object.entries(data.additional).forEach(([k, v]) => addKVRow('additional', k, v));

          setTimeout(() => { updatePreview(); window.addSystemLog(t('editor.mission.log_import_success'), "success"); }, 100);
        } catch (err) { 
          window.addSystemLog(t('editor.mission.log_import_error'), "error"); 
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    ['m-name', 'm-base-id', 'm-credits', 'm-overlays'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = updatePreview;
    });

    document.getElementById('add-req-row').onclick = () => addRequirementRow();
    document.querySelectorAll('[data-add-kv]').forEach(btn => btn.onclick = () => addKVRow(btn.dataset.addKv));
    document.getElementById('mission-form').onsubmit = (e) => { e.preventDefault(); exportMSCM(); };

    updatePreview();
  }
};