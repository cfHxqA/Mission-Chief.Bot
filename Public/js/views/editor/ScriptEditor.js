// file: /js/views/editor/ScriptEditor.js
// version: 1.1.2.0, 30.04.2026 22:45

import { I18nService } from '../../services/i18n.js';

export const ScriptEditor = {
  availableTriggers: [
    { 
      id: 'mission_start', 
      name: I18nService.t('triggers.mission_start'), 
      cat: 'Einsatz', 
      icon: 'fa-triangle-exclamation',
      functions: [
        { id: 'mission_assign_unit', args: ['number'] },
        { id: 'mission_set_priority', args: ['number'] },
        { id: 'mission_add_note', args: ['string'] }
      ] 
    },
    { 
      id: 'mission_end', 
      name: I18nService.t('triggers.mission_end'), 
      cat: 'Einsatz', 
      icon: 'fa-flag-checkered',
      functions: [{ id: 'mission_archive', args: [] }] 
    },
    { 
      id: 'vehicle_arrived', 
      name: I18nService.t('triggers.vehicle_arrived'), 
      cat: 'Fahrzeug', 
      icon: 'fa-truck-location',
      functions: [{ id: 'unit_start_timer', args: ['number'] }] 
    },
    { 
      id: 'vehicle_status_6', 
      name: I18nService.t('triggers.vehicle_status_6'), 
      cat: 'Fahrzeug', 
      icon: 'fa-ban',
      functions: [{ id: 'unit_set_unavailable', args: [] }] 
    },
    { 
      id: 'station_alarm', 
      name: I18nService.t('triggers.station_alarm'), 
      cat: 'System', 
      icon: 'fa-bell',
      functions: [
        { id: 'station_play_audio', args: ['string'] },
        { id: 'station_toggle_lights', args: ['bool'] }
      ] 
    },
    { id: 'variable_change', name: I18nService.t('triggers.variable_change'), cat: 'Status', icon: 'fa-arrow-rotate-left', functions: [] },
    { id: 'patient_treated', name: I18nService.t('triggers.patient_treated'), cat: 'Einsatz', icon: 'fa-user-nurse', functions: [{ id: 'mission_update_patient', args: ['number'] }] },
    { id: 'timer_elapsed', name: I18nService.t('triggers.timer_elapsed'), cat: 'System', icon: 'fa-stopwatch', functions: [{ id: 'sys_notify', args: ['string'] }] },
    { id: 'msg_received', name: I18nService.t('triggers.msg_received'), cat: 'System', icon: 'fa-envelope', functions: [] },
    { id: 'status_changed', name: I18nService.t('triggers.status_changed'), cat: 'Fahrzeug', icon: 'fa-signal', functions: [] }
  ],

  state: {
    searchQuery: '',
    activeCategory: '',
    modalPage: 1,
    itemsPerPage: 6 
  },

  scriptData: {
    name: "Unbenanntes Script",
    author: "",
    version: "1.0.0",
    description: "",
    variables: [],
    triggers: [],
    conditions: [],
    actions: [],
    groups: [] 
  },

  draggingData: null,

  render: async () => {
    const t = (key) => I18nService.t(key);

    return `
      <style>
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.2); border-radius: 20px; }
        .badge-active { background-color: var(--color-brand-base, #6366f1) !important; color: white !important; }
        .modal-bg { backdrop-filter: blur(12px); background-color: rgba(7, 10, 15, 0.85); }
        .trigger-card:hover { border-color: #10b981; background-color: rgba(16, 185, 129, 0.04); }
        .btn-disabled { opacity: 0.2; cursor: not-allowed !important; filter: grayscale(1); pointer-events: none; }
      </style>
        
      <div class="mb-8 text-left">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">${t('editor.script.title')}</h1>
        <p class="text-sm text-slate-500 mt-1">${t('editor.script.subtitle')}</p>
      </div>

      <div class="view-section w-full h-[calc(100vh-80px)] flex gap-6 text-left select-none overflow-hidden">
        <div class="flex-1 flex gap-6 items-start h-full">
            <aside class="w-72 flex flex-col gap-5 h-full flex-shrink-0 overflow-y-auto custom-scroll pr-1">
              <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col gap-3 flex-shrink-0">
                <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">${t('editor.script.info_title')}</h3>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="flex-1">
                      <label class="text-[8px] font-bold text-slate-400 uppercase">${t('editor.script.label_name')}</label>
                      <input type="text" onchange="ScriptEditor.scriptData.name = this.value" value="${ScriptEditor.scriptData.name}" class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded p-1.5 text-[10px] font-bold outline-none dark:text-white">
                    </div>
                    <div class="w-16">
                      <label class="text-[8px] font-bold text-slate-400 uppercase">${t('editor.script.label_version')}</label>
                      <input type="text" onchange="ScriptEditor.scriptData.version = this.value" value="${ScriptEditor.scriptData.version}" placeholder="1.0.0" class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded p-1.5 text-[10px] font-bold outline-none dark:text-white text-center">
                    </div>
                  </div>
                  <div>
                    <label class="text-[8px] font-bold text-slate-400 uppercase">${t('editor.script.label_author')}</label>
                    <input type="text" onchange="ScriptEditor.scriptData.author = this.value" placeholder="${t('editor.script.placeholder_author')}" value="${ScriptEditor.scriptData.author}" class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded p-1.5 text-[10px] font-bold outline-none dark:text-white">
                  </div>
                  <div>
                    <label class="text-[8px] font-bold text-slate-400 uppercase">${t('editor.script.label_desc')}</label>
                    <textarea onchange="ScriptEditor.scriptData.description = this.value" placeholder="${t('editor.script.placeholder_desc')}" class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded p-1.5 text-[10px] font-bold outline-none dark:text-white h-16 resize-none custom-scroll">${ScriptEditor.scriptData.description}</textarea>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col min-h-0 flex-shrink-0">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">${t('editor.script.var_title')}</h3>
                  <button onclick="ScriptEditor.addVariable()" class="w-6 h-6 rounded-lg bg-brand-base/10 text-brand-base hover:bg-brand-base hover:text-white transition-all flex items-center justify-center border border-brand-base/10"><i class="fa-solid fa-plus text-[10px]"></i></button>
                </div>
                <div id="variable-list" class="space-y-2"></div>
              </div>

              <div class="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex-shrink-0">
                <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">${t('editor.script.blocks_title')}</h3>
                <div class="space-y-1.5">
                  <button onclick="ScriptEditor.toggleModal(true)" class="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-base transition-all flex items-center gap-3 group">
                    <div class="w-7 h-7 rounded bg-brand-base/10 flex items-center justify-center text-brand-base group-hover:bg-brand-base group-hover:text-white transition-all"><i class="fa-solid fa-bolt text-[10px]"></i></div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('editor.script.btn_triggers')}</span>
                  </button>
                  <button onclick="ScriptEditor.addItem('conditions')" class="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-base transition-all flex items-center gap-3 group">
                    <div class="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all"><i class="fa-solid fa-filter text-[10px]"></i></div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('editor.script.btn_conditions')}</span>
                  </button>
                  <button onclick="ScriptEditor.addItem('actions')" class="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-base transition-all flex items-center gap-3 group">
                    <div class="w-7 h-7 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all"><i class="fa-solid fa-play text-[10px]"></i></div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('editor.script.btn_actions')}</span>
                  </button>
                  <div class="h-[1px] bg-slate-100 dark:bg-slate-800 my-3"></div>
                  <button onclick="ScriptEditor.addGroup()" class="w-full p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500 transition-all flex items-center gap-3 group">
                    <div class="w-7 h-7 rounded bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all"><i class="fa-solid fa-layer-group text-[10px]"></i></div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${t('editor.script.btn_group')}</span>
                  </button>
                </div>

                <div class="flex gap-2 mt-4">
                   <button onclick="ScriptEditor.resetScript()" class="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-500 font-bold py-2.5 rounded-lg transition-all uppercase text-[10px] tracking-[0.1em] flex items-center justify-center gap-2 border border-transparent hover:border-red-500/20">
                     <i class="fa-solid fa-trash-can"></i> ${t('editor.script.btn_reset')}
                   </button>
                   <button id="save-script" class="flex-[2] bg-slate-800 dark:bg-slate-700 hover:bg-brand-base text-white font-bold py-2.5 rounded-lg transition-all uppercase text-[10px] tracking-[0.1em] flex items-center justify-center gap-2">
                     <i class="fa-solid fa-download"></i> ${t('editor.script.btn_export')}
                   </button>
                </div>
              </div>
            </aside>

            <div class="flex-[0.5] flex flex-col min-w-0">
               <main id="builder-canvas" class="flex-1 bg-white dark:bg-brand-panel/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-y-auto custom-scroll shadow-inner">
                  <div class="p-10 pb-60 w-full max-w-xl mx-auto space-y-10">
                     <div id="triggers-area"></div>
                     <div id="conditions-area"></div>
                     <div id="actions-area"></div>
                     <div id="groups-container-top" class="space-y-10 pt-6"></div>
                  </div>
               </main>
            </div>
        </div>

        <div id="trigger-modal" class="fixed inset-0 z-[100] modal-bg flex items-center justify-center hidden opacity-0 transition-opacity duration-300">
          <div class="bg-white dark:bg-brand-panel w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[460px]">
              <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                  <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">${t('editor.script.modal_title')}</h2>
                  <button onclick="ScriptEditor.toggleModal(false)" class="text-slate-400 hover:text-red-500 transition-colors"><i class="fa-solid fa-circle-xmark text-xl"></i></button>
              </div>
              <div class="px-6 py-2 space-y-4">
                  <div class="relative w-full">
                      <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 text-[12px]"></i>
                      <input type="text" id="trigger-search" placeholder="${t('editor.script.placeholder_search')}" oninput="ScriptEditor.handleSearch(this.value)" class="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-[12px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-base">
                  </div>
                  <div id="trigger-badges" class="flex gap-2 flex-wrap"></div>
              </div>
              <div id="trigger-grid" class="flex-1 overflow-y-auto px-6 grid grid-cols-3 gap-4 custom-scroll content-start pt-2"></div>
              <div id="modal-pagination" class="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center gap-2"></div>
          </div>
        </div>
      </div>
    `;
  },

  addVariable: () => { 
    ScriptEditor.scriptData.variables.push({ id: Date.now(), name: "var_" + Date.now().toString().slice(-3), type: "number", config: { init: 0, items: "string" } }); 
    ScriptEditor.renderAll(); 
  },

  renderAll: () => {
    const list = document.getElementById('variable-list');
    if(!list) return;

    list.innerHTML = ScriptEditor.scriptData.variables.map(v => {
        let specificUI = "";
        if(v.type === 'number') specificUI = `<input type="number" onchange="ScriptEditor.updateVariableConfig(${v.id}, 'init', this.value)" value="${v.config.init}" class="bg-slate-50 dark:bg-slate-900 border-none rounded p-1 text-[10px] w-12 text-center outline-none">`;
        if(v.type === 'string') specificUI = `<input type="text" onchange="ScriptEditor.updateVariableConfig(${v.id}, 'init', this.value)" value="${v.config.init}" class="bg-slate-50 dark:bg-slate-900 border-none rounded p-1 text-[10px] w-12 truncate outline-none">`;
        if(v.type === 'array') specificUI = `<select onchange="ScriptEditor.updateVariableConfig(${v.id}, 'items', this.value)" class="bg-slate-50 dark:bg-slate-900 border-none rounded p-1 text-[10px] w-12 outline-none"><option value="string" ${v.config.items==='string'?'selected':''}>Aa</option><option value="number" ${v.config.items==='number'?'selected':''}>#</option></select>`;

        return `
        <div class="group p-2 rounded-lg bg-white dark:bg-brand-panel border border-slate-100 dark:border-slate-800 shadow-sm transition-all h-10 flex items-center flex-shrink-0">
            <div class="flex items-center gap-2 w-full h-full">
                <select onchange="ScriptEditor.updateVariable(${v.id}, 'type', this.value); ScriptEditor.renderAll();" class="bg-slate-100 dark:bg-slate-900 border-none text-[10px] font-black p-1 rounded focus:ring-0 uppercase text-brand-base cursor-pointer outline-none">
                  <option value="number" ${v.type==='number'?'selected':''}>#</option>
                  <option value="string" ${v.type==='string'?'selected':''}>Aa</option>
                  <option value="bool" ${v.type==='bool'?'selected':''}>Y/N</option>
                  <option value="array" ${v.type==='array'?'selected':''}>[]</option>
                </select>
                <div class="flex-1 flex items-center"><input type="text" onchange="ScriptEditor.updateVariable(${v.id}, 'name', this.value)" value="${v.name}" class="bg-transparent border-none text-[10px] font-bold dark:text-slate-200 p-0 focus:ring-0 w-full outline-none"></div>
                <div class="flex items-center gap-1">${specificUI}</div>
                <button onclick="ScriptEditor.deleteVariable(${v.id})" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all w-6 h-full flex items-center justify-center"><i class="fa-solid fa-xmark text-xs"></i></button>
            </div>
        </div>`;
    }).join('');

    const hasGroups = ScriptEditor.scriptData.groups.length > 0;
    ['triggers', 'conditions', 'actions'].forEach(cat => {
        const area = document.getElementById(`${cat}-area`);
        if (cat === 'actions' && hasGroups && ScriptEditor.scriptData.actions.length === 0) area.classList.add('hidden');
        else { 
          area.classList.remove('hidden'); 
          area.innerHTML = `
            <div class="flex items-center gap-5 mb-6 opacity-40">
              <h2 class="text-[9px] font-black tracking-[0.4em] uppercase text-slate-500">${I18nService.t('editor.script.btn_' + cat)}</h2>
              <div class="flex-1 h-[1px] bg-slate-300 dark:bg-slate-800"></div>
            </div>
            <div class="drop-zone" ondragover="event.preventDefault()" ondrop="ScriptEditor.handleDrop(event, '${cat}', -1, null)">
              ${ScriptEditor.scriptData[cat].map((item, i) => ScriptEditor.renderBlock(item, cat, i, null)).join('')}
            </div>`; 
        }
    });
    document.getElementById('groups-container-top').innerHTML = ScriptEditor.scriptData.groups.map(g => ScriptEditor.renderGroup(g, 1)).join('');
  },

  after_render: async () => {
    ScriptEditor.renderAll();
    document.getElementById('save-script').onclick = () => {
        const data = JSON.stringify(ScriptEditor.scriptData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const a = document.createElement('a');
        const randomID = Math.random().toString(36).substring(2, 8).toUpperCase();
        const fileName = `logic_${randomID}.mscf`;
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    };
  },

  toggleModal: (show) => { 
    const modal = document.getElementById('trigger-modal'); 
    if (show) { 
        modal.classList.remove('hidden'); 
        setTimeout(() => modal.classList.add('opacity-100'), 10); 
        ScriptEditor.state.modalPage = 1; 
        ScriptEditor.state.activeCategory = I18nService.t('editor.script.cat_all');
        ScriptEditor.renderModal(); 
    } else { 
        modal.classList.remove('opacity-100'); 
        setTimeout(() => modal.classList.add('hidden'), 300); 
    } 
  },

  renderModal: () => {
    const allLabel = I18nService.t('editor.script.cat_all');
    const cats = [allLabel, ...new Set(ScriptEditor.availableTriggers.map(t => t.cat))];
    document.getElementById('trigger-badges').innerHTML = cats.map(c => `<button onclick="ScriptEditor.filterCategory('${c}')" class="px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase transition-colors ${ScriptEditor.state.activeCategory === c ? 'bg-brand-base text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-base'}">${c}</button>`).join('');
    
    const filtered = ScriptEditor.availableTriggers.filter(t => (t.name.toLowerCase().includes(ScriptEditor.state.searchQuery) && (ScriptEditor.state.activeCategory === allLabel || t.cat === ScriptEditor.state.activeCategory)));
    const totalPages = Math.ceil(filtered.length / ScriptEditor.state.itemsPerPage);
    const start = (ScriptEditor.state.modalPage - 1) * ScriptEditor.state.itemsPerPage;
    const paginated = filtered.slice(start, start + ScriptEditor.state.itemsPerPage);
    
    document.getElementById('trigger-grid').innerHTML = paginated.map(t => `<button onclick="ScriptEditor.addSpecificTrigger('${t.id}')" class="trigger-card p-2 h-22 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 text-center transition-all group outline-none"><div class="w-9 h-9 rounded-lg bg-white dark:bg-brand-panel flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 group-hover:text-[#10b981] transition-colors"><i class="fa-solid ${t.icon} text-base"></i></div><div><div class="text-[12px] font-black uppercase leading-tight text-slate-700 dark:text-slate-200">${t.name}</div><div class="text-[9px] font-bold text-slate-500 uppercase mt-0.5">${t.cat}</div></div></button>`).join('');
    
    let pagHTML = `<button onclick="ScriptEditor.changeModalPage(-1)" class="w-8 h-8 rounded border dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 ${ScriptEditor.state.modalPage === 1 ? 'opacity-20 pointer-events-none' : ''}"><i class="fa-solid fa-chevron-left text-[10px]"></i></button>`;
    for(let i=1; i<=totalPages; i++) pagHTML += `<button onclick="ScriptEditor.setModalPage(${i})" class="w-8 h-8 rounded text-[10px] font-bold transition-all ${i === ScriptEditor.state.modalPage ? 'bg-brand-base text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}">${i}</button>`;
    pagHTML += `<button onclick="ScriptEditor.changeModalPage(1)" class="w-8 h-8 rounded border dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 ${ScriptEditor.state.modalPage === totalPages || totalPages === 0 ? 'opacity-20 pointer-events-none' : ''}"><i class="fa-solid fa-chevron-right text-[10px]"></i></button>`;
    document.getElementById('modal-pagination').innerHTML = (totalPages > 1) ? pagHTML : '';
  },

  handleSearch: (val) => { ScriptEditor.state.searchQuery = val.toLowerCase(); ScriptEditor.state.modalPage = 1; ScriptEditor.renderModal(); },
  filterCategory: (cat) => { ScriptEditor.state.activeCategory = cat; ScriptEditor.state.modalPage = 1; ScriptEditor.renderModal(); },
  setModalPage: (p) => { ScriptEditor.state.modalPage = p; ScriptEditor.renderModal(); },
  changeModalPage: (dir) => { ScriptEditor.state.modalPage += dir; ScriptEditor.renderModal(); },
  addSpecificTrigger: (id) => { const tDef = ScriptEditor.availableTriggers.find(t => t.id === id); if(tDef) { ScriptEditor.scriptData.triggers.push({ id: Date.now(), type: 'trigger', event: id, name: tDef.name, icon: tDef.icon, params: { description: "" } }); ScriptEditor.toggleModal(false); ScriptEditor.renderAll(); } },
  findContainerById: (id, rootArray) => { for (let g of rootArray) { if (g.id === id) return g; if (g.groups.length > 0) { const f = ScriptEditor.findContainerById(id, g.groups); if (f) return f; } } return null; },
  deleteVariable: (id) => { ScriptEditor.scriptData.variables = ScriptEditor.scriptData.variables.filter(v => v.id !== id); ScriptEditor.renderAll(); },
  updateVariable: (id, field, value) => { const v = ScriptEditor.scriptData.variables.find(x => x.id === id); if(v) v[field] = value; },
  updateVariableConfig: (id, key, val) => { const v = ScriptEditor.scriptData.variables.find(x => x.id === id); if(v) v.config[key] = val; },
  handleDragStart: (e, cat, index, sourceGroupId) => { ScriptEditor.draggingData = { cat, index, sourceGroupId }; },
  handleDrop: (e, targetCat, targetIndex, targetGroupId) => { e.preventDefault(); const src = ScriptEditor.draggingData; if (!src || src.cat !== targetCat) return; let item = (src.sourceGroupId === null) ? ScriptEditor.scriptData[src.cat].splice(src.index, 1)[0] : ScriptEditor.findContainerById(src.sourceGroupId, ScriptEditor.scriptData.groups)[src.cat].splice(src.index, 1)[0]; if (targetGroupId === null) { (targetIndex === -1) ? ScriptEditor.scriptData[targetCat].push(item) : ScriptEditor.scriptData[targetCat].splice(targetIndex, 0, item); } else { const g = ScriptEditor.findContainerById(targetGroupId, ScriptEditor.scriptData.groups); (targetIndex === -1) ? g[targetCat].push(item) : g[targetCat].splice(targetIndex, 0, item); } ScriptEditor.renderAll(); },
  
  addItem: (cat) => { 
    let list = (cat === 'actions' && ScriptEditor.scriptData.groups.length > 0) ? (function deepest(arr){ let l = arr[arr.length-1]; return l.groups.length > 0 ? deepest(l.groups) : l; })(ScriptEditor.scriptData.groups).actions : ScriptEditor.scriptData[cat]; 
    list.push({ id: Date.now(), type: cat.slice(0,-1), params: { description: "", variable: "", operator: "==", value: "", mode: "return_number", functionName: "", args: [] } }); 
    ScriptEditor.renderAll(); 
  },

  updateArg: (gid, id, argIdx, val) => {
    let list = (gid === null) ? ScriptEditor.scriptData['actions'] : ScriptEditor.findContainerById(gid, ScriptEditor.scriptData.groups)['actions'];
    const item = list.find(x => x.id === id);
    if(item) {
      if(!item.params.args) item.params.args = [];
      item.params.args[argIdx] = val;
    }
  },

  addGroup: (parentId = null, depth = 0) => { if (depth >= 3) return; const newG = { id: Date.now(), alias: I18nService.t('editor.script.new_layer'), conditions: [], actions: [], groups: [] }; if (parentId === null) { if (ScriptEditor.scriptData.actions.length > 0) { newG.actions = [...ScriptEditor.scriptData.actions]; ScriptEditor.scriptData.actions = []; } ScriptEditor.scriptData.groups.push(newG); } else ScriptEditor.findContainerById(parentId, ScriptEditor.scriptData.groups).groups.push(newG); ScriptEditor.renderAll(); },
  removeGroup: (id) => { const rem = (arr) => { const idx = arr.findIndex(g => g.id === id); if(idx !== -1){ arr.splice(idx,1); return true; } for(let g of arr) if(g.groups.length > 0 && rem(g.groups)) return true; return false; }; rem(ScriptEditor.scriptData.groups); ScriptEditor.renderAll(); },
  removeItem: (cat, id, gid) => { if (gid === null) ScriptEditor.scriptData[cat] = ScriptEditor.scriptData[cat].filter(i => i.id !== id); else ScriptEditor.findContainerById(gid, ScriptEditor.scriptData.groups)[cat] = ScriptEditor.findContainerById(gid, ScriptEditor.scriptData.groups)[cat].filter(i => i.id !== id); ScriptEditor.renderAll(); },
  updateData: (gid, cat, id, key, val) => { let list = (gid === null) ? ScriptEditor.scriptData[cat] : ScriptEditor.findContainerById(gid, ScriptEditor.scriptData.groups)[cat]; const i = list.find(x => x.id === id); if(i) i.params[key] = val; },
  updateGroupInfo: (id, key, val) => { const g = ScriptEditor.findContainerById(id, ScriptEditor.scriptData.groups); if(g) g[key] = val; ScriptEditor.renderAll(); },
  
  renderBlock: (item, cat, index, groupId = null) => {
    const isTrigger = cat === 'triggers';
    const header = `<div class="flex justify-between items-center ${isTrigger ? '' : 'mb-4'} h-full"><div class="flex items-center gap-3 flex-1 min-w-0"><i class="fa-solid fa-grip-vertical text-slate-300 dark:text-slate-700 text-[10px]"></i>${isTrigger ? `<div class="flex items-center gap-3"><div class="w-6 h-6 rounded bg-brand-base/10 flex items-center justify-center text-brand-base"><i class="fa-solid ${item.icon} text-[10px]"></i></div><span class="text-[10px] font-black uppercase tracking-widest dark:text-white">${item.name}</span></div>` : `<input type="text" placeholder="${I18nService.t('editor.script.placeholder_block_desc')}" onchange="ScriptEditor.updateData(${groupId}, '${cat}', ${item.id}, 'description', this.value)" value="${item.params.description || ''}" class="bg-transparent border-none text-[10px] font-bold text-slate-500 p-0 focus:ring-0 w-full uppercase tracking-widest italic truncate outline-none">`}</div><button onclick="ScriptEditor.removeItem('${cat}', ${item.id}, ${groupId})" class="text-slate-400 hover:text-red-500 transition-all flex-shrink-0 pl-2 self-center h-full flex items-center"><i class="fa-solid fa-trash-can text-[10px]"></i></button></div>`;
    if (isTrigger) return `<div draggable="true" ondragstart="ScriptEditor.handleDragStart(event, '${cat}', ${index}, ${groupId})" ondrop="ScriptEditor.handleDrop(event, '${cat}', index, groupId)" ondragover="event.preventDefault()" class="group bg-white dark:bg-brand-panel border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex flex-col shadow-sm hover:border-brand-base transition-all mb-4 cursor-move relative overflow-hidden"><div class="absolute top-0 left-0 w-1 h-full bg-brand-base"></div>${header}</div>`;
    
    let content = "";
    if (cat === 'conditions') {
        const hasVars = ScriptEditor.scriptData.variables.length > 0;
        const v = ScriptEditor.scriptData.variables.find(x => x.name === item.params.variable);
        const type = v ? v.type : 'number';
        let ops = ['==', '!='];
        if(type === 'number') ops = ['==', '!=', '>', '<', '>=', '<='];
        if(type === 'string') ops = ['==', '!=', 'contains', 'starts_with', 'ends_with'];
        if(type === 'bool') ops = ['is_true', 'is_false'];
        if(type === 'array') ops = ['contains', 'is_empty', 'length_is'];
        
        content = hasVars ? `<select onchange="ScriptEditor.updateData(${groupId}, 'conditions', ${item.id}, 'variable', this.value); ScriptEditor.renderAll();" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold dark:text-white outline-none"><option value="">-- VAR --</option>${ScriptEditor.scriptData.variables.map(v => `<option value="${v.name}" ${v.name === item.params.variable ? 'selected':''}>${v.name}</option>`).join('')}</select><select onchange="ScriptEditor.updateData(${groupId}, 'conditions', ${item.id}, 'operator', this.value)" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-brand-base outline-none">${ops.map(op => `<option value="${op}" ${item.params.operator === op ? 'selected':''}>${op}</option>`).join('')}</select><input type="text" placeholder="Wert" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 text-[10px] flex-1 outline-none">` : `<div class="flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-[9px] text-slate-400 italic flex items-center justify-center gap-2"><i class="fa-solid fa-circle-info"></i> ${I18nService.t('editor.script.var_none')}</div>`;
    } else {
        const mode = item.params.mode || 'return_number';
        const modes = [{v:'return_number', l:'#', c:'bg-brand-base'}, {v:'return_string', l:'Aa', c:'bg-amber-500'}, {v:'return_bool', l:'Y/N', c:'bg-emerald-500'}, {v:'return_array', l:'[]', c:'bg-purple-500'}, {v:'return_var', l:'VAR', c:'bg-slate-600'}, {v:'execute_fn', l:'FN', c:'bg-indigo-500'}];
        let actionUI = "";
        if (mode === 'execute_fn') {
          const activeTriggerIds = ScriptEditor.scriptData.triggers.map(t => t.event);
          const availableFunctions = ScriptEditor.availableTriggers.filter(at => activeTriggerIds.includes(at.id)).flatMap(at => at.functions || []);
          actionUI = `<div class="flex flex-col gap-2 w-full"><select onchange="ScriptEditor.updateData(${groupId}, 'actions', ${item.id}, 'functionName', this.value); ScriptEditor.updateData(${groupId}, 'actions', ${item.id}, 'args', []); ScriptEditor.renderAll();" class="bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-[10px] font-bold flex-1 outline-none text-indigo-500"><option value="">-- FUNKTION --</option>${availableFunctions.map(fn => `<option value="${fn.id}" ${item.params.functionName === fn.id ? 'selected' : ''}>${fn.id}()</option>`).join('')}</select>`;
          const selectedFnDef = availableFunctions.find(f => f.id === item.params.functionName);
          if (selectedFnDef && selectedFnDef.args && selectedFnDef.args.length > 0) {
            actionUI += `<div class="grid grid-cols-2 gap-2 mt-1">`;
            selectedFnDef.args.forEach((type, argIdx) => {
              const matchingVars = ScriptEditor.scriptData.variables.filter(v => v.type === type);
              const currentVal = (item.params.args && item.params.args[argIdx]) ? item.params.args[argIdx] : "";
              actionUI += `<div class="flex items-center gap-2 bg-indigo-500/5 p-1.5 rounded-lg border border-indigo-500/10"><span class="text-[8px] font-black text-indigo-400 uppercase w-4">${type.charAt(0)}</span>${matchingVars.length > 0 ? `<select onchange="ScriptEditor.updateArg(${groupId}, ${item.id}, ${argIdx}, this.value)" class="bg-transparent border-none text-[9px] font-bold dark:text-white outline-none flex-1"><option value="">-- ${type.toUpperCase()} --</option>${matchingVars.map(v => `<option value="${v.name}" ${currentVal === v.name ? 'selected' : ''}>${v.name}</option>`).join('')}</select>` : `<span class="text-[8px] text-slate-400 italic">${I18nService.t('editor.script.fn_arg_none')}</span>`}</div>`;
            });
            actionUI += `</div>`;
          }
          actionUI += `</div>`;
        } else if (mode === 'return_var') {
          actionUI = ScriptEditor.scriptData.variables.map(v => `<button onclick="ScriptEditor.updateData(${groupId}, 'actions', ${item.id}, 'target', '${v.name}'); ScriptEditor.renderAll();" class="px-2 py-1 rounded text-[10px] font-bold transition-all border ${item.params.target === v.name ? 'bg-brand-base text-white border-brand-base' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-brand-base'}">${v.name}</button>`).join('') || `<span class="text-[9px] text-slate-400 italic w-full text-center">${I18nService.t('editor.script.var_none')}</span>`;
        } else {
          actionUI = `<input type="text" placeholder="Wert..." class="bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-[10px] flex-1 outline-none">`;
        }
        content = `<div class="flex flex-col gap-3 w-full"><div class="flex gap-1.5 items-center">${modes.map(m => `<button onclick="ScriptEditor.updateData(${groupId}, 'actions', ${item.id}, 'mode', '${m.v}'); ScriptEditor.renderAll();" class="px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${mode === m.v ? m.c + ' text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-base'}">${m.l}</button>`).join('')}</div><div class="flex flex-wrap gap-2 items-center bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50 min-h-[40px]">${actionUI}</div></div>`;
    }
    return `<div draggable="true" ondragstart="ScriptEditor.handleDragStart(event, '${cat}', ${index}, ${groupId})" ondrop="ScriptEditor.handleDrop(event, '${cat}', index, groupId)" ondragover="event.preventDefault()" class="group bg-white dark:bg-brand-panel border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:border-brand-base transition-all mb-6 cursor-move relative overflow-hidden"><div class="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-slate-800 group-hover:bg-brand-base transition-colors"></div>${header}<div class="flex gap-3 border-t dark:border-slate-800/50 pt-5">${content}</div></div>`;
  },
  renderGroup: (group, depth = 1) => { return `<div class="bg-slate-50/50 dark:bg-brand-panel/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 relative mb-10 transition-all"><div class="absolute -top-3.5 left-10 px-6 py-1.5 bg-slate-900 text-white dark:bg-slate-800 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl border border-white/5">${I18nService.t('editor.script.level')} // 0${depth}</div><div class="flex justify-between items-center mb-8"><input type="text" onchange="ScriptEditor.updateGroupInfo(${group.id}, 'alias', this.value)" value="${group.alias}" class="bg-transparent border-none text-[9px] font-black dark:text-white p-0 focus:ring-0 tracking-[0.3em] uppercase w-full outline-none"><div class="flex gap-2 items-center">${depth < 3 ? `<button onclick="ScriptEditor.addGroup(${group.id}, ${depth})" class="text-brand-base opacity-40 hover:opacity-100 hover:text-emerald-500 transition-all"><i class="fa-solid fa-folder-plus text-xl"></i></button>` : ''}<button onclick="ScriptEditor.removeGroup(${group.id})" class="text-slate-400 opacity-40 hover:opacity-100 hover:text-red-500 transition-all"><i class="fa-solid fa-circle-xmark text-xl"></i></button></div></div><div class="space-y-8">${['conditions', 'actions'].map(cat => `<div class="drop-zone" ondragover="event.preventDefault()" ondrop="ScriptEditor.handleDrop(event, '${cat}', -1, ${group.id})"><div class="flex items-center gap-4 mb-6 opacity-20"><span class="text-[8px] font-black uppercase tracking-widest text-slate-500">${I18nService.t('editor.script.btn_' + cat)}</span><div class="flex-1 h-[1px] bg-slate-500"></div></div>${group[cat].map((item, i) => ScriptEditor.renderBlock(item, cat, i, group.id)).join('')}</div>`).join('')}<div class="space-y-10 pl-6 border-l-2 border-slate-200 dark:border-slate-800/50 mt-10">${group.groups.map(subGroup => ScriptEditor.renderGroup(subGroup, depth + 1)).join('')}</div></div></div>`; },
  resetScript: () => { if(confirm(I18nService.t('editor.script.confirm_reset'))) { ScriptEditor.scriptData = { name: "Unbenanntes Script", author: "", version: "1.0.0", description: "", variables: [], triggers: [], conditions: [], actions: [], groups: [] }; ScriptEditor.renderAll(); } },
};

window.ScriptEditor = ScriptEditor;