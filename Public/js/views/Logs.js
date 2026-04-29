// file: /js/views/Logs.js
// version: 1.0.0.3, 29.04.2026 16:30

import { I18nService } from '../services/i18n.js';

/**
 * view module for system live-logs.
 * @namespace
 */
export const Logs = {
    /**
     * renders the log view structure with filter controls.
     * @async
     * @returns {string} html template string.
     */
    render: async () => {
        const { t } = I18nService;
      
        return `
            <div class="view-section w-full flex flex-col h-[calc(100vh-6rem)]">
                <div class="mb-6 px-1">
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left">${t('live_logs.title')}</h1>
                    <p class="text-sm text-slate-500 mt-1 text-left">${t('live_logs.subtitle')}</p>
                </div>

                <div class="kpi-panel rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end shadow-sm">
                    <div class="flex flex-col gap-1 col-span-1">
                        <label class="text-[10px] uppercase font-bold text-slate-400 text-left">${t('live_logs.search.date')}</label>
                        <input type="date" id="filter-date" class="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-base">
                    </div>
                    <div class="flex flex-col gap-1 col-span-1">
                        <label class="text-[10px] uppercase font-bold text-slate-400 text-left">${t('live_logs.search.start')}</label>
                        <input type="time" id="filter-time-start" class="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-base">
                    </div>
                    <div class="flex flex-col gap-1 col-span-1">
                        <label class="text-[10px] uppercase font-bold text-slate-400 text-left">${t('live_logs.search.stop')}</label>
                        <input type="time" id="filter-time-end" class="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-base">
                    </div>

                    <div class="flex flex-col gap-1 col-span-1 md:col-span-2 lg:col-span-3">
                        <label class="text-[10px] uppercase font-bold text-slate-400 text-left">${t('live_logs.search.button.apply_title')}</label>
                        <div class="flex gap-2">
                            <button id="btn-apply-filter" class="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg text-xs hover:bg-slate-600 transition-colors uppercase font-bold flex items-center justify-center">
                                <i class="fa-solid fa-filter mr-2"></i> ${t('live_logs.search.button.apply')}
                            </button>
                            <button id="btn-export-logs" class="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase font-bold flex items-center justify-center">
                                <i class="fa-solid fa-file-export mr-2"></i> ${t('live_logs.search.button.export')}
                            </button>
                            <button onclick="$('#filter-time-start, #filter-time-end, #filter-date').val('');" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs hover:bg-slate-200 transition-colors uppercase" title="Reset">
                                <i class="fa-solid fa-undo"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="kpi-panel rounded-xl flex-1 overflow-hidden flex flex-col shadow-sm">
                    <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-brand-border dark:border-brand-borderDark text-[10px] text-slate-500 font-mono flex justify-between items-center uppercase tracking-widest">
                        <span>system_log_stream.sh</span>
                        <div class="flex gap-4">
                            <button id="btn-clear-global" class="hover:text-rose-500 transition-colors"><i class="fa-solid fa-eraser mr-1"></i>${t('live_logs.search.button.clean')}</button>
                        </div>
                    </div>
                    <div id="full-log-container" class="bg-white dark:bg-[#0B1120] p-4 overflow-y-auto log-scroll flex-1 text-slate-600 dark:text-slate-400">
                        </div>
                </div>
            </div>
        `;
    },

    /**
     * initializes listeners for filtering, buffer clearing and exporting.
     * @async
     * @returns {void}
     */
    after_render: async () => {
        const { t } = I18nService;
        const $container = $('#full-log-container');

        /**
         * updates the ui with given log data.
         * @param {array} [filteredlogs=window.systemLogs] - log data to render.
         * @returns {void}
         */
        const renderLogs = (filteredlogs = window.systemLogs) => {
            $container.empty();
            if (!filteredlogs || filteredlogs.length === 0) {
                $container.append(`<div class="opacity-30 italic text-center py-10 text-xs">${t('live_logs.noEntities')}</div>`);
                return;
            }
            
            let logHtml = '';
            filteredlogs.forEach(log => {
                logHtml += `
                    <div class="py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0 text-xs font-mono text-left">
                        <span class="opacity-50">[${log.time}]</span> ${log.prefix} ${log.msg}
                    </div>`;
            });
            
            $container.append(logHtml);
            $container.scrollTop($container[0].scrollHeight);
        };

        renderLogs();

        /**
         * handles filter application based on date and time inputs.
         * @returns {void}
         */
        $('#btn-apply-filter').on('click', () => {
          const dateVal = $('#filter-date').val();
          const startTime = $('#filter-time-start').val();
          const endTime = $('#filter-time-end').val();

          const filtered = window.systemLogs.filter(log => {
            const matchDate = dateVal ? log.date === dateVal : true;
            const matchStart = startTime ? log.time >= (startTime + ":00") : true;
            const matchEnd = endTime ? log.time <= (endTime + ":59") : true;
            return matchDate && matchStart && matchEnd;
          });

          renderLogs(filtered);
        });

        /**
         * clears the global log buffer.
         * @returns {void}
         */
        $('#btn-clear-global').on('click', () => {
            window.systemLogs = [];
            renderLogs();
            if(window.showToast) window.showToast("Buffer geleert.");
        });

        /**
         * exports logs to a downloadable csv file.
         * @returns {void}
         */
        $('#btn-export-logs').on('click', () => {
            if (!window.systemLogs || window.systemLogs.length === 0) return;
            let csvContent = "data:text/csv;charset=utf-8,Zeit;Status;Meldung\n";
            window.systemLogs.forEach(log => {
                const cleanPrefix = log.prefix.replace(/<[^>]*>?/gm, '');
                csvContent += `${log.time};${cleanPrefix};${log.msg}\n`;
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "MC_Bot_Logs.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }
};