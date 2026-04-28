// file: /js/views/Login.js
// version: 1.0.0.0, 27.04.2026 17:45

/**
 * view module for the login page.
 * handles password-only authentication and ui state.
 * @namespace
 */
export const Login = {
    /**
     * renders the login view with a centered password form.
     * @async
     * @returns {string} html template.
     */
    render: async () => {
        return `
            <div class="view-section w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120] fixed inset-0 z-[100]">
                <div class="w-full max-w-sm bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 bg-brand-base rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i class="fa-solid fa-shield-halved text-white text-2xl"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Systemzugriff</h1>
                        <p class="text-sm text-slate-500 mt-2">Bitte gib das Passwort ein.</p>
                    </div>

                    <form id="login-form" class="space-y-6">
                        <div class="space-y-2 text-left">
                            <div class="relative">
                                <i class="fa-solid fa-key absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                                <input type="password" id="password" name="password" required autofocus
                                    class="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-base transition-all"
                                    placeholder="••••••••">
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-brand-base hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">
                            Anmelden
                        </button>
                    </form>
                    
                    <div id="login-error" class="hidden mt-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-rose-500 text-[11px] font-medium text-center">
                        <i class="fa-solid fa-circle-exclamation mr-2"></i> Passwort ungültig.
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * initializes the login logic and data transmission.
     * @async
     * @returns {void}
     */
    after_render: async () => {
        const form = document.getElementById('login-form');
        const errorMsg = document.getElementById('login-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMsg.classList.add('hidden');

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                /** * transmit password to the login endpoint in json format */
                const response = await fetch('/auth-check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.hash = '#/dashboard';
                    if (window.addSystemLog) window.addSystemLog("Login erfolgreich.", "success");
                } else {
                    throw new Error('invalid credentials');
                }
            } catch (err) {
                errorMsg.classList.remove('hidden');
                if (window.addSystemLog) window.addSystemLog("Login fehlgeschlagen.", "error");
            }
        });
    }
};