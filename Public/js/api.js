// file: /js/api.js
// version: 1.0.0.0, 26.04.2026 19:42

/**
 * api service for handling initial data requests.
 * @namespace
 */
export const API = {
    /**
     * fetches initial statistics for the dashboard cards.
     * @async
     * @returns {promise<object>} the initial kpi data structure.
     */
    async getStats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    kpiMissionsIncoming: { val: 0, sub: 0 },
                    kpiMissionsProcessed: { val: 0, sub: 0 },
                    kpiMissionSuccessRate: { val: 0, sub: 0 },
                    kpiSpeechesIncoming: { val: 0, sub: 0 },
                    kpiSpeechesProcessed: { val: 0, sub: 0 },
                    kpiCreditsPerHour: { val: 0, sub: 0 }
                });
            }, 100);
        });
    }
};