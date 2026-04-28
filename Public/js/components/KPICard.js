// file: /js/components/KPICard.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * renders a kpi card component.
 * @param {object} conf - card configuration.
 * @returns {string} html string.
 */
export const KPICard = (conf) => {
    const statKey = conf.id.replace('widget-kpi-', '');

    const formatValue = (v) => new Intl.NumberFormat('de-DE').format(v);
    const formatTrend = (v) => (v >= 0 ? '+' : '') + new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v) + '%';

    const getTrendColor = (v) => {
        if (v > 0) return 'text-emerald-500';
        if (v < 0) return 'text-rose-500';
        return 'text-slate-400';
    };

    const displayVal = typeof conf.val === 'number' ? formatValue(conf.val) : conf.val;
    const displaySub = typeof conf.sub === 'number' ? formatTrend(conf.sub) : conf.sub;
    const trendColor = typeof conf.sub === 'number' ? getTrendColor(conf.sub) : 'text-slate-400';

    return `
        <div class="kpi-panel rounded-xl p-3 flex flex-col justify-between h-28 shadow-sm draggable" 
             data-widget="${conf.id}" draggable="true">
            <div class="flex justify-between items-start">
                <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight text-left">${conf.title}</span>
                <i class="fa-solid fa-grip-lines text-slate-200 dark:text-slate-700 text-[10px] drag-handle cursor-grab"></i>
            </div>
            <div class="flex items-end justify-between mt-1">
                <div>
                    <h3 id="stat-val-${statKey}" class="text-xl font-bold text-slate-800 dark:text-white leading-none text-left">${displayVal}</h3>
                    <div class="flex items-center mt-1">
                        <span id="stat-color-${statKey}" class="${trendColor} text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/50">
                            <span id="stat-sub-${statKey}">${displaySub}</span>
                        </span>
                        <span class="text-[9px] text-slate-400 ml-1.5 whitespace-nowrap text-left">${conf.subLabel}</span>
                    </div>
                </div>
                <div class="w-20 h-10 overflow-hidden"><canvas id="sparkline-${conf.id}"></canvas></div>
            </div>
        </div>
    `;
};