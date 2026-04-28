// file: /js/components/LiveConsole.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * renders the live console component.
 * @param {string} title - component title.
 * @returns {string} html string.
 */
export const LiveConsole = (title = "Live-Konsole") => {
    return `
        <div class="flex flex-col flex-1 overflow-hidden">
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1 flex-shrink-0 text-left">
                ${title}
            </div>
            <div id="mini-log-container" class="bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded p-2 font-mono text-[10px] flex-1 overflow-y-auto log-scroll text-slate-500 text-left">
                </div>
        </div>
    `;
};