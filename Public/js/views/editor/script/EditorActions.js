// file: /js/views/editor/script/EditorActions.js
// version: 1.1.0.0, 03.05.2026

import { ScriptEditor } from '../ScriptEditor.js';

/**
 * EditorActions contains all user interaction handlers for the Script Editor.
 * Includes drag & drop, step navigation, trigger/condition/action management.
 */
export const EditorActions = {
	/**
	 * Changes the current page in the trigger selection view.
	 * @param {number} page Target page number
	 */
	setTriggerPage: (page) => {
		ScriptEditor.State.ui.triggerPage = page;
		ScriptEditor.UI.render();
	},

	/**
	 * Handles drag start event for reordering items.
	 * @param {DragEvent} e Drag event
	 * @param {string} type Item type ('group', 'condition', 'action')
	 * @param {number} idx Source index
	 * @param {number|null} gIdx Group index (null for global)
	 */
	onDragStart: (e, type, idx, gIdx) => {
		ScriptEditor.State.ui.dragInfo = { type, idx, gIdx };
		e.target.style.opacity = '0.4';
		e.dataTransfer.effectAllowed = 'move';
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
			e.preventDefault();
		}
	},

	/**
	 * Handles drag end event. Resets opacity and drag info.
	 * @param {DragEvent} e Drag event
	 */
	onDragEnd: (e) => {
		e.target.style.opacity = '1';
		ScriptEditor.State.ui.dragInfo = null;
	},

	/**
	 * Handles drag over event to allow dropping.
	 * @param {DragEvent} e Drag event
	 */
	onDragOver: (e) => {
		e.preventDefault(); 
		e.dataTransfer.dropEffect = 'move';
	},

	/**
	 * Handles drag enter to show visual feedback.
	 * @param {DragEvent} e Drag event
	 */
	onDragEnter: (e) => {
		e.preventDefault();
		e.currentTarget.classList.add('se-drag-over');
	},

	/**
	 * Handles drag leave to remove visual feedback.
	 * @param {DragEvent} e Drag event
	 */
	onDragLeave: (e) => {
		e.currentTarget.classList.remove('se-drag-over');
	},

	/**
	 * Handles drop event and reorders items in the list.
	 * @param {DragEvent} e Drag event
	 * @param {string} type Item type
	 * @param {number} targetIdx Target index
	 * @param {number|null} targetGIdx Target group index
	 */
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

	/**
	 * Adds a new custom variable after sanitizing the name.
	 * @param {string} name Variable name
	 * @param {string} type Variable type
	 */
	addVar: (name, type) => {
		if(!name) return;
		const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '');
		if(!cleanName) return;

		const initialValue = ScriptEditor.Registry.VariableTypes[type].default;
		ScriptEditor.State.script.variables.push({ name: cleanName, type, initialValue });
		document.getElementById('v-name').value = '';
		ScriptEditor.UI.render();
	},

	/**
	 * Removes a custom variable by name.
	 * @param {string} name Variable name to remove
	 */
	removeVar: (name) => {
		ScriptEditor.State.script.variables = ScriptEditor.State.script.variables.filter(v => v.name !== name);
		ScriptEditor.UI.render();
	},

	/**
	 * Toggles selection of a trigger.
	 * @param {string} id Trigger identifier
	 */
	toggleTrigger: (id) => {
		const idx = ScriptEditor.State.script.selectedTriggers.indexOf(id);
		if (idx > -1) ScriptEditor.State.script.selectedTriggers.splice(idx, 1);
		else ScriptEditor.State.script.selectedTriggers.push(id);
		ScriptEditor.UI.render();
	},

	/**
	 * Shows a temporary error highlight on a step dot.
	 * @param {number} stepNum Step number to highlight
	 */
	triggerError: (stepNum) => {
		const dot = document.getElementById(`step-dot-${stepNum}`);
		if (dot) {
			dot.classList.add('error');
			setTimeout(() => dot.classList.remove('error'), 400);
		}
	},

	/**
	 * Advances to the next step with validation.
	 */
	nextStep: () => {
		if (ScriptEditor.State.ui.step === 2 && ScriptEditor.State.script.selectedTriggers.length === 0) {
			ScriptEditor.Actions.triggerError(3); 
			return;
		}
		ScriptEditor.State.ui.step++;
		ScriptEditor.UI.render();
	},

	/**
	 * Goes back to the previous step.
	 */
	prevStep: () => {
		if (ScriptEditor.State.ui.step > 1) {
			ScriptEditor.State.ui.step--;
			ScriptEditor.UI.render();
		}
	},

	/**
	 * Jumps to a specific step with validation for steps >= 3.
	 * @param {number} targetStep Target step number
	 */
	goToStep: (targetStep) => {
		if (targetStep >= 3 && ScriptEditor.State.script.selectedTriggers.length === 0) {
			ScriptEditor.Actions.triggerError(targetStep);
			return;
		}
		ScriptEditor.State.ui.step = targetStep;
		ScriptEditor.UI.render();
	},

	/**
	 * Switches between single condition and grouped condition mode.
	 * @param {'single'|'group'} mode New condition mode
	 */
	setConditionMode: (mode) => {
		ScriptEditor.State.script.conditionMode = mode;
		if (mode === 'single') ScriptEditor.State.script.groups = [];
		if (mode === 'group') ScriptEditor.State.script.conditions = [];
		ScriptEditor.UI.render();
	},

	/**
	 * Adds a new empty condition.
	 * @param {number|null} gIdx Group index (null = single mode)
	 */
	addCondition: (gIdx) => {
		const newCond = { left: '', operator: '', right: '' };
		if (gIdx === null) ScriptEditor.State.script.conditions.push(newCond);
		else ScriptEditor.State.script.groups[gIdx].conditions.push(newCond);
		ScriptEditor.UI.render();
	},

	/**
	 * Adds a new condition group.
	 */
	addGroup: () => {
		ScriptEditor.State.script.groups.push({ operator: 'OR', conditions: [], actions: [] });
		ScriptEditor.UI.render();
	},

	/**
	 * Removes a condition group.
	 * @param {number} gIdx Group index
	 */
	removeGroup: (gIdx) => {
		ScriptEditor.State.script.groups.splice(gIdx, 1);
		ScriptEditor.UI.render();
	},

	/**
	 * Removes a condition from list or group.
	 * @param {number|null} gIdx Group index
	 * @param {number} cIdx Condition index
	 */
	removeCondition: (gIdx, cIdx) => {
		if (gIdx === null) ScriptEditor.State.script.conditions.splice(cIdx, 1);
		else ScriptEditor.State.script.groups[gIdx].conditions.splice(cIdx, 1);
		ScriptEditor.UI.render();
	},

	/**
	 * Updates a specific field of a condition and handles cascading resets.
	 * @param {number|null} gIdx Group index
	 * @param {number} cIdx Condition index
	 * @param {string} key Field name ('left', 'operator', 'right')
	 * @param {string} value New value
	 */
	updateCondition: (gIdx, cIdx, key, value) => {
		const cond = gIdx === null ? ScriptEditor.State.script.conditions[cIdx] : ScriptEditor.State.script.groups[gIdx].conditions[cIdx];
		cond[key] = value;
		if (key === 'left') {
			const leftVar = ScriptEditor.Core.getContextVariables().find(v => v.id === value);
			if (leftVar) {
				const ops = Object.entries(ScriptEditor.Registry.Operators).filter(([k, cfg]) => cfg.types.includes(leftVar.type));
				cond.operator = ops.length > 0 ? ops[0][0] : '';
			} else { 
				cond.operator = ''; 
			}
			cond.right = '';
		}
		ScriptEditor.UI.render();
	},

	/**
	 * Adds a new empty action.
	 * @param {number|null} gIdx Group index (null = global)
	 */
	addAction: (gIdx = null) => {
		const newAction = { type: 'setVariable', target: '', value: '', func: '', args: [] };
		if (gIdx === null) ScriptEditor.State.script.actions.push(newAction);
		else ScriptEditor.State.script.groups[gIdx].actions.push(newAction);
		ScriptEditor.UI.render();
	},

	/**
	 * Removes an action.
	 * @param {number|null} gIdx Group index
	 * @param {number} aIdx Action index
	 */
	removeAction: (gIdx, aIdx) => {
		if (gIdx === null) ScriptEditor.State.script.actions.splice(aIdx, 1);
		else ScriptEditor.State.script.groups[gIdx].actions.splice(aIdx, 1);
		ScriptEditor.UI.render();
	},

	/**
	 * Updates a field of an action and resets dependent fields when type changes.
	 * @param {number|null} gIdx Group index
	 * @param {number} aIdx Action index
	 * @param {string} key Field name
	 * @param {string} value New value
	 */
	updateAction: (gIdx, aIdx, key, value) => {
		const action = gIdx === null ? ScriptEditor.State.script.actions[aIdx] : ScriptEditor.State.script.groups[gIdx].actions[aIdx];
		action[key] = value;
		if (key === 'type') { 
			action.target = ''; 
			action.value = ''; 
			action.func = ''; 
			action.args = []; 
		}
		if (key === 'target' && action.type === 'setVariable') action.value = '';
		ScriptEditor.UI.render();
	},

	/**
	 * Adds a variable argument to a callFunction action.
	 * @param {number|null} gIdx Group index
	 * @param {number} aIdx Action index
	 * @param {string} varId Variable ID
	 */
	addActionArg: (gIdx, aIdx, varId) => {
		const action = gIdx === null ? ScriptEditor.State.script.actions[aIdx] : ScriptEditor.State.script.groups[gIdx].actions[aIdx];
		if (!action.args) action.args = [];
		action.args.push(varId);
		ScriptEditor.UI.render();
	},

	/**
	 * Removes an argument from a callFunction action.
	 * @param {number|null} gIdx Group index
	 * @param {number} aIdx Action index
	 * @param {number} argIdx Argument index
	 */
	removeActionArg: (gIdx, aIdx, argIdx) => {
		const action = gIdx === null ? ScriptEditor.State.script.actions[aIdx] : ScriptEditor.State.script.groups[gIdx].actions[aIdx];
		action.args.splice(argIdx, 1);
		ScriptEditor.UI.render();
	}
};