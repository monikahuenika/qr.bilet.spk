export const StateManager = {
    STORAGE_KEY: 'qr-bilet-state',
    SESSION_KEY: 'qr-bilet-session',

    getState() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('State read error:', e);
        }

        return {
            routeNumber: '71',
            transportType: 'Автобус',
            tcNumber: '1240',
            lastUpdated: null
        };
    },

    setState(state) {
        try {
            const currentState = this.getState();
            const newState = {
                ...currentState,
                ...state,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
        } catch (e) {
            console.error('State save error:', e);
        }
    },

    saveRouteNumber(routeNumber) {
        this.setState({ routeNumber });
    },

    saveTransportType(transportType) {
        this.setState({ transportType });
    },

    saveTCNumber(tcNumber) {
        this.setState({ tcNumber });
    },

    clearState() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.error('State clear error:', e);
        }
    },

    getTabId() {
        let tabId = sessionStorage.getItem('tab-id');
        if (!tabId) {
            tabId = 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('tab-id', tabId);
        }
        return tabId;
    },

    getSession() {
        try {
            const stored = localStorage.getItem(this.SESSION_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Session read error:', e);
        }
        return null;
    },

    startSession() {
        const tabId = this.getTabId();
        const nowIso = new Date().toISOString();
        const purchaseTimestamp = Date.now();
        const session = {
            startTime: nowIso,
            purchaseTimestamp,
            initialDateTime: nowIso,
            offsetSeconds: 30,
            tabId: tabId
        };

        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        } catch (e) {
            console.error('Session create error:', e);
        }

        return session;
    },

    getOrCreateSession() {
        const currentTabId = this.getTabId();
        let session = this.getSession();

        if (!session || session.tabId !== currentTabId) {
            session = this.startSession();
            return {
                startTime: session.startTime,
                elapsedSeconds: 30,
                initialDateTime: session.initialDateTime
            };
        }

        const purchaseTimestamp = session.purchaseTimestamp || session.startTimestamp;
        const offsetSeconds = Number.isFinite(session.offsetSeconds) ? session.offsetSeconds : 30;
        const now = Date.now();
        const elapsedMs = now - purchaseTimestamp;
        const elapsedSeconds = Math.max(offsetSeconds, Math.floor(elapsedMs / 1000) + offsetSeconds);

        return {
            startTime: session.startTime,
            elapsedSeconds: elapsedSeconds,
            initialDateTime: session.initialDateTime,
            purchaseTimestamp,
            offsetSeconds
        };
    },

    saveSessionData(data) {
        const session = this.getSession();
        if (!session) return;

        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify({
                ...session,
                ...data
            }));
        } catch (e) {
            console.error('Session update error:', e);
        }
    },

    clearSession() {
        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (e) {
            console.error('Session clear error:', e);
        }
    }
};
