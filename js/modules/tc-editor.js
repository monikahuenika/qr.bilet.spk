import { StateManager } from './state-manager.js';

export const TCEditor = {
    tcContainer: null,
    tcValue: null,

    init() {
        this.tcContainer = document.getElementById('tc');
        this.tcValue = document.getElementById('tcValue');

        if (this.tcContainer) {
            this.tcContainer.addEventListener('click', () => this.openEditor());
        }

        this.restoreFromState();
    },

    restoreFromState() {
        const state = StateManager.getState();
        if (state.tcNumber && this.tcValue) {
            this.tcValue.textContent = state.tcNumber;
        }
    },

    openEditor() {
        if (!this.tcValue) return;

        const currentValue = this.tcValue.textContent.trim();
        const userValue = window.prompt('Введите номер Т/С', currentValue);

        if (userValue === null) return;

        const newTCNumber = userValue.trim();
        if (!newTCNumber) return;

        this.setTC(newTCNumber);
    },

    getCurrentTC() {
        return this.tcValue?.textContent.trim() || '';
    },

    setTC(tcNumber) {
        if (this.tcValue) {
            this.tcValue.textContent = tcNumber;
            StateManager.saveTCNumber(tcNumber);
        }
    }
};
