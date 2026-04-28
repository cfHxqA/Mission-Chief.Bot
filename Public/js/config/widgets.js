// file: /js/widgets.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * definitions for dashboard widgets.
 * @type {object}
 */
export const WIDGET_DEFS = {
    'widget-kpi-incoming': {
        title: 'Einsätze (Neu)',
        getStats: (s) => ({ main: s.incoming, sub: '+12%', subLabel: 'vs. Vorstunde', color: 'text-emerald-500' }),
        gridClass: 'col-span-1'
    },
    'widget-kpi-processed': {
        title: 'Bearbeitet',
        getStats: (s) => ({ main: s.processed, sub: '94%', subLabel: 'Quote', color: 'text-blue-500' }),
        gridClass: 'col-span-1'
    },
    'widget-kpi-success': {
        title: 'Erfolgsquote',
        getStats: (s) => ({ main: s.successRate + '%', sub: '15', subLabel: 'Fehler', color: 'text-rose-500' }),
        gridClass: 'col-span-1'
    },
    'widget-kpi-credits': {
        title: 'Credits / h',
        getStats: (s) => ({ main: s.creditsPerHour, sub: '8.2K', subLabel: 'Ø Peak', color: 'text-amber-500' }),
        gridClass: 'col-span-1'
    }
};