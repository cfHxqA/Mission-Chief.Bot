// file: /js/app.js
// version: 1.0.0.6, 29.04.2026 16:30

import { I18nService } from './services/i18n.js';
import { SocketService } from './socket.js';
import { Dashboard } from './views/Dashboard.js';
import { Showroom } from './views/Showroom.js';
import { Settings } from './views/Settings.js';
import { Logs } from './views/Logs.js';
import { VehicleEditor } from './views/editor/VehicleEditor.js';
import { MissionEditor } from './views/editor/MissionEditor.js';
import { ScriptEditor } from './views/editor/ScriptEditor.js';
import { Login } from './views/Login.js';

window.systemLogs = []; 
/** @type {boolean} tracking state to ensure socket is only initialized once */
let socketInitialized = false;

/**
 * verifies the authentication status with the server via pre-routing check.
 * @async
 * @returns {promise<boolean>} true if the server session is valid.
 */
const checkAuth = async () => {
    try {
        const response = await fetch('/auth-check');
        return response.ok;
    } catch (err) {
        return false;
    }
};

/**
 * writes a log message to the global store and updates ui components.
 * @param {string} msg - log message content.
 * @param {string} type - severity level.
 */
window.addSystemLog = function(msg, type = 'info') {
    const now = new Date();
    const time = now.toLocaleTimeString('de-DE', { hour12: false });
    const date = now.toISOString().split('T')[0];
    
    let prefixStr = type === 'success' ? "<span class='text-emerald-500'>[OK]</span>" : 
                   (type === 'warn' ? "<span class='text-amber-500'>[WARN]</span>" : 
                   (type === 'error' ? "<span class='text-rose-500'>[ERR]</span>" : 
                   "<span class='text-slate-400'>[INFO]</span>"));

    window.systemLogs.push({ date, time, prefix: prefixStr, msg });
    if (window.systemLogs.length > 500) window.systemLogs.shift();

    const miniContainer = $('#mini-log-container');
    if (miniContainer.length) {
        const $log = $(`<div style="display:none;" class="py-0.5 text-xs font-mono leading-tight text-left border-b border-slate-100/5 dark:border-slate-800/30 last:border-0">
            <span class="opacity-50">[${time}]</span> ${prefixStr} ${msg}
        </div>`);
        miniContainer.find('.opacity-30').remove();
        miniContainer.append($log);
        $log.fadeIn(200);
        while (miniContainer.children().length > 15) miniContainer.children().first().remove();
        miniContainer.scrollTop(miniContainer[0].scrollHeight);
    }

    const fullContainer = $('#full-log-container');
    if (fullContainer.length) {
        const $log = $(`<div style="display:none;" class="py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0 text-xs font-mono text-left">
            <span class="opacity-50">[${time}]</span> ${prefixStr} ${msg}
        </div>`);
        fullContainer.find('.opacity-30').remove();
        fullContainer.append($log);
        $log.fadeIn(200);
        fullContainer.scrollTop(fullContainer[0].scrollHeight);
    }
};

/**
 * updates the bot connection status indicators in the sidebar.
 * @param {boolean} isonline - connection state.
 */
window.updateBotStatus = function(isonline) {
    const ping = $('#status-ping');
    const dot = $('#status-dot');
    const text = $('#status-text');
    if (isonline) {
        ping.removeClass('hidden');
        dot.removeClass('bg-rose-500').addClass('bg-emerald-500');
        text.text('Online').addClass('text-emerald-600').removeClass('text-rose-600');
    } else {
        ping.addClass('hidden');
        dot.removeClass('bg-emerald-500').addClass('bg-rose-500');
        text.text('Offline').addClass('text-rose-600').removeClass('text-emerald-600');
    }
};

/**
 * application routes mapping.
 * @type {object}
 */
const routes = { 
    '/': Dashboard, 
    '/dashboard': Dashboard, 
    '/livelogs': Logs, 
    '/showroom': Showroom, 
    '/settings': Settings,
    '/vehicle_editor': VehicleEditor,
    '/mission_editor': MissionEditor,
    '/script_editor': ScriptEditor,
    '/login': Login 
};

/**
 * handles navigation and view rendering, enforcing hash-based authentication guards.
 * @async
 * @returns {void}
 */
