// file: /js/views/VehicleEditor.js
// version: 1.1.1.0, 29.04.2026 21:54

import { I18nService } from '../../services/i18n.js';

export const VehicleEditor = {
  render: async () => {
    return `
      <div class="view-section w-full max-w-6xl mx-auto text-left">
        <div class="mb-6 px-1 flex justify-between items-end">
          <div class="text-left">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white" data-i18n="editor.vehicle.title"></h1>
            <p class="text-sm text-slate-500 mt-1" data-i18n="editor.vehicle.subtitle"></p>
          </div>
          <div class="flex gap-2">
            <input type="file" id="import-mscv" class="hidden" accept=".mscv">
            <button type="button" onclick="document.getElementById('import-mscv').click()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-brand-base hover:text-white transition-all shadow-sm">
              <i class="fa-solid fa-file-import mr-2"></i> <span data-i18n="editor.vehicle.import_btn"></span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <form id="vehicle-form" class="space-y-8">
                <div class="space-y-4">
                  <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2" data-i18n="editor.vehicle.base_data"></h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <label class="text-[10px] uppercase font-black text-slate-400" data-i18n="editor.vehicle.object_id"></label>
                      <input type="number" id="v-object" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-base transition-all">
                    </div>
                    <div class="pt-6 flex items-center justify-end">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="v-matchless" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-base"></div>
                        <span class="ml-3 text-xs font-medium text-slate-500" data-i18n="editor.vehicle.matchless"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest" data-i18n="editor.vehicle.patterns_title"></h3>
                    <button type="button" id="add-base-row" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase transition-colors">
                      <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="editor.vehicle.add_pattern"></span>
                    </button>
                  </div>
                  <div id="base-container" class="space-y-3"></div>
                </div>

                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 class="text-xs font-bold text-brand-base uppercase tracking-widest" data-i18n="editor.vehicle.extend_title"></h3>
                    <button type="button" id="add-extend-row" class="text-brand-base hover:text-indigo-400 text-[10px] font-bold uppercase transition-colors">
                      <i class="fa-solid fa-plus mr-1"></i> <span data-i18n="editor.vehicle.add_extend"></span>
                    </button>
                  </div>
                  <div id="extend-kv-container" class="space-y-3"></div>
                </div>

                <div class="pt-4 flex justify-end">
                  <button type="submit" class="bg-brand-base hover:opacity-90 text-white font-bold py-3 px-10 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg">
                    <i class="fa-solid fa-download mr-2"></i> <span data-i18n="editor.vehicle.save_btn"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-4">
            <div class="sticky top-6">
              <h3 class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-1 text-left" data-i18n="editor.vehicle.json_preview"></h3>
              <pre id="json-preview" class="bg-[#0f172a] text-emerald-400 p-5 rounded-2xl text-[10px] font-mono overflow-x-auto border border-slate-800 shadow-2xl max-h-[calc(100vh-8rem)] scrollbar-thin text-left"></pre>
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
    
    let fullDataStore = { additional: {}, object: 0, is_matchless: false, pattern: { base: [], extend: {} } };

    /**
     * .NET compatible "Regex" validation. 
     * Since we can't use new RegExp() for .NET syntax, we just check for basic balance.
     */
    const isBasicValidRegex = (str) => {
      if (!str) return true;
      const opened = (str.match(/\(/g) || []).length;
      const closed = (str.match(/\)/g) || []).length;
      return opened === closed; // Einfache Prüfung auf geschlossene Klammern
    };

    const addBaseRow = (val = '') => {
      const container = document.getElementById('base-container');
      const div = document.createElement('div');
      div.className = "space-y-1";
      div.innerHTML = `
        <div class="flex gap-2 items-center group">
          <input type="text" class="base-input flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none transition-all">
          <button type="button" class="remove-row flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all w-8 h-8"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>
        <span class="error-msg hidden text-[9px] text-rose-500 font-bold ml-1">${t('editor.vehicle.invalid_regex')}</span>
      `;
      container.appendChild(div);
      const input = div.querySelector('input');
      const error = div.querySelector('.error-msg');
      input.value = val; // Set directly to handle backslashes correctly

      input.oninput = () => {
        const invalid = !isBasicValidRegex(input.value);
        input.classList.toggle('border-rose-500', invalid);
        error.classList.toggle('hidden', !invalid);
        updatePreview();
      };
      div.querySelector('.remove-row').onclick = () => { div.remove(); updatePreview(); };
    };

    const addKVRow = (k = '', v = 1) => {
      const container = document.getElementById('extend-kv-container');
      const div = document.createElement('div');
      div.className = "space-y-1";
      div.innerHTML = `
        <div class="flex gap-2 items-center group">
          <input type="text" class="kv-key w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none transition-all">
          <input type="number" class="kv-val w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none transition-all">
          <button type="button" class="remove-row flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all w-6 h-6"><i class="fa-solid fa-xmark text-[10px]"></i></button>
        </div>
        <span class="error-msg hidden text-[9px] text-rose-500 font-bold ml-1">${t('editor.vehicle.invalid_regex')}</span>
      `;
      container.appendChild(div);
      const kInp = div.querySelector('.kv-key');
      const vInp = div.querySelector('.kv-val');
      const error = div.querySelector('.error-msg');
      
      kInp.value = k;
      vInp.value = v;

      kInp.oninput = () => {
        const invalid = !isBasicValidRegex(kInp.value);
        kInp.classList.toggle('border-rose-500', invalid);
        error.classList.toggle('hidden', !invalid);
        updatePreview();
      };
      vInp.oninput = updatePreview;
      div.querySelector('.remove-row').onclick = () => { div.remove(); updatePreview(); };
    };

    const updatePreview = () => {
      const extendObj = {};
      document.querySelectorAll('#extend-kv-container > div').forEach(row => {
        const k = row.querySelector('.kv-key').value;
        const v = parseInt(row.querySelector('.kv-val').value);
        if (k) extendObj[k] = isNaN(v) ? 0 : v;
      });

      fullDataStore.object = parseInt(document.getElementById('v-object').value) || 0;
      fullDataStore.is_matchless = document.getElementById('v-matchless').checked;
      
      fullDataStore.pattern = {
        base: Array.from(document.querySelectorAll('.base-input')).map(i => i.value).filter(v => v !== ''),
        extend: extendObj
      };

      preview.textContent = JSON.stringify(fullDataStore, null, 2);
    };

    /** * Import handler */
    document.getElementById('import-mscv').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let raw = event.target.result;
          raw = raw.replace(/,\s*([\]}])/g, '$1'); // Clean trailing commas
          const data = JSON.parse(raw);
          
          fullDataStore = data;

          // Clear UI
          document.getElementById('base-container').innerHTML = '';
          document.getElementById('extend-kv-container').innerHTML = '';

          // Set static fields
          document.getElementById('v-object').value = data.object ?? 0;
          document.getElementById('v-matchless').checked = data.is_matchless ?? false;

          // Load Base
          if (data.pattern && Array.isArray(data.pattern.base)) {
            data.pattern.base.forEach(val => addBaseRow(val));
          }

          // Load Extend (Critical part for .NET Regex)
          if (data.pattern && data.pattern.extend) {
            Object.keys(data.pattern.extend).forEach(key => {
               addKVRow(key, data.pattern.extend[key]);
            });
          }

          setTimeout(() => {
            updatePreview();
            window.addSystemLog(t('editor.vehicle.log_import_success'), "success");
          }, 100);

        } catch (err) {
          console.error("Import failed:", err);
          window.addSystemLog(t('editor.vehicle.log_import_error'), "error");
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    // Main Listeners
    document.getElementById('v-object').oninput = updatePreview;
    document.getElementById('v-matchless').onchange = updatePreview;
    document.getElementById('add-base-row').onclick = () => addBaseRow();
    document.getElementById('add-extend-row').onclick = () => addKVRow();
    document.getElementById('vehicle-form').onsubmit = (e) => {
      e.preventDefault();
      const objId = fullDataStore.object || '0';
      const fileName = `${objId}.mscv`;
      const blob = new Blob([preview.textContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
    };

    updatePreview();
  }
};