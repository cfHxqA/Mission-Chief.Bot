// file: /js/views/editor/script/registry/Operators.js
// version: 1.1.0.0, 03.05.2026

import { I18nService } from '../../../../services/i18n.js';

export const Operators = {
  equals:         { label: '==', types: ['number', 'string', 'boolean'] },
  notEquals:      { label: '!=', types: ['number', 'string', 'boolean'] },
  greaterThan:    { label: '>',  types: ['number'] },
  lessThan:       { label: '<',  types: ['number'] },
  contains:       { get label() { return I18nService.t('editor.script.reg_op_contains'); }, types: ['string', 'array_string', 'array_number'] },
  notContains:    { get label() { return I18nService.t('editor.script.reg_op_notContains'); }, types: ['string', 'array_string', 'array_number'] },
  startsWith:     { get label() { return I18nService.t('editor.script.reg_op_startsWith'); }, types: ['string'] }
};