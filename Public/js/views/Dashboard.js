// file: /js/views/Dashboard.js
// version: 1.0.0.0, 26.04.2026 19:45

import { API } from '../api.js';
import { KPICard } from '../components/KPICard.js';
import { ActivityChart } from '../components/ActivityChart.js';
import { DataTable } from '../components/DataTable.js';

export const Dashboard = {
    /**
     * renders the dashboard view structure and initial kpi cards.
     * @async
     * @returns {string} html template.
     */
    render: async () => {
        const stats = await API.getStats();

        const kpiConfigs = [
          { id: 'widget-kpi-kpiMissionsIncoming', title: 'Einsätze (Neu)', val: stats.kpiMissionsIncoming.val, sub: stats.kpiMissionsIncoming.sub, subLabel: 'vs. Vorstunde' },
          { id: 'widget-kpi-kpiMissionsProcessed', title: 'Bearbeitet', val: stats.kpiMissionsProcessed.val, sub: stats.kpiMissionsProcessed.sub, subLabel: 'vs. Vorstunde' },
          { id: 'widget-kpi-kpiMissionSuccessRate', title: 'Erfolgsquote', val: stats.kpiMissionSuccessRate.val, sub: stats.kpiMissionSuccessRate.sub, subLabel: 'vs. Vorstunde' },
          { id: 'widget-kpi-kpiCreditsPerHour', title: '⌀ Credits / Stunde', val: stats.kpiCreditsPerHour.val, sub: stats.kpiCreditsPerHour.sub, subLabel: 'vs. Vorstunde' }
        ];

        const missionData = [{ label: 'Brennender Mülleimer', value: '412' }, { label: 'Verkehrsunfall', value: '308' }, { label: 'Krankentransport', value: '189' }];
        const buildingData = [{ label: 'Feuerwache 1 (Mitte)', value: '845' }, { label: 'Rettungswache Nord', value: '632' }, { label: 'Polizei Revier 3', value: '412' }];

        return `
            <div class="view-section w-full">
                <div class="flex justify-between items-end mb-6 px-1">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left">Dashboard</h1>
                        <p class="text-sm text-slate-500 mt-1 text-left">Echtzeit-Analyse der Bot-Aktivitäten.</p>
                    </div>
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
     * initializes dashboard components and interactive elements.
     * @async
     * @returns {void}
     */
    after_render: async () => {
        const grid = document.getElementById('dashboard-grid');
        if (!grid) return;

        const savedOrder = JSON.parse(localStorage.getItem('widgetOrder'));
        const savedState = JSON.parse(localStorage.getItem('widgetState')) || {};

        document.querySelectorAll('.draggable').forEach(el => {
            if (savedState[el.dataset.widget] === false) el.style.display = 'none';
        });

        if (savedOrder) {
            savedOrder.forEach(id => { const el = grid.querySelector(`[data-widget="${id}"]`); if (el) grid.appendChild(el); });
        }

        initDragAndDrop(grid);
        initMainChart(document.documentElement.classList.contains('dark'));

        window.chartInstances = {};
        const keys = ['kpiMissionsIncoming', 'kpiMissionsProcessed', 'kpiMissionSuccessRate', 'kpiCreditsPerHour'];
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