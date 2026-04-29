// file: /js/views/Settings.js
// version: 1.0.0.3, 29.04.2026 16:30

import { I18nService } from '../services/i18n.js';

export const Settings = {
    /**
     * renders the settings view with showroom-style category filters.
     * @async
     * @returns {string} html template.
     */
    render: async () => {
        const { t } = I18nService;
      
        return `
            <div class="view-section w-full">
                <div class="mb-6 px-1">
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left">${t('settings.title')}</h1>
                    <p class="text-sm text-slate-500 mt-1 text-left">${t('settings.subtitle')}</p>
                </div>

                <div class="flex flex-col gap-4 mb-8 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <div class="relative w-full">
                        <i class="fa-solid fa-search absolute left-3 top-3 text-slate-400"></i>
                        <input type="text" id="settings-search" placeholder="${t('settings.search.empty')}" class="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-base transition-colors">
                    </div>
                    <div class="flex gap-2 overflow-x-auto pb-1 hide-scroll">
                        <button class="settings-filter-btn active px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-base text-white transition-colors whitespace-nowrap" data-filter="all">${t('settings.category.all')}</button>
                        <button class="settings-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap" data-filter="system">${t('settings.category.system')}</button>
                        <button class="settings-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap" data-filter="stats">${t('settings.category.stats')}</button>
                        <button class="settings-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap" data-filter="visuals">${t('settings.category.visuals')}</button>
                    </div>
                </div>

                <div id="settings-widget-list" class="space-y-8 pb-10 w-full"></div>
            </div>
        `;
    },

    /**
     * initializes event listeners and populates the widget list.
     * @async
     * @returns {void}
     */
    after_render: async () => {
      const { t } = I18nService;
      
      const widgetConfig = [
          { id: 'widget-kpi-kpiMissionsIncoming', title: t('settings.kpi.missionsIncoming'), desc: t('settings.kpi.missionsIncoming_desc'), cat: 'stats' },
          { id: 'widget-kpi-kpiMissionsProcessed', title: t('settings.kpi.missionsProcessed'), desc: t('settings.kpi.missionsProcessed_desc'), cat: 'stats' },
          { id: 'widget-kpi-kpiMissionSuccessRate', title: t('settings.kpi.missionSuccessRate'), desc: t('settings.kpi.missionSuccessRate_desc'), cat: 'stats' },
          { id: 'widget-kpi-kpiSpeechesIncoming', title: t('settings.kpi.speechesIncoming'), desc: t('settings.kpi.speechesIncoming_desc'), cat: 'stats' },
          { id: 'widget-kpi-kpiSpeechesProcessed', title: t('settings.kpi.speechesProcessed'), desc: t('settings.kpi.speechesProcessed_desc'), cat: 'stats' },
          { id: 'widget-kpi-kpiCreditsPerHour', title: t('settings.kpi.creditsPerHour'), desc: t('settings.kpi.creditsPerHour_desc'), cat: 'stats' },
          //{ id: 'widget-chart', title: 'Aktivitätsverlauf', desc: 'Liniendiagramm für die Einsätze.', cat: 'visuals' },
          //{ id: 'widget-table-missions', title: 'Häufigste Einsatzarten', desc: 'Tabelle der Einsätze inkl. Sparkline.', cat: 'visuals' },
          //{ id: 'widget-table-buildings', title: 'Meist alarmierte Gebäude', desc: 'Tabelle der Wachen mit den meisten Alarmen.', cat: 'visuals' }
      ];

        const categories = [ 'system', 'stats', 'visuals'];
      
        const container = $('#settings-widget-list');
        const savedState = JSON.parse(localStorage.getItem('widgetState')) || {};

        /**
         * filters visible widgets based on search input and category.
         * @returns {void}
         */
        const filterSettings = () => {
            let term = $('#settings-search').val().toLowerCase();
            let activeCat = $('.settings-filter-btn.active').data('filter');

            $('.settings-group').each(function() {
                let group = $(this);
                if (activeCat !== 'all' && group.data('category') !== activeCat) {
                    group.hide();
                    return;
                }
                let hasVisibleItems = false;
                group.find('.setting-item').each(function() {
                    let item = $(this);
                    if (item.data('title').includes(term)) {
                        item.show();
                        hasVisibleItems = true;
                    } else {
                        item.hide();
                    }
                });
                hasVisibleItems ? group.fadeIn(200) : group.hide();
            });
        };

        for (const catId of categories) {
            const catWidgets = widgetConfig.filter(w => w.cat === catId);
            if (catWidgets.length === 0) continue;

            let groupHtml = `
                <div class="settings-group w-full" data-category="${catId}">
                    <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1 text-left">${t(`settings.category.${catId}`)}</h2>
                    <div class="bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
            `;

            catWidgets.forEach(w => {
                const isVisible = savedState[w.id] !== undefined ? savedState[w.id] : true;
                groupHtml += `
                    <div class="setting-item p-4 flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20" data-title="${w.title.toLowerCase()}">
                        <div class="pr-4 flex-1 text-left">
                            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">${w.title}</h3>
                            <p class="text-xs text-slate-500 mt-0.5">${w.desc}</p>
                        </div>
                        <div class="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-${w.id}" data-widget-id="${w.id}" ${isVisible ? 'checked' : ''} class="settings-toggle toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-300 dark:border-slate-600 appearance-none cursor-pointer z-10"/>
                            <label for="toggle-${w.id}" class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-700 cursor-pointer"></label>
                        </div>
                    </div>
                `;
            });
            groupHtml += `</div></div>`;
            container.append(groupHtml);
        }

        /**
         * saves the visibility state of a widget to localstorage.
         * @returns {void}
         */
        $('.settings-toggle').on('change', function() {
            const id = $(this).data('widget-id');
            const isVisible = $(this).is(':checked');
            const state = JSON.parse(localStorage.getItem('widgetState')) || {};
            state[id] = isVisible;
            localStorage.setItem('widgetState', JSON.stringify(state));
            if(window.showToast) window.showToast(`Modul ${isVisible ? 'aktiviert' : 'deaktiviert'}.`);
        });

        /**
         * handles filter button clicks and updates button styles.
         * @returns {void}
         */
        $('.settings-filter-btn').on('click', function() {
            $('.settings-filter-btn').removeClass('active bg-brand-base text-white').addClass('bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300');
            $(this).addClass('active bg-brand-base text-white').removeClass('bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300');
            filterSettings();
        });

        /**
         * triggers filtering on search input.
         * @returns {void}
         */
        $('#settings-search').on('input', filterSettings);
    }
};