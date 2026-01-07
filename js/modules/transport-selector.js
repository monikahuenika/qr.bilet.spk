import { TCRulesManager } from './tc-rules.js';
import { RouteEditor } from './route-editor.js';
import { StateManager } from './state-manager.js';

export const TransportSelector = {
    transportTypeDisplay: null,
    transportTypeMenu: null,
    buttons: [],

    init() {
        this.transportTypeDisplay = document.getElementById('car');
        this.transportTypeMenu = document.getElementById('menuCar');

        this.buttons = [
            { element: document.getElementById('btnMenuOne'), name: 'Трамвай' },
            { element: document.getElementById('btnMenuTwo'), name: 'Тролейбус' },
            { element: document.getElementById('btnMenuThree'), name: 'Автобус' }
        ];

        if (this.transportTypeDisplay) {
            this.transportTypeDisplay.addEventListener('click', () => this.openMenu());
        }

        this.buttons.forEach(({ element, name }) => {
            if (element) {
                element.addEventListener('click', () => this.select(name));
            }
        });

        this.restoreFromState();
    },

    restoreFromState() {
        const state = StateManager.getState();
        if (state.transportType && this.transportTypeDisplay) {
            this.transportTypeDisplay.innerText = state.transportType;

            const route = RouteEditor.getCurrentRoute();
            TCRulesManager.update(state.transportType, route);
        }
    },

    openMenu() {
        if (this.transportTypeMenu) {
            this.transportTypeMenu.style.display = 'flex';
        }
    },

    select(transportName) {
        if (this.transportTypeDisplay) {
            this.transportTypeDisplay.innerText = transportName;
        }

        if (this.transportTypeMenu) {
            this.transportTypeMenu.style.display = 'none';
        }

        StateManager.saveTransportType(transportName);

        const route = RouteEditor.getCurrentRoute();
        TCRulesManager.update(transportName, route);
    },

    getCurrentTransport() {
        return this.transportTypeDisplay?.innerText.replace(':', '').trim() || '';
    }
};
