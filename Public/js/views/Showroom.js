// file: /js/views/Showroom.js
// version: 1.0.0.1, 26.04.2026 20:05

import { Badge } from '../components/Badge.js';

/**
 * view module for the script showroom.
 * handles script listing, filtering, and pagination.
 * @namespace
 */
export const Showroom = {
    /**
     * renders the showroom view template.
     * @async
     * @returns {string} html template.
     */
    render: async () => {
        const scripts = [
            { id: 'S1', status: ['kostenlos'], cat: 'alarm', title: 'Basis Auto-Alarm', ver: 'v2.1.4', date: '22.04.2026' },
            { id: 'S2', status: ['premium'], cat: 'sprechwunsch', title: 'Sprechwunsch Master AI', ver: 'v3.0.1', date: '20.04.2026' },
            { id: 'S3', status: ['individual'], cat: 'ui', title: 'Custom Brand Overhaul', ver: 'v1.0.0', date: '15.04.2026' },
            { id: 'S4', status: ['kostenlos'], cat: 'ui', title: 'Map Cleaner', ver: 'v1.0.5', date: '10.02.2026' },
            { id: 'S5', status: ['premium'], cat: 'sprechwunsch', title: 'Patienten-Logistik Pro', ver: 'v2.2.0', date: '01.01.2026' },
            { id: 'S6', status: ['individual'], cat: 'alarm', title: 'Verband-Großeinsatz-Tool', ver: 'v1.1.0', date: '12.12.2025' },
            { id: 'S7', status: ['kostenlos'], cat: 'alarm', title: 'Status 5 Filter', ver: 'v4.0.2', date: '05.11.2025' },
            { id: 'S8', status: ['premium'], cat: 'sprechwunsch', title: 'Polizei-Gefangenen-Check', ver: 'v1.5.3', date: '20.10.2025' },
            { id: 'S9', status: ['individual'], cat: 'ui', title: 'Expert Dashboard Kit', ver: 'v2.0.0', date: '15.09.2025' },
            { id: 'S10', status: ['kostenlos'], cat: 'alarm', title: 'Rettungsdienst-Fokus', ver: 'v1.0.0', date: '01.09.2025' },
            { id: 'S11', status: ['premium'], cat: 'sprechwunsch', title: 'Klinik-Finder Plus', ver: 'v1.8.2', date: '12.08.2025' },
            { id: 'S12', status: ['individual'], cat: 'ui', title: 'Sidebar Customizer', ver: 'v1.4.0', date: '05.08.2025' },
            { id: 'S13', status: ['kostenlos'], cat: 'alarm', title: 'Brandmelder-Filter', ver: 'v2.3.1', date: '28.07.2025' },
            { id: 'S14', status: ['premium', 'individual'], cat: 'sprechwunsch', title: 'Transport-Logistik Elite', ver: 'v1.2.9', date: '10.07.2025' },
            { id: 'S15', status: ['premium', 'individual'], cat: 'ui', title: 'Dark Mode Gold Edition', ver: 'v3.0.5', date: '01.07.2025' }
        ];

        /**
         * returns tailwind background color based on script status.
         * @param {string[]} statusArray - array of status strings.
         * @returns {string} tailwind class.
         */
        const getAccentColor = (statusArray) => {
            if(statusArray.includes('individual')) return 'bg-indigo-500';
            if(statusArray.includes('premium')) return 'bg-amber-500';
            return 'bg-emerald-500';
        };

        /**
         * generates the download button html based on availability.
         * @param {string[]} statusArray - array of status strings.
         * @returns {string} button html string.
         */
        const getButton = (statusArray) => {
            if(statusArray.includes('kostenlos')) {
                return `<button class="bg-slate-800 dark:bg-slate-700 text-white hover:bg-brand-base transition-colors px-4 py-1.5 rounded text-[10px] font-bold flex items-center gap-2"><i class="fa-solid fa-download"></i> HERUNTERLADEN</button>`;
            }
            return `<button class="bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed px-4 py-1.5 rounded text-[10px] font-bold flex items-center gap-2" disabled><i class="fa-solid fa-lock"></i> HERUNTERLADEN</button>`;
        };

        return `
            <div class="view-section w-full">
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white text-left">Script Showroom</h1>
                    <p class="text-sm text-slate-500 mt-1 text-left">Verwalte und entdecke Erweiterungen für deine Leitstelle.</p>
                </div>

                <div class="flex flex-col gap-4 mb-8 bg-white dark:bg-brand-panel p-4 rounded-xl border border-brand-border dark:border-brand-borderDark shadow-sm">
                    <div class="relative flex-1">
                        <i class="fa-solid fa-search absolute left-3 top-3 text-slate-400"></i>
                        <input type="text" id="script-search" placeholder="Scripts durchsuchen..." class="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-base transition-colors">
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-btn active px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-base text-white transition-colors" data-filter="all">Alle</button>
                        <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" data-filter="alarm">Alarmierung</button>
                        <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" data-filter="sprechwunsch">Sprechwünsche</button>
                        <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" data-filter="ui">UI & Optik</button>
                        <div class="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center"></div>
                        <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 transition-colors" data-filter-status="kostenlos">Kostenlos</button>
                        <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 transition-colors" data-filter-status="premium">Premium</button>
                        <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 transition-colors" data-filter-status="individual">Individual</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10" id="script-grid">
                    ${scripts.map(s => `
                        <div class="script-card kpi-panel rounded-xl p-6 flex flex-col relative overflow-hidden transition-all duration-300" 
                             data-category="${s.cat}" 
                             data-status="${s.status.join(',')}" 
                             data-title="${s.title.toLowerCase()}">
                            <div class="absolute top-0 left-0 w-1 h-full ${getAccentColor(s.status)}"></div>
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex flex-wrap items-center gap-2">
                                    <i class="fa-solid fa-file-code text-slate-400 text-lg"></i>
                                    ${s.status.map(stat => Badge(stat)).join('')}
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="text-[9px] bg-slate-50 dark:bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-100 dark:border-slate-800 font-medium">
                                        <i class="fa-regular fa-clock mr-1"></i>${s.date}
                                    </span>
                                    <span class="bg-slate-100 dark:bg-slate-800 text-[9px] px-2 py-1 rounded text-slate-500 font-mono font-bold">${s.ver}</span>
                                </div>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-2 text-left">${s.title}</h3>
                            <p class="text-xs text-slate-500 mb-6 leading-relaxed flex-1 italic text-left">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <div class="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                ${s.status.includes('kostenlos') 
                                    ? `<span class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest"><i class="fa-solid fa-circle-check mr-1 text-left"></i> Verfügbar</span>`
                                    : `<span class="text-[10px] text-rose-500 font-bold uppercase tracking-widest"><i class="fa-solid fa-ban mr-1 text-left"></i> Gesperrt</span>`
                                }
                                ${getButton(s.status)}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="flex justify-center items-center gap-2 pb-10" id="pagination-controls">
                    <button class="p-2 w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30" id="prev-page"><i class="fa-solid fa-chevron-left text-left"></i></button>
                    <div id="page-numbers" class="flex gap-2 text-left"></div>
                    <button class="p-2 w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30" id="next-page"><i class="fa-solid fa-chevron-right text-left"></i></button>
                </div>
            </div>
        `;
    },

    /**
     * initializes interactive elements, filtering and pagination.
     * @async
     * @returns {void}
     */
    after_render: async () => {
        const itemsPerPage = 9;
        let currentPage = 1;
        let $allCards = $('.script-card');
        let filteredCards = $allCards;

        /**
         * updates the visible cards and pagination buttons.
         * @returns {void}
         */
        function updateDisplay() {
            const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
            $allCards.hide();
            filteredCards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).fadeIn(300);

            const $nums = $('#page-numbers').empty();
            for (let i = 1; i <= totalPages; i++) {
                const activeClass = i === currentPage ? 'bg-brand-base text-white border-brand-base' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800';
                $nums.append(`<button class="page-num w-10 h-10 rounded-lg border text-sm font-bold transition-colors ${activeClass}" data-page="${i}">${i}</button>`);
            }

            $('#prev-page').prop('disabled', currentPage === 1);
            $('#next-page').prop('disabled', currentPage === totalPages || totalPages === 0);
        }

        /**
         * filters cards based on search term and category/status buttons.
         * @returns {void}
         */
        function handleFilter() {
            const term = $('#script-search').val().toLowerCase();
            const $activeBtn = $('.filter-btn.active');
            const activeCat = $activeBtn.data('filter');
            const activeStatus = $activeBtn.data('filter-status');

            filteredCards = $allCards.filter(function() {
                const card = $(this);
                const matchTitle = card.data('title').includes(term);
                
                let matchCat = true;
                if (activeCat && activeCat !== 'all') {
                    matchCat = card.data('category') === activeCat;
                }

                let matchStatus = true;
                if (activeStatus) {
                    const cardStatuses = card.data('status').split(',');
                    matchStatus = cardStatuses.includes(activeStatus);
                }

                return matchTitle && matchCat && matchStatus;
            });

            currentPage = 1;
            updateDisplay();
        }

        $('.filter-btn').on('click', function() {
            $('.filter-btn').removeClass('active bg-brand-base text-white').addClass('bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300');
            $(this).addClass('active bg-brand-base text-white');
            handleFilter();
        });

        $('#script-search').on('input', handleFilter);

        $(document).on('click', '.page-num', function() {
            currentPage = $(this).data('page');
            updateDisplay();
            $('#main-scroll-area').animate({ scrollTop: 0 }, 300);
        });

        $('#prev-page').on('click', () => { if(currentPage > 1) { currentPage--; updateDisplay(); } });
        $('#next-page').on('click', () => { if(currentPage < Math.ceil(filteredCards.length / itemsPerPage)) { currentPage++; updateDisplay(); } });

        updateDisplay();
    }
};