const router = async () => {
    const content = document.getElementById('app-content');
    
    /** * extract route from hash */
    let parsedURL = location.hash.slice(1).toLowerCase() || '/';
    let routeKey = parsedURL.startsWith('/') ? parsedURL : `/${parsedURL}`;

    /** * authentication check */
    const authenticated = await checkAuth();
    const isLoginView = routeKey === '/login';

    /** * hash enforcement for unauthenticated users */
    if (!authenticated && !isLoginView) {
        socketInitialized = false;
        window.location.hash = '#/login';
        return;
    }

    /** * handle authenticated state */
    if (authenticated) {
        /** * establish socket once after successful auth */
        if (!socketInitialized) {
            SocketService.connect();
            socketInitialized = true;
        }
        
        /** * redirect from login view if already authenticated */
        if (isLoginView) {
            window.location.hash = '#/dashboard';
            return;
        }
    }

    /** * view component selection */
    let page = routes[routeKey] ? routes[routeKey] : Dashboard;

    /** * toggle navigation element visibility */
    const sidebar = document.querySelector('aside');
    const header = document.querySelector('header');
    if (sidebar) sidebar.style.display = isLoginView ? 'none' : 'flex';
    if (header) header.style.display = isLoginView ? 'none' : 'flex';

    /** * render view content */
    content.innerHTML = '<div class="flex justify-center mt-20"><i class="fa-solid fa-circle-notch fa-spin text-3xl text-slate-400"></i></div>';
    content.innerHTML = await page.render();
    await page.after_render();

    /** * sync active navigation state */
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-active');
        const href = link.getAttribute('href');
        const isDashboardAlias = (routeKey === '/' || routeKey === '/dashboard') && (href === '#/dashboard' || href === '#/');
        if (href === `#${routeKey}` || isDashboardAlias) {
            link.classList.add('nav-active');
        }
    });
};

/**
 * listener for incoming bot statistics.
 */
window.addEventListener('botStats', (e) => {
    const stats = e.detail;
    const formatValue = (num) => new Intl.NumberFormat('de-DE').format(num);
    const formatTrend = (num) => (num >= 0 ? '+' : '') + new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(num) + '%';
    
    Object.keys(stats).forEach(key => {
        const data = stats[key];
        data.sub = data.prev === 0 ? 0 : ((data.curr - data.prev) / data.prev) * 100;

        const $valEl = $(`#stat-val-${key}`);
        if ($valEl.length) {
            const newVal = formatValue(data.curr);
            if ($valEl.text() !== newVal) $valEl.fadeOut(100, function() { $(this).text(newVal).fadeIn(100); });
        }
        const $subEl = $(`#stat-sub-${key}`);
        if ($subEl.length) $subEl.text(formatTrend(data.sub));
        const $colorEl = $(`#stat-color-${key}`);
        if ($colorEl.length) {
            const newColor = data.sub > 0 ? 'text-emerald-500' : (data.sub < 0 ? 'text-rose-500' : 'text-slate-400');
            $colorEl.removeClass((i, c) => (c.match(/(^|\s)text-(emerald|rose|slate|blue|amber)-\d+/g) || []).join(' ')).addClass(newColor);
        }
        if (window.chartInstances && window.chartInstances[key]) {
            const chart = window.chartInstances[key];
            const dataset = chart.data.datasets[0];
            dataset.data.push(data.curr);
            if (dataset.data.length > 20) dataset.data.shift();
            const color = data.sub > 0 ? '#10b981' : (data.sub < 0 ? '#f43f5e' : '#94a3b8');
            dataset.borderColor = color;
            dataset.backgroundColor = data.sub > 0 ? 'rgba(16, 185, 129, 0.05)' : (data.sub < 0 ? 'rgba(244, 63, 94, 0.05)' : 'rgba(148, 163, 184, 0.05)');
            chart.update('none');
        }
    });
});

/**
 * generic bot event listeners.
 */
window.addEventListener('botLog', (e) => window.addSystemLog(e.detail.message, e.detail.level));

window.addEventListener('socket_connected', () => window.updateBotStatus(true));
window.addEventListener('socket_disconnected', () => window.location.reload());

/**
 * initialization and routing listeners.
 */
window.addEventListener('hashchange', router);
window.addEventListener('load', async () => {
    if (window.location.protocol === 'file:') return;
    
    /** * initialize i18n before any view is rendered */
    window.I18nService = I18nService;
    await I18nService.init();
    
    router();
});