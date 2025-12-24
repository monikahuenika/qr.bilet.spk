/**
 * Управление состоянием приложения через LocalStorage и SessionStorage
 * - LocalStorage: постоянные данные (маршрут, транспорт, T/C)
 * - SessionStorage: временные данные сессии (время открытия)
 */
export const StateManager = {
    STORAGE_KEY: 'qr-bilet-state',
    SESSION_KEY: 'qr-bilet-session',

    /**
     * Получить сохраненное состояние
     * @returns {Object} Состояние приложения
     */
    getState() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Ошибка чтения состояния:', e);
        }

        // Значения по умолчанию
        return {
            routeNumber: '71',
            transportType: 'Автобус',
            tcNumber: '1240',
            lastUpdated: null
        };
    },

    /**
     * Сохранить состояние
     * @param {Object} state - Состояние для сохранения
     */
    setState(state) {
        try {
            const currentState = this.getState();
            const newState = {
                ...currentState,
                ...state,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
            console.log('✅ Состояние сохранено:', newState);
        } catch (e) {
            console.error('Ошибка сохранения состояния:', e);
        }
    },

    /**
     * Сохранить номер маршрута
     * @param {string} routeNumber - Номер маршрута
     */
    saveRouteNumber(routeNumber) {
        this.setState({ routeNumber });
    },

    /**
     * Сохранить тип транспорта
     * @param {string} transportType - Тип транспорта
     */
    saveTransportType(transportType) {
        this.setState({ transportType });
    },

    /**
     * Сохранить T/C номер
     * @param {string} tcNumber - T/C номер
     */
    saveTCNumber(tcNumber) {
        this.setState({ tcNumber });
    },

    /**
     * Очистить сохраненное состояние
     */
    clearState() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('🗑️ Состояние очищено');
        } catch (e) {
            console.error('Ошибка очистки состояния:', e);
        }
    },

    // === УПРАВЛЕНИЕ СЕССИЕЙ (гибридный подход: LocalStorage + SessionStorage) ===

    /**
     * Получить ID текущей вкладки (хранится только в SessionStorage)
     * @returns {string} ID вкладки
     */
    getTabId() {
        let tabId = sessionStorage.getItem('tab-id');
        if (!tabId) {
            tabId = 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('tab-id', tabId);
        }
        return tabId;
    },

    /**
     * Получить данные сессии из LocalStorage
     * @returns {Object|null} Данные сессии или null
     */
    getSession() {
        try {
            const stored = localStorage.getItem(this.SESSION_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Ошибка чтения сессии:', e);
        }
        return null;
    },

    /**
     * Инициализировать новую сессию
     * @returns {Object} Данные новой сессии
     */
    startSession() {
        const tabId = this.getTabId();
        const session = {
            startTime: new Date().toISOString(),
            startTimestamp: Date.now(),
            initialDateTime: new Date().toISOString(),
            tabId: tabId
        };

        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            console.log('🆕 Новая сессия создана:', session);
        } catch (e) {
            console.error('Ошибка создания сессии:', e);
        }

        return session;
    },

    /**
     * Получить время начала сессии
     * Если сессия не существует или принадлежит другой вкладке - создать новую
     * @returns {Object} { startTime, elapsedSeconds, initialDateTime }
     */
    getOrCreateSession() {
        const currentTabId = this.getTabId();
        let session = this.getSession();

        // Если сессия не существует или принадлежит другой вкладке (та вкладка была закрыта)
        if (!session || session.tabId !== currentTabId) {
            console.log('🔄 Создание новой сессии (вкладка была закрыта или первый запуск)');
            session = this.startSession();
            return {
                startTime: session.startTime,
                elapsedSeconds: 30, // Начинаем с 30 секунд (как в оригинале)
                initialDateTime: session.initialDateTime
            };
        }

        // Существующая сессия - вычисляем прошедшее время
        const now = Date.now();
        const elapsedMs = now - session.startTimestamp;
        const elapsedSeconds = Math.floor(elapsedMs / 1000) + 30; // +30 потому что таймер начинается с 0:30

        console.log(`⏱️ Сессия продолжается: прошло ${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}`);

        return {
            startTime: session.startTime,
            elapsedSeconds: elapsedSeconds,
            initialDateTime: session.initialDateTime
        };
    },

    /**
     * Очистить сессию
     */
    clearSession() {
        try {
            localStorage.removeItem(this.SESSION_KEY);
            console.log('🗑️ Сессия очищена');
        } catch (e) {
            console.error('Ошибка очистки сессии:', e);
        }
    }
};
