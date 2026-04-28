// file: /js/components/DataTable.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * renders a data table widget.
 * @param {string} id - widget id.
 * @param {string} title - widget title.
 * @param {array} rows - table data.
 * @returns {string} html string.
 */
export const DataTable = (id, title, rows = []) => {
    return `
        <div class="kpi-panel rounded-xl p-5 col-span-1 md:col-span-2 draggable" data-widget="${id}" draggable="true">
            <div class="flex justify-between items-center mb-4 drag-handle cursor-grab">
                <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">${title}</h2>
                <i class="fa-solid fa-grip-lines text-slate-200 dark:text-slate-700"></i>
            </div>
            <div class="overflow-x-auto text-xs">
                <table class="w-full text-left">
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${rows.map(row => `
                            <tr>
                                <td class="py-2 text-slate-600 dark:text-slate-300 text-left">${row.label}</td>
                                <td class="py-2 text-right font-mono">${row.value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};