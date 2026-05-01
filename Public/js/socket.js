// file: /js/socket.js
// version: 1.0.0.2, 26.04.2026 21:15

/**
 * service for managing websocket communication with automatic port discovery starting from webserver port plus five hundred.
 * @namespace
 */
export const SocketService = {
    socket: null,
    basePort: (parseInt(window.location.port) || 5500),
    pingInterval: null,
    pongTimeout: null,
    isConnecting: false,

    /**
     * initiates connection to the bot with automatic port cycling.
     * @returns {void}
     */
    connect() {
        if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) return;
        
        this.isConnecting = true;
        const url = `ws://${window.location.hostname}:${this.basePort}`;
        
        this.socket = new WebSocket(url);

        /**
         * handles successful connection establishment.
         * @returns {void}
         */
        this.socket.onopen = () => {
            window.dispatchEvent(new CustomEvent('socket_connected'));
            this.isConnecting = false;
            this.startHeartbeat();
        };

        /**
         * handles incoming messages and dispatches events.
         * @param {MessageEvent} event - websocket message event.
         * @returns {void}
         */
        this.socket.onmessage = (event) => {
            const message = event.data.toString().trim();
            
            if (message === "PONG") {
                clearTimeout(this.pongTimeout);
                return;
            }

            try {
                const data = JSON.parse(event.data);
                if (data.type === 'log') this.dispatchLog(data);
                if (data.type === 'stats') {
                    this.dispatchStats(data.data);
                    window.dispatchEvent(new CustomEvent('stats_updated', { detail: data.data }));
                }
            } catch (e) {
                // ignore non-json
            }
        };

        /**
         * handles connection errors.
         * @returns {void}
         */
        this.socket.onerror = () => {
            this.socket.close();
        };

        /**
         * handles connection closure and schedules reconnection with port increment.
         * @returns {void}
         */
        this.socket.onclose = () => {
            this.isConnecting = false;
            this.stopHeartbeat();

            window.dispatchEvent(new CustomEvent('socket_disconnected'));
        };
    },

    /**
     * starts the heartbeat mechanism.
     * @returns {void}
     */
    startHeartbeat() {
        this.pingInterval = setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send('PING');
                this.pongTimeout = setTimeout(() => {
                    this.socket.close();
                }, 5000);
            }
        }, 10000);
    },

    /**
     * stops heartbeat timers.
     * @returns {void}
     */
    stopHeartbeat() {
        clearInterval(this.pingInterval);
        clearTimeout(this.pongTimeout);
    },

    /**
     * dispatches log events to the system.
     * @param {object} data - log data object.
     * @returns {void}
     */
    dispatchLog(data) {
        window.dispatchEvent(new CustomEvent('botLog', { 
            detail: { message: data.message, level: data.level || 'info' }
        }));
    },

    /**
     * dispatches statistics events to the system.
     * @param {object} stats - numerical statistics object.
     * @returns {void}
     */
    dispatchStats(stats) {
        window.dispatchEvent(new CustomEvent('botStats', { detail: stats }));
    },

    /**
     * sends json messages to the bot instance.
     * @param {object} msg - message object.
     * @returns {void}
     */
    send(msg) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(msg));
        }
    }
};