// file: /js/views/editor/script/EditorUI.js
// version: 1.1.0.0, 03.05.2026

import { I18nService } from '../../../services/i18n.js';
import { ScriptEditor } from '../ScriptEditor.js';

/**
 * EditorUI provides all UI rendering logic for the Script Editor.
 * It handles mounting, step-based rendering, templates and dynamic HTML generation.
 */
export const EditorUI = {
  /**
   * Returns the initial HTML structure for the editor.
   * @returns {Promise<string>} HTML string containing root container and hidden file input
   */
  mount: async () => {
    return `
      <div class="se-wrapper" id="se-root"></div>
      <input type="file" id="se-file-import" hidden accept=".mscf" onchange="ScriptEditor.Core.importScript(event.target.files[0])">
    `;
  },

  /**
   * Called after mount. Triggers initial render of the editor UI.
   */
  afterMount: async () => { 
    ScriptEditor.UI.render(); 
  },

  /**
   * Renders the complete editor interface based on current state.
   * Includes header, progress, step content and sidebar.
   */
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

  /**
   * Returns HTML content for the specified editor step.
   * @param {number} step Current step number (1-4)
   * @returns {string} HTML string for the step content
   */
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

                ${g.conditions.map((c, cIdx) => ScriptEditor.UI.Templates.conditionRow(gIdx, cIdx, c)).join('')}
                <button class="text-[10px] font-bold text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-2 mb-4" onclick="ScriptEditor.Actions.addCondition(${gIdx})">${t('s3_cond_add_more')}</button>

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
    /**
     * Creates a typed input field based on variable type.
     * @param {string} type Variable type (boolean, number, string)
     * @param {string} value Current value
     * @param {string} onChangeFn Inline onchange handler string
     * @returns {string} HTML for the input element
     */
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

    /**
     * Returns the initial choice screen (New / Import).
     * @returns {string} HTML for the choice screen
     */
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
    
    /**
     * Renders the variable sidebar with system and custom variables.
     * @returns {string} HTML for the sidebar
     */
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
      `;
    },

    /**
     * Renders a single condition row with drag & drop support.
     * @param {number|null} gIdx Group index (null for single mode)
     * @param {number} cIdx Condition index
     * @param {Object} c Condition object
     * @returns {string} HTML for condition row
     */
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

    /**
     * Renders a single action row with type selection and configuration.
     * @param {number|null} gIdx Group index (null for global actions)
     * @param {number} aIdx Action index
     * @param {Object} a Action object
     * @returns {string} HTML for action row
     */
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
              <div class="flex flex-col gap-2">
                <div class="flex flex-wrap gap-2">
                  ${ScriptEditor.State.script.variables.length === 0 ? `<span class="text-xs text-slate-400 dark:text-slate-500 italic border border-dashed border-slate-200 dark:border-slate-700 px-2 py-1 rounded">${t('sb_no_vars')}</span>` : ''}
                  ${ScriptEditor.State.script.variables.map(v => `
                    <span class="badge-pill ${a.target === v.name ? 'active' : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'}" onclick="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'target', '${v.name}')">
                      ${v.name}
                    </span>
                  `).join('')}
                </div>
                <div class="flex w-full mt-1">
                  ${(() => {
                    const tVar = ScriptEditor.State.script.variables.find(v => v.name === a.target);
                    if (!tVar) return `<div class="w-full text-xs text-slate-400 dark:text-slate-500 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">${t('lr_target_var_left')}</div>`;
                    return ScriptEditor.UI.Templates.typedInput(tVar.type, a.value || '', `ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'value', this.value)`);
                  })()}
                </div>
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
              <div class="flex flex-wrap gap-2 mb-3">
                ${(() => {
                  const availableFuncs = ScriptEditor.Core.getAvailableFunctions();
                  let badges = Object.keys(availableFuncs).map(key => 
                    `<span class="badge-pill ${a.func === key ? 'active' : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'}" onclick="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'func', '${key}')">
                      ${key}
                    </span>`
                  );
                  if (a.func && !availableFuncs[a.func]) {
                    badges.unshift(`<span class="badge-pill border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20 active" onclick="ScriptEditor.Actions.updateAction(${gIdx}, ${aIdx}, 'func', '${a.func}')">
                      ${a.func} (${t('missing_trigger') || 'Fehlender Trigger'})
                    </span>`);
                  }
                  if (badges.length === 0) return `<span class="text-xs text-slate-400 dark:text-slate-500 italic border border-dashed border-slate-200 dark:border-slate-700 px-2 py-1 rounded">Keine Funktionen verfügbar</span>`;
                  return badges.join('');
                })()}
              </div>

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
};