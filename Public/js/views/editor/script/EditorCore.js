// file: /js/views/editor/script/EditorCore.js
// version: 1.1.0.0, 03.05.2026

import { I18nService } from '../../../services/i18n.js';
import { ScriptEditor } from '../ScriptEditor.js';

/**
 * EditorCore handles core business logic, state initialization,
 * variable resolution, import/export and context data for the Script Editor.
 */
export const EditorCore = {
	/**
	 * Initializes editor state and renders the UI.
	 */
	init: () => {
		ScriptEditor.State.ui.mode = null;
		ScriptEditor.State.ui.step = 1;
		ScriptEditor.State.ui.dragInfo = null;
		ScriptEditor.State.ui.triggerPage = 1; 
		ScriptEditor.State.script = { 
			author: I18nService.t('editor.script.default_author'), 
			scriptName: I18nService.t('editor.script.default_script_name'), 
			scriptVersion: "1.0.0.0", 
			variables: [], 
			selectedTriggers: [], 
			conditionMode: 'single', 
			conditions: [], 
			groups: [], 
			actions: [] 
		};
		ScriptEditor.UI.render();
	},

	/**
	 * Returns global system and event variables based on selected triggers.
	 * @returns {Array<Object>} Array of variable definitions with id, label and type
	 */
	getGlobalVariables: () => {
		let globals = [
			{ id: 'sys.time', label: 'sys.time', type: 'number' },
			{ id: 'sys.is_night', label: 'sys.is_night', type: 'boolean' }
		];
		ScriptEditor.State.script.selectedTriggers.forEach(tId => {
			const config = ScriptEditor.Registry.Triggers[tId];
			if (config && config.exports) {
				config.exports.forEach(exp => {
					if (!globals.some(g => g.id === `event.${exp.name}`)) {
						globals.push({ id: `event.${exp.name}`, label: `event.${exp.name}`, type: exp.type });
					}
				});
			}
		});
		return globals;
	},

	/**
	 * Returns all available variables in current context (globals + custom).
	 * @returns {Array<Object>} Combined array of variable definitions
	 */
	getContextVariables: () => {
		return [
			...ScriptEditor.Core.getGlobalVariables(),
			...ScriptEditor.State.script.variables.map(v => ({ id: v.name, label: v.name, type: v.type }))
		];
	},

	/**
	 * Returns functions available based on selected triggers and system functions.
	 * @returns {Object} Map of available function configurations
	 */
	getAvailableFunctions: () => {
		const selected = ScriptEditor.State.script.selectedTriggers || [];
		const available = {};
		Object.entries(ScriptEditor.Registry.Functions).forEach(([key, config]) => {
			const prefix = key.split('.')[0];
			if (prefix === 'system' || selected.includes(prefix)) {
				available[key] = config;
			}
		});
		return available;
	},

	/**
	 * Imports a .mscf script file and loads it into editor state.
	 * @param {File} file Selected script file
	 */
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
			} catch (err) { 
				alert(I18nService.t('editor.script.alert_read_error')); 
			}
		};
		reader.readAsText(file);
	},

	/**
	 * Exports current script state as .mscf JSON file.
	 */
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
};