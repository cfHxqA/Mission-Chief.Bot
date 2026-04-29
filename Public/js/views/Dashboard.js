// file: /js/views/Dashboard.js
// version: 1.0.0.3, 29.04.2026 16:30

import { I18nService } from '../services/i18n.js';
import { API } from '../api.js';
import { KPICard } from '../components/KPICard.js';
import { ActivityChart } from '../components/ActivityChart.js';
import { DataTable } from '../components/DataTable.js';

export const Dashboard = {
    /**
     * renders the dashboard view structure including kpi cards and placeholder support.
     * @async
     * @returns {string} html template.
     */
    render: async () => {
        const { t } = I18nService;
        const stats = await API.getStats();

        const kpiConfigs = [
          { id: 'widget-kpi-kpiMissionsIncoming', title: t('dashboard.kpi.missionsIncoming'), val: stats.kpiMissionsIncoming.val, sub: stats.kpiMissionsIncoming.sub, subLabel: t('dashboard.kpi.subLabel') },
          { id: 'widget-kpi-kpiMissionsProcessed', title: t('dashboard.kpi.missionsProcessed'), val: stats.kpiMissionsProcessed.val, sub: stats.kpiMissionsProcessed.sub, subLabel: t('dashboard.kpi.subLabel') },
          { id: 'widget-kpi-kpiMissionSuccessRate', title: t('dashboard.kpi.missionSuccessRate'), val: stats.kpiMissionSuccessRate.val, sub: stats.kpiMissionSuccessRate.sub, subLabel: t('dashboard.kpi.subLabel') },
          { id: 'widget-kpi-kpiSpeechesIncoming', title: t('dashboard.kpi.speechesIncoming'), val: stats.kpiSpeechesIncoming.val, sub: stats.kpiSpeechesIncoming.sub, subLabel: t('dashboard.kpi.subLabel') },
          { id: 'widget-kpi-kpiSpeechesProcessed', title: t('dashboard.kpi.speechesProcessed'), val: stats.kpiSpeechesProcessed.val, sub: stats.kpiSpeechesProcessed.sub, subLabel: t('dashboard.kpi.subLabel') },
          { id: 'widget-kpi-kpiCreditsPerHour', title: t('dashboard.kpi.creditsPerHour'), val: stats.kpiCreditsPerHour.val, sub: stats.kpiCreditsPerHour.sub, subLabel: t('dashboard.kpi.subLabel') }
        ];

        const missionData = [{ label: 'Brennender Mülleimer', value: '412' }, { label: 'Verkehrsunfall', value: '308' }, { label: 'Krankentransport', value: '189' }];
        const buildingData = [{ label: 'Feuerwache 1 (Mitte)', value: '845' }, { label: 'Rettungswache Nord', value: '632' }, { label: 'Polizei Revier 3', value: '412' }];

        return `
            <div class="view-section w-full">
                <div class="flex justify-between items-end mb-6 px-1">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left">${t('dashboard.title')}</h1>
                        <p class="text-sm text-slate-500 mt-1 text-left">${t('dashboard.subtitle')}</p>
                    </div>
                    <button id="btn-add-placeholder" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider hover:bg-brand-base hover:text-white transition-all shadow-sm">
                        <i class="fa-solid fa-plus mr-1"></i> ${t('dashboard.kpi.placeholder')}
                    </button>
                </div>

                <div id="dashboard-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
                    ${kpiConfigs.map(conf => KPICard(conf)).join('')}
                    ${ActivityChart("Aktivitätsverlauf (24h)")}
                    ${DataTable("widget-table-missions", "Top Einsatzarten", missionData)}
                    ${DataTable("widget-table-buildings", "Top Gebäude", buildingData)}
                </div>
            </div>
        `;
    },

    /**
     * initializes dashboard components, drag-and-drop, and dynamic placeholders.
     * @async
     * @returns {void}
     */
    after_render: async () => {
      /** * translate the freshly rendered dynamic content */
      I18nService.applyTranslations(document.getElementById('app-content'));
      
        const grid = document.getElementById('dashboard-grid');
        if (!grid) return;

        /**
         * creates a draggable placeholder element.
         * @param {string} id - unique identifier for the placeholder.
         * @returns {htmlelement}
         */
        const createPlaceholder = (id) => {
            const div = document.createElement('div');
            div.className = "kpi-panel rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-800/40 flex items-center justify-center draggable min-h-[112px] group";
            div.dataset.widget = id;
            div.draggable = true;
            div.innerHTML = `
                <div class="drag-handle cursor-grab p-4 flex flex-col items-center gap-2">
                    <i class="fa-solid fa-grip-lines text-slate-200 dark:text-slate-800 group-hover:text-slate-400 transition-colors text-xs"></i>
                    <i class="fa-solid fa-trash-can text-slate-100 dark:text-slate-900 group-hover:text-rose-500/50 transition-colors text-[10px] cursor-pointer" onclick="this.closest('.draggable').remove(); localStorage.setItem('widgetOrder', JSON.stringify([...document.querySelectorAll('.draggable')].map(el => el.dataset.widget)));"></i>
                </div>
            `;
            return div;
        };

        const savedOrder = JSON.parse(localStorage.getItem('widgetOrder'));
        const savedState = JSON.parse(localStorage.getItem('widgetState')) || {};

        /** * hide disabled widgets */
        document.querySelectorAll('.draggable').forEach(el => {
            if (savedState[el.dataset.widget] === false) el.style.display = 'none';
        });

        /** * restore order and recreate placeholders */
        if (savedOrder) {
            savedOrder.forEach(id => { 
                let el = grid.querySelector(`[data-widget="${id}"]`); 
                if (!el && id.startsWith('placeholder-')) {
                    el = createPlaceholder(id);
                }
                if (el) grid.appendChild(el); 
            });
        }

        /** * event listener for adding new placeholders */
        $('#btn-add-placeholder').on('click', () => {
            const newId = `placeholder-${Date.now()}`;
            grid.appendChild(createPlaceholder(newId));
            localStorage.setItem('widgetOrder', JSON.stringify([...grid.querySelectorAll('.draggable')].map(el => el.dataset.widget)));
        });

        initDragAndDrop(grid);
        initMainChart(document.documentElement.classList.contains('dark'));
        
        /** * initialize sparklines for all kpi cards */
        window.chartInstances = {};
        const keys = ['kpiMissionsIncoming', 'kpiMissionsProcessed', 'kpiMissionSuccessRate', 'kpiSpeechesIncoming', 'kpiSpeechesProcessed', 'kpiCreditsPerHour'];
        keys.forEach(key => {
            const ctx = document.getElementById(`sparkline-widget-kpi-${key}`);
            if (ctx) {
                window.chartInstances[key] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array(20).fill(''),
                        datasets: [{ data: Array(20).fill(0), borderColor: '#94a3b8', borderWidth: 1.5, pointRadius: 0, fill: true, backgroundColor: 'rgba(148, 163, 184, 0.05)', tension: 0.4 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } }
                });
            }
        });
    }
};

