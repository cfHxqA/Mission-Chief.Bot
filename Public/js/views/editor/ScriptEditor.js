// file: /js/views/editor/ScriptEditor.js
// version: 1.1.0.0, 03.05.2026

import { VariableTypes } from './script/registry/VariableTypes.js';
import { Operators } from './script/registry/Operators.js';
import { Triggers } from './script/registry/Triggers.js';
import { Functions } from './script/registry/Functions.js';
import { ActionTypes } from './script/registry/ActionTypes.js';

import { EditorCore } from './script/EditorCore.js';
import { EditorUI } from './script/EditorUI.js';
import { EditorActions } from './script/EditorActions.js';

/**
 * Main ScriptEditor module. Serves as the central namespace and entry point
 * for the visual script editor. It aggregates Registry, State and the three
 * core sub-modules (Core, UI, Actions).
 */
export const ScriptEditor = {
	/**
	 * Called by the router when the editor view is mounted.
	 * @returns {Promise<void>}
	 */
	render: async () => await ScriptEditor.UI.mount(),

	/**
	 * Called by the router after the view has been mounted to the DOM.
	 * @returns {Promise<void>}
	 */
	after_render: async () => await ScriptEditor.UI.afterMount(),

	/**
	 * Registry containing all configurable definitions used by the editor.
	 */
	Registry: {
		VariableTypes,
		Operators,
		Triggers,
		Functions,
		ActionTypes
	},

	/**
	 * Global editor state. Contains UI flags and the current script definition.
	 */
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

	/** @type {typeof EditorCore} */
	Core: EditorCore,

	/** @type {typeof EditorUI} */
	UI: EditorUI,

	/** @type {typeof EditorActions} */
	Actions: EditorActions
};

// Expose globally for inline event handlers in templates
window.ScriptEditor = ScriptEditor;