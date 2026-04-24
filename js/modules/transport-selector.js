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
            { element: document.getElementById('btnMenuTwo'), name: 'Троллейбус' },
            { element: document.getElementById('btnMenuThree'), name: 'Автобус' }
        ];

        if (this.transportTypeDisplay) {
            this.transportTypeDisplay.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleMenu();
            });
        }

        if (this.transportTypeMenu) {
            this.transportTypeMenu.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }

        document.addEventListener('click', () => this.closeMenu());

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

    isMenuOpen() {
        if (!this.transportTypeMenu) return false;

        const computedStyle = window.getComputedStyle(this.transportTypeMenu);
        return computedStyle.display === 'flex';
    },

    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
            return;
        }

        this.openMenu();
    },

    openMenu() {
        if (this.transportTypeMenu) {
            this.transportTypeMenu.style.display = 'flex';
        }
    },

    closeMenu() {
        if (this.transportTypeMenu) {
            this.transportTypeMenu.style.display = 'none';
        }
    },

    select(transportName) {
        if (this.transportTypeDisplay) {
            this.transportTypeDisplay.innerText = transportName;
        }

        this.closeMenu();

        StateManager.saveTransportType(transportName);

        const route = RouteEditor.getCurrentRoute();
        TCRulesManager.update(transportName, route);
    },

    getCurrentTransport() {
        return this.transportTypeDisplay?.innerText.replace(':', '').trim() || '';
    }
};
