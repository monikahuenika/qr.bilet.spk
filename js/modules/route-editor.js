import { TCRulesManager } from './tc-rules.js';
import { StateManager } from './state-manager.js';

export const RouteEditor = {
    routeNumberDisplay: null,
    routeNumberInput: null,
    textRedactor: null,

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

        this.restoreFromState();
    },

    restoreFromState() {
        const state = StateManager.getState();
        if (state.routeNumber && this.routeNumberDisplay) {
            this.routeNumberDisplay.textContent = state.routeNumber;
        }
    },

    show() {
        if (!this.routeNumberInput || !this.routeNumberDisplay) return;

        this.routeNumberInput.style.display = 'block';
        this.routeNumberInput.value = this.routeNumberDisplay.textContent.trim();
        this.routeNumberInput.focus();
        this.routeNumberDisplay.style.display = 'none';
    },

    hide() {
        if (!this.routeNumberInput || !this.routeNumberDisplay) return;

        this.routeNumberInput.style.display = 'none';
        this.routeNumberDisplay.style.display = 'block';
    },

    updateDisplay() {
        if (!this.routeNumberInput || !this.routeNumberDisplay) return;

        const newRouteNumber = this.routeNumberInput.value;
        this.routeNumberDisplay.textContent = newRouteNumber;

        StateManager.saveRouteNumber(newRouteNumber);

        const transportTypeDisplay = document.getElementById('car');
        if (transportTypeDisplay) {
            const transport = transportTypeDisplay.innerText.replace(':', '').trim();
            const route = this.routeNumberDisplay.textContent.trim();
            TCRulesManager.update(transport, route);
        }
    },

    getCurrentRoute() {
        return this.routeNumberDisplay?.textContent.trim() || '';
    }
};
