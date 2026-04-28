// file: /js/components/Badge.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * renders a status badge.
 * @param {string} status - status key.
 * @returns {string} html string.
 */
export const Badge = (status) => {
    const config = {
        'kostenlos': {
            icon: 'fa-check',
            label: 'Kostenlos',
            classes: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
        },
        'premium': {
            icon: 'fa-crown',
            label: 'Premium',
            classes: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'
        },
        'individual': {
            icon: 'fa-user-gear',
            label: 'Individual',
            classes: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20'
        }
    };

    const c = config[status];
    if (!c) return '';

    return `
        <span class="${c.classes} text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider border">
            <i class="fa-solid ${c.icon} mr-1"></i> ${c.label}
        </span>
    `;
};