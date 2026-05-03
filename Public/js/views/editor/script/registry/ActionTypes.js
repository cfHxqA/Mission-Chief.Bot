// file: /js/views/editor/script/registry/ActionTypes.js
// version: 1.1.0.0, 03.05.2026

import { I18nService } from '../../../../services/i18n.js';

export const ActionTypes = {
  setVariable:    { get label() { return I18nService.t('editor.script.reg_act_set'); }, icon: 'fa-pen' },
  returnVariable: { get label() { return I18nService.t('editor.script.reg_act_ret'); }, icon: 'fa-reply' },
  callFunction:   { get label() { return I18nService.t('editor.script.reg_act_call'); }, icon: 'fa-bolt' }
};