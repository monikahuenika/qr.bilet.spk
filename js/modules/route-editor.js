import { TCRulesManager } from './tc-rules.js';
import { StateManager } from './state-manager.js';

export const RouteEditor = {
    routeNumberDisplay: null,
    textRedactor: null,

    init() {
        this.routeNumberDisplay = document.getElementById('numberCar');
        this.textRedactor = document.getElementById('textRedactor');

        if (this.textRedactor) {
            this.textRedactor.addEventListener('click', () => this.openEditor());
        }

        this.restoreFromState();
    },

    restoreFromState() {
        const state = StateManager.getState();
        if (state.routeNumber && this.routeNumberDisplay) {
            this.routeNumberDisplay.textContent = state.routeNumber;
        }
    },

    openEditor() {
        if (!this.routeNumberDisplay) return;

        const currentValue = this.routeNumberDisplay.textContent.trim();
        const userValue = window.prompt('Введите номер транспорта', currentValue);

        if (userValue === null) return;

        const newRouteNumber = userValue.trim();
        if (!newRouteNumber) return;

        this.routeNumberDisplay.textContent = newRouteNumber;
        StateManager.saveRouteNumber(newRouteNumber);

        const transportTypeDisplay = document.getElementById('car');
        if (transportTypeDisplay) {
            const transport = transportTypeDisplay.innerText.replace(':', '').trim();
            TCRulesManager.update(transport, newRouteNumber);
        }
    },

    getCurrentRoute() {
        return this.routeNumberDisplay?.textContent.trim() || '';
    }
};
