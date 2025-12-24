import { TCRulesManager } from './tc-rules.js';
import { StateManager } from './state-manager.js';

/**
 * Редактор номера маршрута
 * Позволяет пользователю изменять номер маршрута кликом
 */
export const RouteEditor = {
    routeNumberDisplay: null,
    routeNumberInput: null,
    textRedactor: null,

    /**
     * Инициализация модуля
     */
    init() {
        this.routeNumberDisplay = document.getElementById('numberCar');
        this.routeNumberInput = document.getElementById('impunFl');
        this.textRedactor = document.getElementById('textRedactor');

        if (this.textRedactor) {
            this.textRedactor.addEventListener('click', () => this.show());
        }

        if (this.routeNumberInput) {
            this.routeNumberInput.addEventListener('input', () => this.updateDisplay());
            this.routeNumberInput.addEventListener('blur', () => this.hide());
        }

        // Восстановить сохраненный номер маршрута
        this.restoreFromState();
    },

    /**
     * Восстановить номер маршрута из сохраненного состояния
     */
    restoreFromState() {
        const state = StateManager.getState();
        if (state.routeNumber && this.routeNumberDisplay) {
            this.routeNumberDisplay.textContent = state.routeNumber;
            console.log('📍 Восстановлен номер маршрута:', state.routeNumber);
        }
    },

    /**
     * Показать поле ввода для редактирования
     */
    show() {
        if (!this.routeNumberInput || !this.routeNumberDisplay) return;

        this.routeNumberInput.style.display = 'block';
        this.routeNumberInput.value = this.routeNumberDisplay.textContent.trim();
        this.routeNumberInput.focus();
        this.routeNumberDisplay.style.display = 'none';
    },

    /**
     * Скрыть поле ввода
     */
    hide() {
        if (!this.routeNumberInput || !this.routeNumberDisplay) return;

        this.routeNumberInput.style.display = 'none';
        this.routeNumberDisplay.style.display = 'block';
    },

    /**
     * Обновить отображение номера маршрута
     */
    updateDisplay() {
        if (!this.routeNumberInput || !this.routeNumberDisplay) return;

        const newRouteNumber = this.routeNumberInput.value;
        this.routeNumberDisplay.textContent = newRouteNumber;

        // Сохранить в LocalStorage
        StateManager.saveRouteNumber(newRouteNumber);

        // Получить текущий тип транспорта и обновить T/C
        const transportTypeDisplay = document.getElementById('car');
        if (transportTypeDisplay) {
            const transport = transportTypeDisplay.innerText.replace(':', '').trim();
            const route = this.routeNumberDisplay.textContent.trim();
            TCRulesManager.update(transport, route);
        }
    },

    /**
     * Получить текущий номер маршрута
     */
    getCurrentRoute() {
        return this.routeNumberDisplay?.textContent.trim() || '';
    }
};
