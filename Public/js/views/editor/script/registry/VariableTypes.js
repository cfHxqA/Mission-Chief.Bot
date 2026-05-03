// file: /js/views/editor/script/registry/VariableTypes.js
// version: 1.1.0.0, 03.05.2026

import { I18nService } from '../../../../services/i18n.js';

export const VariableTypes = {
  number:       { get label() { return I18nService.t('editor.script.reg_type_number'); }, default: 0 },
  string:       { get label() { return I18nService.t('editor.script.reg_type_string'); }, default: '' },
  boolean:      { get label() { return I18nService.t('editor.script.reg_type_boolean'); }, default: false },
  array_string: { get label() { return I18nService.t('editor.script.reg_type_array_string'); }, default: [] },
  array_number: { get label() { return I18nService.t('editor.script.reg_type_array_number'); }, default: [] }
};