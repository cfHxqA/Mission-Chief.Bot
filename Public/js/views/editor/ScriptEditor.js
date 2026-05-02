// file: /js/views/editor/ScriptEditor.js
// version: 1.0.1.0, 02.05.2026

import { I18nService } from '../../services/i18n.js';

export const ScriptEditor = {
  // ==========================================
  // ROUTER LIFECYCLE
  // ==========================================
  render: async () => {
    return await ScriptEditor.UI.mount();
  },
  
  after_render: async () => {
    await ScriptEditor.UI.afterMount();
  },

  // ==========================================
  // 1. REGISTRY
  // ==========================================
  Registry: {
    VariableTypes: {
      number:       { get label() { return I18nService.t('editor.script.reg_type_number'); }, default: 0 },
      string:       { get label() { return I18nService.t('editor.script.reg_type_string'); }, default: '' },
      boolean:      { get label() { return I18nService.t('editor.script.reg_type_boolean'); }, default: false },
      array_string: { get label() { return I18nService.t('editor.script.reg_type_array_string'); }, default: [] },
      array_number: { get label() { return I18nService.t('editor.script.reg_type_array_number'); }, default: [] }
    },
    Operators: {
      equals:         { label: '==', types: ['number', 'string', 'boolean'] },
      notEquals:      { label: '!=', types: ['number', 'string', 'boolean'] },
      greaterThan:    { label: '>',  types: ['number'] },
      lessThan:       { label: '<',  types: ['number'] },
      contains:       { get label() { return I18nService.t('editor.script.reg_op_contains'); }, types: ['string', 'array_string', 'array_number'] },
      notContains:    { get label() { return I18nService.t('editor.script.reg_op_notContains'); }, types: ['string', 'array_string', 'array_number'] },
      startsWith:     { get label() { return I18nService.t('editor.script.reg_op_startsWith'); }, types: ['string'] }
    },
    Triggers: {
      alliance_message:         { exports: [{name: 'msg_id', type: 'number'}] },
      bed_expanded:             { exports: [{name: 'station_id', type: 'number'}, {name: 'capacity', type: 'number'}] },
      building_fire:            { exports: [{name: 'station_id', type: 'number'}] },
      chat_message_received:    { exports: [{name: 'user_id', type: 'number'}, {name: 'message', type: 'string'}] },
      credits_changed:          { exports: [{name: 'amount_diff', type: 'number'}, {name: 'current_balance', type: 'number'}] },
      daily_login:              { exports: [{name: 'user_id', type: 'number'}] },
      level_up:                 { exports: [{name: 'new_level', type: 'number'}] },
      mission_canceled:         { exports: [{name: 'mission_id', type: 'number'}] },
      mission_completed:        { exports: [{name: 'mission_id', type: 'number'}, {name: 'reward', type: 'number'}] },
      mission_failed:           { exports: [{name: 'mission_id', type: 'number'}] },
      mission_generated:        { exports: [{name: 'mission_id', type: 'number'}] },
      mission_started:          { exports: [{name: 'mission_id', type: 'number'}] },
      mission_unit_assigned:    { exports: [{name: 'mission_id', type: 'number'}, {name: 'vehicle_id', type: 'number'}] },
      personnel_fired:          { exports: [{name: 'person_id', type: 'number'}] },
      personnel_hired:          { exports: [{name: 'person_id', type: 'number'}] },
      personnel_injured:        { exports: [{name: 'person_id', type: 'number'}] },
      personnel_promoted:       { exports: [{name: 'person_id', type: 'number'}, {name: 'new_rank', type: 'string'}] },
      personnel_training_end:   { exports: [{name: 'person_id', type: 'number'}, {name: 'course_id', type: 'number'}] },
      personnel_training_start: { exports: [{name: 'person_id', type: 'number'}, {name: 'course_id', type: 'number'}] },
      player_banned:            { exports: [{name: 'user_id', type: 'number'}] },
      shift_ended:              { exports: [{name: 'person_id', type: 'number'}] },
      shift_started:            { exports: [{name: 'person_id', type: 'number'}] },
      station_built:            { exports: [{name: 'station_id', type: 'number'}] },
      station_destroyed:        { exports: [{name: 'station_id', type: 'number'}] },
      station_upgraded:         { exports: [{name: 'station_id', type: 'number'}, {name: 'level', type: 'number'}] },
      vehicle_arrived:          { exports: [{name: 'vehicle_id', type: 'number'}, {name: 'station_id', type: 'number'}] },
      vehicle_bought:           { exports: [{name: 'vehicle_id', type: 'number'}, {name: 'cost', type: 'number'}] },
      vehicle_damaged:          { exports: [{name: 'vehicle_id', type: 'number'}, {name: 'damage_percent', type: 'number'}] },
      vehicle_departed:         { exports: [{name: 'vehicle_id', type: 'number'}] },
      vehicle_refueled:         { exports: [{name: 'vehicle_id', type: 'number'}] },
      vehicle_status_changed:   { exports: [{name: 'vehicle_id', type: 'number'}, {name: 'new_status', type: 'number'}] },
      weather_changed:          { exports: [{name: 'weather_id', type: 'number'}] }
    },
    Functions: {
      notify_user: { get name() { return I18nService.t('editor.script.reg_fn_notify'); }, icon: 'fa-comment' },
      log_event:   { get name() { return I18nService.t('editor.script.reg_fn_log'); }, icon: 'fa-list' }
    },
    ActionTypes: {
      setVariable:    { get label() { return I18nService.t('editor.script.reg_act_set'); }, icon: 'fa-pen' },
      returnVariable: { get label() { return I18nService.t('editor.script.reg_act_ret'); }, icon: 'fa-reply' },
      callFunction:   { get label() { return I18nService.t('editor.script.reg_act_call'); }, icon: 'fa-bolt' }
    }
  },

  // ==========================================
  // 2. STATE
  // ==========================================
  State: {
    ui: {
      mode: null,
      step: 1,
      dragInfo: null, 
      triggerPage: 1
    },
    script: {
      author: "", 
      scriptName: "", 
      scriptVersion: "1.0.0.0",
      variables: [],
      selectedTriggers: [], 
      conditionMode: 'single', 
      conditions: [],
      groups: [],
      actions: []
    }
  },

  // ==========================================
  // 3. CORE LOGIC
  // ==========================================
  Core: {
    init: () => {
      ScriptEditor.State.ui.mode = null;
      ScriptEditor.State.ui.step = 1;
      ScriptEditor.State.ui.dragInfo = null;
      ScriptEditor.State.ui.triggerPage = 1; 
      ScriptEditor.State.script = { 
        author: I18nService.t('editor.script.default_author'), 
        scriptName: I18nService.t('editor.script.default_script_name'), 
        scriptVersion: "1.0.0.0", 
        variables: [], selectedTriggers: [], conditionMode: 'single', conditions: [], groups: [], actions: [] 
      };
      ScriptEditor.UI.render();
    },

    getGlobalVariables: () => {
      let globals = [
        { id: 'sys.time', label: I18nService.t('editor.script.sys_time'), type: 'number' },
        { id: 'sys.is_night', label: I18nService.t('editor.script.sys_night'), type: 'boolean' }
      ];
      ScriptEditor.State.script.selectedTriggers.forEach(tId => {
        const config = ScriptEditor.Registry.Triggers[tId];
        if (config && config.exports) {
          config.exports.forEach(exp => {
            if (!globals.some(g => g.id === `event.${exp.name}`)) {
              globals.push({ id: `event.${exp.name}`, label: `${I18nService.t('editor.script.event_prefix')}${exp.name}`, type: exp.type });
            }
          });
        }
      });
      return globals;
    },

    getContextVariables: () => {
      return [
        ...ScriptEditor.Core.getGlobalVariables(),
        ...ScriptEditor.State.script.variables.map(v => ({ id: v.name, label: `${I18nService.t('editor.script.custom_prefix')}${v.name}`, type: v.type }))
      ];
    },

    importScript: (file) => {
      if (!file.name.endsWith('.mscf')) return alert(I18nService.t('editor.script.alert_invalid_file'));
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          ScriptEditor.State.script = {
            author: imported.author || I18nService.t('editor.script.default_author'),
            scriptName: imported.scriptName || I18nService.t('editor.script.default_script_name'),
            scriptVersion: imported.scriptVersion || "1.0.0.0",
            variables: imported.variables || [],
            selectedTriggers: imported.triggers || [],
            conditionMode: imported.conditionMode || 'single',
            conditions: imported.conditions || [],
            groups: (imported.groups || []).map(g => ({
              operator: g.operator || 'OR',
              conditions: g.conditions || [],
              actions: g.actions || []
            })),
            actions: imported.actions || []
          };
          ScriptEditor.State.ui.mode = 'import';
          ScriptEditor.State.ui.step = 1;
          ScriptEditor.State.ui.triggerPage = 1;
          ScriptEditor.UI.render();
        } catch (err) { alert(I18nService.t('editor.script.alert_read_error')); }
      };
      reader.readAsText(file);
    },

    exportScript: () => {
      const state = ScriptEditor.State.script;
      const exportData = {
        author: state.author,
        scriptName: state.scriptName,
        scriptVersion: state.scriptVersion,
        variables: state.variables,
        triggers: state.selectedTriggers, 
        conditionMode: state.conditionMode,
        ...(state.conditionMode === 'single' ? { conditions: state.conditions } : { groups: state.groups }),
        actions: state.actions
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportData.scriptName.replace(/\s+/g, '_')}_v${exportData.scriptVersion}.mscf`;
      a.click();
    }
  },

  // ==========================================
  // 4. USER INTERFACE
  // ==========================================
  UI: {
    mount: async () => {
      return `
        <div class="se-wrapper" id="se-root"></div>
        <input type="file" id="se-file-import" hidden accept=".mscf" onchange="ScriptEditor.Core.importScript(event.target.files[0])">
      `;
    },

    afterMount: async () => { ScriptEditor.UI.render(); },

    render: () => {
      const root = document.getElementById('se-root');
      if (!root) return;

      if (!ScriptEditor.State.ui.mode) {
        root.innerHTML = ScriptEditor.UI.Templates.choiceScreen();
        return;
      }

      const step = ScriptEditor.State.ui.step;
      const progressWidth = ((step - 1) / 3) * 100;
      
      root.innerHTML = `
        <div class="se-layout">
          <div class="se-main-window">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-xl font-black tracking-tight text-slate-800 dark:text-white">${ScriptEditor.State.script.scriptName}</h2>
                <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">v${ScriptEditor.State.script.scriptVersion} | ${I18nService.t('editor.script.s1_author')}: ${ScriptEditor.State.script.author}</p>
              </div>
            </div>

            <div class="se-steps">
              <div class="se-progress-fill" style="width: ${progressWidth}%"></div>
              ${[1,2,3,4].map(i => `<div id="step-dot-${i}" class="se-step-dot ${step >= i ? 'active' : ''}" onclick="ScriptEditor.Actions.goToStep(${i})">${i}</div>`).join('')}
            </div>

            <div id="se-step-content" class="transition-all duration-300">
              ${ScriptEditor.UI.getStepContent(step)}
            </div>

            <div class="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button class="se-btn se-btn-outline px-6" onclick="ScriptEditor.Actions.prevStep()" ${step === 1 ? 'style="visibility:hidden"' : ''}>${I18nService.t('editor.script.btn_back')}</button>
              <button class="se-btn se-btn-primary px-8" onclick="${step === 4 ? 'ScriptEditor.Core.exportScript()' : 'ScriptEditor.Actions.nextStep()'}">
                ${step === 4 ? I18nService.t('editor.script.btn_export') : I18nService.t('editor.script.btn_next')}
              </button>
            </div>
          </div>

          <div class="se-side-window">
            ${ScriptEditor.UI.Templates.varSidebar()}
          </div>
        </div>
      `;
    },

    getStepContent: (step) => {
      const t = (key) => I18nService.t(`editor.script.${key}`);

      if (step === 1) return `
        <h3 class="font-bold text-lg mb-4 dark:text-white">${t('s1_title')}</h3>
        <div class="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">${t('s1_script_name')}</label>
              <input type="text" class="se-input" value="${ScriptEditor.State.script.scriptName}" onchange="ScriptEditor.State.script.scriptName=this.value">
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">${t('s1_version')}</label>
              <input type="text" class="se-input" value="${ScriptEditor.State.script.scriptVersion}" onchange="ScriptEditor.State.script.scriptVersion=this.value">
            </div>
            <div class="col-span-2">
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">${t('s1_author')}</label>
              <input type="text" class="se-input" value="${ScriptEditor.State.script.author}" onchange="ScriptEditor.State.script.author=this.value">
            </div>
        </div>
      `;
      
      if (step === 2) {
          const allTriggers = Object.keys(ScriptEditor.Registry.Triggers).sort();
          const itemsPerPage = 25;
          const totalPages = Math.ceil(allTriggers.length / itemsPerPage);
          const currentPage = ScriptEditor.State.ui.triggerPage || 1;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedTriggers = allTriggers.slice(startIndex, startIndex + itemsPerPage);

          return `
            <h3 class="font-bold text-lg mb-2 dark:text-white">${t('s2_title')}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">${t('s2_desc')}</p>
            
            <div class="flex flex-wrap gap-2 min-h-[160px] content-start p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              ${paginatedTriggers.map((key) => {
                  const isSelected = ScriptEditor.State.script.selectedTriggers.includes(key);
                  return `
                  <div class="trigger-pill ${isSelected ? 'active' : ''}" onclick="ScriptEditor.Actions.toggleTrigger('${key}')">
                    ${key}
                  </div>`;
              }).join('')}
            </div>

            ${totalPages > 1 ? `
            <div class="flex justify-center gap-2 mt-4 items-center">
              <button class="se-btn se-btn-outline px-3 py-1" ${currentPage === 1 ? 'disabled' : `onclick="ScriptEditor.Actions.setTriggerPage(${currentPage - 1})"`}>${t('s2_btn_prev')}</button>
              
              <div class="flex gap-1">
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                  <button class="se-btn ${currentPage === p ? 'se-btn-primary' : 'se-btn-outline'} px-3 py-1 text-[10px]" onclick="ScriptEditor.Actions.setTriggerPage(${p})">${p}</button>
                `).join('')}
              </div>

              <button class="se-btn se-btn-outline px-3 py-1" ${currentPage === totalPages ? 'disabled' : `onclick="ScriptEditor.Actions.setTriggerPage(${currentPage + 1})"`}>${t('s2_btn_next')}</button>
            </div>
            ` : ''}
          `;
      }

      if (step === 3) {
        return `
          <h3 class="font-bold text-lg mb-2 dark:text-white">${t('s3_title')}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">${t('s3_desc')}</p>
          
          <!-- BEDINGUNGEN -->
          <div class="se-logic-box border-t-4 border-t-blue-500">
            <div class="flex justify-between items-center mb-6">
              <h4 class="font-black text-sm text-slate-800 dark:text-white"><i class="fa-solid fa-code-branch text-blue-500 mr-2"></i> ${t('s3_cond_title')}</h4>
              <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button class="px-3 py-1 text-[10px] font-bold rounded-md transition ${ScriptEditor.State.script.conditionMode === 'single' ? 'bg-white dark:bg-slate-700 shadow text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}" onclick="ScriptEditor.Actions.setConditionMode('single')">${t('s3_cond_single')}</button>
                <button class="px-3 py-1 text-[10px] font-bold rounded-md transition ${ScriptEditor.State.script.conditionMode === 'group' ? 'bg-white dark:bg-slate-700 shadow text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}" onclick="ScriptEditor.Actions.setConditionMode('group')">${t('s3_cond_group')}</button>
              </div>
            </div>

            ${ScriptEditor.State.script.conditionMode === 'single' ? `
              ${ScriptEditor.State.script.conditions.map((c, cIdx) => ScriptEditor.UI.Templates.conditionRow(null, cIdx, c)).join('')}
              <button class="se-btn se-btn-outline w-full mt-2 border-dashed" onclick="ScriptEditor.Actions.addCondition(null)">${t('s3_cond_add')}</button>
            ` : `
              ${ScriptEditor.State.script.groups.map((g, gIdx) => `
                <div class="se-group-box" draggable="true"
                     ondragstart="ScriptEditor.Actions.onDragStart(event, 'group', ${gIdx}, null)"
                     ondragend="ScriptEditor.Actions.onDragEnd(event)"
                     ondragover="ScriptEditor.Actions.onDragOver(event)"
                     ondragenter="ScriptEditor.Actions.onDragEnter(event)"
                     ondragleave="ScriptEditor.Actions.onDragLeave(event)"
                     ondrop="ScriptEditor.Actions.onDrop(event, 'group', ${gIdx}, null)">
                     
                  <div class="flex justify-between items-center mb-4 pb-2 border-b border-slate-50 dark:border-slate-700">
                    <div class="flex items-center">
                      <i class="fa-solid fa-grip-vertical drag-handle"></i>
                      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">${t('s3_group_title')} ${gIdx + 1}</span>
                    </div>
                    <i class="fa-solid fa-trash text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 cursor-pointer" onclick="ScriptEditor.Actions.removeGroup(${gIdx})" title="${t('s3_group_del_title')}"></i>
                  </div>

                  <!-- Conditions in Group -->
                  ${g.conditions.map((c, cIdx) => ScriptEditor.UI.Templates.conditionRow(gIdx, cIdx, c)).join('')}
                  <button class="text-[10px] font-bold text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-2 mb-4" onclick="ScriptEditor.Actions.addCondition(${gIdx})">${t('s3_cond_add_more')}</button>

                  <!-- Actions in Group -->
                  <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h5 class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3"><i class="fa-solid fa-bolt mr-1"></i> ${t('s3_act_group_title')}</h5>
                    ${(g.actions || []).map((a, aIdx) => ScriptEditor.UI.Templates.actionRow(gIdx, aIdx, a)).join('')}
                    <button class="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 mt-2" onclick="ScriptEditor.Actions.addAction(${gIdx})">${t('s3_act_add_group')}</button>
                  </div>
                </div>
              `).join('')}
              <div ondragover="ScriptEditor.Actions.onDragOver(event)" ondrop="ScriptEditor.Actions.onDrop(event, 'group', ${ScriptEditor.State.script.groups.length}, null)">
                <button class="se-btn se-btn-outline w-full mt-2 border-dashed" onclick="ScriptEditor.Actions.addGroup()">${t('s3_group_add')}</button>
              </div>
            `}
          </div>

          <!-- GLOBALE AKTIONEN -->
          <div class="se-logic-box border-t-4 border-t-indigo-500">
            <h4 class="font-black text-sm text-slate-800 dark:text-white mb-6"><i class="fa-solid fa-bolt text-indigo-500 mr-2"></i> ${ScriptEditor.State.script.conditionMode === 'group' ? t('s3_act_global_title_pre') : ''}${t('s3_act_global_title')}</h4>
            <p class="text-[10px] text-slate-400 mb-4">${ScriptEditor.State.script.conditionMode === 'group' ? t('s3_act_global_desc_group') : t('s3_act_global_desc_single')}</p>
            ${ScriptEditor.State.script.actions.map((a, aIdx) => ScriptEditor.UI.Templates.actionRow(null, aIdx, a)).join('')}
            
            <!-- Drop-Zone für das Ende der Liste -->
            <div ondragover="ScriptEditor.Actions.onDragOver(event)" ondrop="ScriptEditor.Actions.onDrop(event, 'action', ${ScriptEditor.State.script.actions.length}, null)">
              <button class="se-btn se-btn-outline w-full mt-2 border-dashed" onclick="ScriptEditor.Actions.addAction(null)">${t('s3_act_add_global')}</button>
            </div>
          </div>
        `;
      }

      if (step === 4) return `
        <div class="text-center py-8">
          <i class="fa-solid fa-file-code text-4xl text-green-500 mb-4"></i>
          <h3 class="font-bold text-lg mb-1 dark:text-white">${t('s4_title')}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">${t('s4_desc')}</p>
        </div>
      `;
      return '';
    },

    Templates: {
      typedInput: (type, value, onChangeFn) => {
        const t = (key) => I18nService.t(`editor.script.${key}`);
        if (type === 'boolean') {
          return `
            <select class="se-input flex-1" onchange="${onChangeFn}">
              <option value="">${t('lbl_please_select')}</option>
              <option value="true" ${value === 'true' ? 'selected' : ''}>${t('lbl_yes')}</option>
              <option value="false" ${value === 'false' ? 'selected' : ''}>${t('lbl_no')}</option>
            </select>
          `;
        }
        if (type === 'number') {
          return `<input type="number" class="se-input flex-1" placeholder="${t('lbl_enter_number')}" value="${value}" onchange="${onChangeFn}">`;
        }
        return `<input type="text" class="se-input flex-1" placeholder="${t('lbl_enter_value')}" value="${value}" onchange="${onChangeFn}">`;
      },

      choiceScreen: () => `
        <div class="se-main-window mx-auto max-w-2xl text-center py-24 mt-10">
          <h1 class="text-3xl font-black mb-2 text-slate-800 dark:text-white">${I18nService.t('editor.script.choice_title')}</h1>
          <p class="text-slate-500 dark:text-slate-400 mb-10">${I18nService.t('editor.script.choice_desc')}</p>
          <div class="flex justify-center gap-6">
            <button class="se-btn se-btn-primary py-4 px-8 text-sm" onclick="ScriptEditor.State.ui.mode='new'; ScriptEditor.UI.render()"><i class="fa-solid fa-plus mr-2"></i> ${I18nService.t('editor.script.choice_new')}</button>
            <button class="se-btn se-btn-outline py-4 px-8 text-sm" onclick="document.getElementById('se-file-import').click()"><i class="fa-solid fa-folder-open mr-2"></i> ${I18nService.t('editor.script.choice_import')}</button>
          </div>
        </div>
      `,
      
      varSidebar: () => {
        const t = (key) => I18nService.t(`editor.script.${key}`);
        const globals = ScriptEditor.Core.getGlobalVariables();
        return `
        <div class="mb-6">
          <div class="flex items-center gap-1.5 mb-2">
            <i class="fa-solid fa-globe text-emerald-500 text-sm"></i>
            <h3 class="font-bold text-sm text-slate-800 dark:text-white">${t('sb_sys_vars')}</h3>
          </div>
          <div class="flex flex-wrap gap-1 max-h-[30vh] overflow-y-auto pr-2 pb-2">
            ${globals.map(g => `
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] shadow-sm cursor-default">
                <i class="fa-solid fa-globe opacity-40 text-[9px]"></i> 
                <b>${g.id}</b> 
                <span class="opacity-60 text-[9px] ml-1 font-mono">(${g.type})</span>
              </span>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="flex items-center gap-1.5 mb-2 pt-4 border-t border-slate-100 dark:border-slate-700">
            <i class="fa-solid fa-box text-indigo-500 text-sm"></i>
            <h3 class="font-bold text-sm text-slate-800 dark:text-white">${t('sb_custom_vars')}</h3>
          </div>
          
          <div class="flex flex-wrap gap-1 mb-4 max-h-[30vh] overflow-y-auto pr-2 pb-2">
            ${ScriptEditor.State.script.variables.length === 0 ? `<div class="text-[10px] text-slate-400 dark:text-slate-500 w-full text-center py-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">${t('sb_no_vars')}</div>` : ''}
            ${ScriptEditor.State.script.variables.map(v => `
              <span class="group inline-flex items-center gap-1 px-2 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] shadow-sm transition-colors hover:border-indigo-300 dark:hover:border-indigo-600">
                <b>${v.name}</b> 
                <span class="opacity-60 text-[9px] ml-1 font-mono">(${v.type})</span>
                <i class="fa-solid fa-xmark ml-1.5 opacity-40 cursor-pointer hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity" onclick="ScriptEditor.Actions.removeVar('${v.name}')" title="${t('sb_del_title')}"></i>
              </span>
            `).join('')}
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
            <input type="text" id="v-name" class="se-input !py-1.5 !text-[11px] mb-1" placeholder="${t('sb_var_name')}">
            <select id="v-type" class="se-input !py-1.5 !text-[11px] mb-2">
              ${Object.entries(ScriptEditor.Registry.VariableTypes).map(([key, config]) => `<option value="${key}">${config.label}</option>`).join('')}
            </select>
            <button class="se-btn se-btn-primary w-full bg-indigo-500 hover:bg-indigo-600 border-none !py-1.5" onclick="ScriptEditor.Actions.addVar(document.getElementById('v-name').value, document.getElementById('v-type').value)">${t('sb_btn_add')}</button>
          </div>
        </div>
      `},

      conditionRow: (gIdx, cIdx, c) => {
        const t = (key) => I18nService.t(`editor.script.${key}`);
        const vars = ScriptEditor.Core.getContextVariables();
        const leftVar = vars.find(v => v.id === c.left);
        
        let rightContent = '';
        if (leftVar) {
          const availableOps = Object.entries(ScriptEditor.Registry.Operators).filter(([key, config]) => config.types.includes(leftVar.type));
          rightContent = `
            <select class="se-input text-center font-bold" style="width: 140px;" onchange="ScriptEditor.Actions.updateCondition(${gIdx}, ${cIdx}, 'operator', this.value)">
              ${availableOps.map(([key, config]) => `<option value="${key}" ${c.operator === key ? 'selected' : ''}>${config.label}</option>`).join('')}
            </select>
            ${ScriptEditor.UI.Templates.typedInput(leftVar.type, c.right || '', `ScriptEditor.Actions.updateCondition(${gIdx}, ${cIdx}, 'right', this.value)`)}
          `;
        } else {
          rightContent = `<div class="flex-1 text-xs text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded border border-dashed border-slate-200 dark:border-slate-700">${t('lr_select_var_first')}</div>`;
        }

        return `
          <div class="se-row" draggable="true" 
               ondragstart="ScriptEditor.Actions.onDragStart(event, 'condition', ${cIdx}, ${gIdx})"
               ondragend="ScriptEditor.Actions.onDragEnd(event)"
               ondragover="ScriptEditor.Actions.onDragOver(event)"
               ondragenter="ScriptEditor.Actions.onDragEnter(event)"
               ondragleave="ScriptEditor.Actions.onDragLeave(event)"
               ondrop="ScriptEditor.Actions.onDrop(event, 'condition', ${cIdx}, ${gIdx})">
            <i class="fa-solid fa-grip-vertical drag-handle"></i>
            <select class="se-input flex-1" onchange="ScriptEditor.Actions.updateCondition(${gIdx}, ${cIdx}, 'left', this.value)">
              <option value="">${t('lr_select_var')}</option>
              ${vars.map(v => `<option value="${v.id}" ${c.left === v.id ? 'selected' : ''}>${v.label}</option>`).join('')}
            </select>
            ${rightContent}
            <i class="fa-solid fa-xmark text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 cursor-pointer p-2" onclick="ScriptEditor.Actions.removeCondition(${gIdx}, ${cIdx})"></i>
          </div>
        `;
      },

      actionRow: (gIdx, aIdx, a) => {
        const t = (key) => I18nService.t(`editor.script.${key}`);
        const vars = ScriptEditor.Core.getContextVariables();
        const types = Object.entries(ScriptEditor.Registry.ActionTypes);
        
        return `
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-3 shadow-sm transition"
               draggable="true" 
               ondragstart="ScriptEditor.Actions.onDragStart(event, 'action', ${aIdx}, ${gIdx})"
               ondragend="ScriptEditor.Actions.onDragEnd(event)"
               ondragover="ScriptEditor.Actions.onDragOver(event)"
               ondragenter="ScriptEditor.Actions.onDragEnter(event)"
               ondragleave="ScriptEditor.Actions.onDragLeave(event)"
               ondrop="ScriptEditor.Actions.onDrop(event, 'action', ${aIdx}, ${gIdx})">
            
            <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-50 dark:border-slate-700">
              <div class="flex gap-2 flex-wrap items-center">
                <i class="fa-solid fa-grip-vertical drag-handle mr-1"></i>
                ${types.map(([key, config]) => `
                  <div class="badge-pill ${a.type === key ? 'active' : ''}" onclick="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'type', '${key}')">
                    <i class="fa-solid ${config.icon}"></i> ${config.label}
                  </div>
                `).join('')}
              </div>
              <i class="fa-solid fa-trash text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 cursor-pointer p-1" onclick="ScriptEditor.Actions.removeAction(${gIdx}, ${aIdx})"></i>
            </div>
            
            <div class="space-y-3">
              ${a.type === 'setVariable' ? `
                <div class="flex gap-2 items-center">
                  <select class="se-input flex-1" onchange="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'target', this.value)">
                    <option value="">${t('lr_target_var')}</option>
                    ${ScriptEditor.State.script.variables.map(v => `<option value="${v.name}" ${a.target === v.name ? 'selected' : ''}>${v.name}</option>`).join('')}
                  </select>
                  ${(() => {
                    const tVar = ScriptEditor.State.script.variables.find(v => v.name === a.target);
                    if (!tVar) return `<div class="flex-1 text-xs text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded border border-dashed border-slate-200 dark:border-slate-700">${t('lr_target_var_left')}</div>`;
                    return ScriptEditor.UI.Templates.typedInput(tVar.type, a.value || '', `ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'value', this.value)`);
                  })()}
                </div>
              ` : ''}

              ${a.type === 'returnVariable' ? `
                <div class="flex flex-wrap gap-2">
                  ${vars.map(v => `
                    <span class="badge-pill ${a.target === v.id ? 'active' : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'}" onclick="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'target', '${v.id}')">
                      ${v.label}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
              
              ${a.type === 'callFunction' ? `
                <select class="se-input w-full mb-3" onchange="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'func', this.value)">
                  <option value="">${t('lr_select_func')}</option>
                  ${Object.entries(ScriptEditor.Registry.Functions).map(([key, config]) => `<option value="${key}" ${a.func === key ? 'selected' : ''}>${config.name}</option>`).join('')}
                </select>
                ${a.func ? `
                  <div class="pl-4 border-l-2 border-indigo-100 dark:border-indigo-800 mt-2">
                    <div class="flex flex-wrap gap-2">
                      ${(a.args && a.args.length > 0) ? a.args.map((argId, argIdx) => {
                        const varInfo = vars.find(v => v.id === argId);
                        const label = varInfo ? varInfo.label : argId;
                        return `
                          <span class="badge-pill active border-indigo-600 pr-2">
                            ${label} <i class="fa-solid fa-xmark ml-2 opacity-70 hover:opacity-100 hover:text-red-200 cursor-pointer" onclick="ScriptEditor.Actions.removeActionArg(${gIdx}, ${aIdx}, ${argIdx})"></i>
                          </span>
                        `;
                      }).join('') : `<span class="text-xs text-slate-400 dark:text-slate-500 italic">${t('lr_no_args')}</span>`}
                    </div>

                    ${(() => {
                      const availableVars = vars.filter(v => !(a.args || []).includes(v.id));
                      if (availableVars.length > 0) {
                        return `
                          <div class="border-t border-slate-100 dark:border-slate-700 my-3 pt-3">
                            <div class="flex flex-wrap gap-2">
                              ${availableVars.map(v => `
                                <span class="badge-pill hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700" onclick="ScriptEditor.Actions.addActionArg(${gIdx}, ${aIdx}, '${v.id}')">
                                  <i class="fa-solid fa-plus text-[10px] text-slate-400 dark:text-slate-500 mr-1"></i> ${v.label}
                                </span>
                              `).join('')}
                            </div>
                          </div>
                        `;
                      }
                      return '';
                    })()}
                  </div>
                ` : ''}
              ` : ''}
            </div>
          </div>
        `;
      }
    }
  },

  // ==========================================
  // 5. STATE ACTIONS (Manipulation)
  // ==========================================
  Actions: {
    setTriggerPage: (page) => {
      ScriptEditor.State.ui.triggerPage = page;
      ScriptEditor.UI.render();
    },
    onDragStart: (e, type, idx, gIdx) => {
      ScriptEditor.State.ui.dragInfo = { type, idx, gIdx };
      e.target.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
         e.preventDefault();
      }
    },
    onDragEnd: (e) => {
      e.target.style.opacity = '1';
      ScriptEditor.State.ui.dragInfo = null;
    },
    onDragOver: (e) => {
      e.preventDefault(); 
      e.dataTransfer.dropEffect = 'move';
    },
    onDragEnter: (e) => {
      e.preventDefault();
      e.currentTarget.classList.add('se-drag-over');
    },
    onDragLeave: (e) => {
      e.currentTarget.classList.remove('se-drag-over');
    },
    onDrop: (e, type, targetIdx, targetGIdx) => {
      e.preventDefault();
      e.currentTarget.classList.remove('se-drag-over');
      
      const dragInfo = ScriptEditor.State.ui.dragInfo;
      if (!dragInfo) return;
      if (dragInfo.type !== type || dragInfo.gIdx !== targetGIdx) return;
      if (dragInfo.idx === targetIdx) return;

      const script = ScriptEditor.State.script;
      let list = [];
      if (type === 'group') {
        list = script.groups;
      } else if (type === 'condition') {
        list = targetGIdx === null ? script.conditions : script.groups[targetGIdx].conditions;
      } else if (type === 'action') {
        list = targetGIdx === null ? script.actions : script.groups[targetGIdx].actions;
      }

      const [movedItem] = list.splice(dragInfo.idx, 1);
      list.splice(targetIdx, 0, movedItem);

      ScriptEditor.State.ui.dragInfo = null;
      ScriptEditor.UI.render();
    },
    addVar: (name, type) => {
      if(!name) return;
      const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '');
      if(!cleanName) return;

      const initialValue = ScriptEditor.Registry.VariableTypes[type].default;
      ScriptEditor.State.script.variables.push({ name: cleanName, type, initialValue });
      document.getElementById('v-name').value = '';
      ScriptEditor.UI.render();
    },
    removeVar: (name) => {
      ScriptEditor.State.script.variables = ScriptEditor.State.script.variables.filter(v => v.name !== name);
      ScriptEditor.UI.render();
    },
    toggleTrigger: (id) => {
      const idx = ScriptEditor.State.script.selectedTriggers.indexOf(id);
      if (idx > -1) ScriptEditor.State.script.selectedTriggers.splice(idx, 1);
      else ScriptEditor.State.script.selectedTriggers.push(id);
      ScriptEditor.UI.render();
    },
    triggerError: (stepNum) => {
      const dot = document.getElementById(`step-dot-${stepNum}`);
      if (dot) {
        dot.classList.add('error');
        setTimeout(() => dot.classList.remove('error'), 400);
      }
    },
    nextStep: () => {
      if (ScriptEditor.State.ui.step === 2 && ScriptEditor.State.script.selectedTriggers.length === 0) {
        ScriptEditor.Actions.triggerError(3); 
        return;
      }
      ScriptEditor.State.ui.step++;
      ScriptEditor.UI.render();
    },
    prevStep: () => {
      if (ScriptEditor.State.ui.step > 1) {
        ScriptEditor.State.ui.step--;
        ScriptEditor.UI.render();
      }
    },
    goToStep: (targetStep) => {
      if (targetStep >= 3 && ScriptEditor.State.script.selectedTriggers.length === 0) {
        ScriptEditor.Actions.triggerError(targetStep);
        return;
      }
      ScriptEditor.State.ui.step = targetStep;
      ScriptEditor.UI.render();
    },
    setConditionMode: (mode) => {
      ScriptEditor.State.script.conditionMode = mode;
      if (mode === 'single') ScriptEditor.State.script.groups = [];
      if (mode === 'group') ScriptEditor.State.script.conditions = [];
      ScriptEditor.UI.render();
    },
    addCondition: (gIdx) => {
      const newCond = { left: '', operator: '', right: '' };
      if (gIdx === null) ScriptEditor.State.script.conditions.push(newCond);
      else ScriptEditor.State.script.groups[gIdx].conditions.push(newCond);
      ScriptEditor.UI.render();
    },
    addGroup: () => {
      ScriptEditor.State.script.groups.push({ operator: 'OR', conditions: [], actions: [] });
      ScriptEditor.UI.render();
    },
    removeGroup: (gIdx) => {
      ScriptEditor.State.script.groups.splice(gIdx, 1);
      ScriptEditor.UI.render();
    },
    addConditionToGroup: (gIdx) => {
      ScriptEditor.State.script.groups[gIdx].conditions.push({ left: '', operator: '', right: '' });
      ScriptEditor.UI.render();
    },
    removeCondition: (gIdx, cIdx) => {
      if (gIdx === null) ScriptEditor.State.script.conditions.splice(cIdx, 1);
      else ScriptEditor.State.script.groups[gIdx].conditions.splice(cIdx, 1);
      ScriptEditor.UI.render();
    },
    updateCondition: (gIdx, cIdx, key, value) => {
      const cond = gIdx === null ? ScriptEditor.State.script.conditions[cIdx] : ScriptEditor.State.script.groups[gIdx].conditions[cIdx];
      cond[key] = value;
      if (key === 'left') {
        const leftVar = ScriptEditor.Core.getContextVariables().find(v => v.id === value);
        if (leftVar) {
          const ops = Object.entries(ScriptEditor.Registry.Operators).filter(([k, cfg]) => cfg.types.includes(leftVar.type));
          cond.operator = ops.length > 0 ? ops[0][0] : '';
        } else { cond.operator = ''; }
        cond.right = '';
      }
      ScriptEditor.UI.render();
    },
    addAction: (gIdx = null) => {
      const newAction = { type: 'setVariable', target: '', value: '', func: '', args: [] };
      if (gIdx === null) ScriptEditor.State.script.actions.push(newAction);
      else ScriptEditor.State.script.groups[gIdx].actions.push(newAction);
      ScriptEditor.UI.render();
    },
    removeAction: (gIdx, aIdx) => {
      if (gIdx === null) ScriptEditor.State.script.actions.splice(aIdx, 1);
      else ScriptEditor.State.script.groups[gIdx].actions.splice(aIdx, 1);
      ScriptEditor.UI.render();
    },
    updateAction: (gIdx, aIdx, key, value) => {
      const action = gIdx === null ? ScriptEditor.State.script.actions[aIdx] : ScriptEditor.State.script.groups[gIdx].actions[aIdx];
      action[key] = value;
      if (key === 'type') { action.target = ''; action.value = ''; action.func = ''; action.args = []; }
      if (key === 'target' && action.type === 'setVariable') action.value = '';
      ScriptEditor.UI.render();
    },
    addActionArg: (gIdx, aIdx, varId) => {
      const action = gIdx === null ? ScriptEditor.State.script.actions[aIdx] : ScriptEditor.State.script.groups[gIdx].actions[aIdx];
      if (!action.args) action.args = [];
      action.args.push(varId);
      ScriptEditor.UI.render();
    },
    removeActionArg: (gIdx, aIdx, argIdx) => {
      const action = gIdx === null ? ScriptEditor.State.script.actions[aIdx] : ScriptEditor.State.script.groups[gIdx].actions[aIdx];
      action.args.splice(argIdx, 1);
      ScriptEditor.UI.render();
    }
  }
};

window.ScriptEditor = ScriptEditor;