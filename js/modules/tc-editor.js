import { StateManager } from './state-manager.js';

export const TCEditor = {
    tcContainer: null,
    tcValue: null,
    tcInput: null,

    init() {
        this.tcContainer = document.getElementById('tc');
        this.tcValue = document.getElementById('tcValue');
        this.tcInput = document.getElementById('tcInput');

        if (this.tcContainer) {
            this.tcContainer.addEventListener('click', () => this.show());
        }

        if (this.tcInput) {
            this.tcInput.addEventListener('input', () => this.updateDisplay());
            this.tcInput.addEventListener('blur', () => this.hide());
            this.tcInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.tcInput.blur();
                }
            });
        }
    },

    show() {
        if (!this.tcInput || !this.tcValue) return;

        this.tcInput.style.display = 'inline-block';
        this.tcInput.value = this.tcValue.textContent.trim();
        this.tcInput.focus();
        this.tcValue.style.display = 'none';
    },

    hide() {
        if (!this.tcInput || !this.tcValue) return;

        this.tcInput.style.display = 'none';
        this.tcValue.style.display = 'inline';
    },

    updateDisplay() {
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
