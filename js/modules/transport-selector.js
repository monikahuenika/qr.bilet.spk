import { TCRulesManager } from './tc-rules.js';
import { RouteEditor } from './route-editor.js';
import { StateManager } from './state-manager.js';

/**
 * Выбор типа транспорта
 * Управляет выбором между Трамвай, Тролейбус и Автобус
 */
export const TransportSelector = {
    transportTypeDisplay: null,
    transportTypeMenu: null,
    buttons: [],

    /**
     * Инициализация модуля
     */
    init() {
        this.transportTypeDisplay = document.getElementById('car');
        this.transportTypeMenu = document.getElementById('menuCar');

        this.buttons = [
            { element: document.getElementById('btnMenuOne'), name: 'Трамвай' },
            { element: document.getElementById('btnMenuTwo'), name: 'Тролейбус' },
            { element: document.getElementById('btnMenuThree'), name: 'Автобус' }
        ];

        // Открытие меню при клике на тип транспорта
        if (this.transportTypeDisplay) {
            this.transportTypeDisplay.addEventListener('click', () => this.openMenu());
        }

        // Привязка обработчиков к кнопкам
        this.buttons.forEach(({ element, name }) => {
            if (element) {
                element.addEventListener('click', () => this.select(name));
            }
        });

        // Восстановить сохраненный тип транспорта
        this.restoreFromState();
    },

    /**
     * Восстановить тип транспорта из сохраненного состояния
     */
    restoreFromState() {
        const state = StateManager.getState();
        if (state.transportType && this.transportTypeDisplay) {
            this.transportTypeDisplay.innerText = state.transportType;
            console.log('🚌 Восстановлен тип транспорта:', state.transportType);

            // Обновить T/C после восстановления
            const route = RouteEditor.getCurrentRoute();
            TCRulesManager.update(state.transportType, route);
        }
    },

    /**
     * Открыть меню выбора транспорта
     */
    openMenu() {
        if (this.transportTypeMenu) {
            this.transportTypeMenu.style.display = 'flex';
        }
    },

    /**
     * Выбрать тип транспорта
     * @param {string} transportName - Название транспорта
     */
    select(transportName) {
        if (this.transportTypeDisplay) {
            this.transportTypeDisplay.innerText = transportName;
        }

        if (this.transportTypeMenu) {
            this.transportTypeMenu.style.display = 'none';
        }

        // Сохранить в LocalStorage
        StateManager.saveTransportType(transportName);

        // Обновить T/C согласно правилам
        const route = RouteEditor.getCurrentRoute();
        TCRulesManager.update(transportName, route);
    },

    /**
     * Получить текущий тип транспорта
     */
    getCurrentTransport() {
        return this.transportTypeDisplay?.innerText.replace(':', '').trim() || '';
    }
};
