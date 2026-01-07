import { StateManager } from './state-manager.js';

export const TCEditor = {
    tcContainer: null,
    tcValue: null,
    tcInput: null,
    currentMode: 'display',

    init() {
        this.tcContainer = document.getElementById('tc');
        this.tcValue = document.getElementById('tcValue');
        this.tcInput = document.getElementById('tcInput');

        if (this.tcContainer) {
            this.tcContainer.addEventListener('click', () => this.show());
        }

        if (this.tcInput) {
            this.tcInput.addEventListener('input', () => this.updateFromInput());
            this.tcInput.addEventListener('blur', () => {
                setTimeout(() => this.hide(), 100);
            });
            this.tcInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.tcInput.blur();
                }
            });
        }
    },

    show() {
        if (!this.tcInput || !this.tcValue) return;

        this.currentMode = 'input';
        this.tcInput.value = this.tcValue.textContent.trim();
        this.tcValue.style.display = 'none';
        this.tcInput.style.display = 'inline-block';

        setTimeout(() => {
            this.tcInput.focus();
        }, 50);
    },

    hide() {
        if (!this.tcValue) return;

        if (this.currentMode === 'display') return;

        this.tcInput.style.display = 'none';
        this.tcValue.style.display = 'inline';
        this.currentMode = 'display';
    },

    updateFromInput() {
        if (!this.tcInput || !this.tcValue) return;

        const newTCNumber = this.tcInput.value;
        this.tcValue.textContent = newTCNumber;

        StateManager.saveTCNumber(newTCNumber);
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