/**
 * initializes drag and drop logic for dashboard grid.
 * @param {htmlelement} grid - the grid container element.
 * @returns {void}
 */
function initDragAndDrop(grid) {
    let draggedItem = null;
    grid.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.draggable');
        if (draggedItem) setTimeout(() => draggedItem.classList.add('dragging'), 0);
    });
    grid.addEventListener('dragend', () => {
        if (!draggedItem) return;
        draggedItem.classList.remove('dragging');
        localStorage.setItem('widgetOrder', JSON.stringify([...grid.querySelectorAll('.draggable')].map(el => el.dataset.widget)));
        draggedItem = null;
    });
    grid.addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.draggable');
        if (target && target !== draggedItem) {
            const items = [...grid.querySelectorAll('.draggable')];
            items.indexOf(draggedItem) < items.indexOf(target) ? target.after(draggedItem) : target.before(draggedItem);
        }
    });
}

/**
 * initializes the main activity chart using chart.js.
 * @param {boolean} isdark - determines if dark mode colors should be used.
 * @returns {void}
 */
function initMainChart(isDark) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [{ label: 'Einsätze', data: [45, 52, 48, 70, 85, 65, 90], borderColor: '#64748b', backgroundColor: 'rgba(100, 116, 139, 0.05)', borderWidth: 2, tension: 0.4, fill: true }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: isDark ? '#334155' : '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
            }
        }
    });
}