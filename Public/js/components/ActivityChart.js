// file: /js/components/ActivityChart.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * renders the activity chart container.
 * @param {string} title - section title.
 * @returns {string} html string.
 */
export const ActivityChart = (title = "Aktivitätsverlauf (24h)") => {
    return `
        <div class="kpi-panel rounded-xl p-5 col-span-1 md:col-span-2 lg:col-span-4 draggable min-h-[300px]" data-widget="widget-chart" draggable="true">
            <div class="flex justify-between items-center mb-6 drag-handle cursor-grab">
                <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">${title}</h2>
                <i class="fa-solid fa-grip-lines text-slate-200 dark:text-slate-700"></i>
            </div>
            <div class="h-64">
                <canvas id="mainChart"></canvas>
            </div>
        </div>
    `;
};