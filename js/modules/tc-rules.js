import { StateManager } from './state-manager.js';
import { TCEditor } from './tc-editor.js';

export const TCRulesManager = {
    terminalCardNumber: null,

    RULES: {
        'Трамвай': {
            '18': '852',
            '2': '033'
        }
    },

    init() {
        this.terminalCardNumber = document.getElementById('tcValue');
        this.restoreFromState();
    },

    restoreFromState() {
        const state = StateManager.getState();
        if (state.tcNumber && this.terminalCardNumber) {
            this.terminalCardNumber.textContent = state.tcNumber;
        }
    },

    update(transport, route) {
        if (!this.terminalCardNumber) return;

        const tcValue = this.RULES[transport]?.[route];
        if (tcValue) {
            TCEditor.setTC(tcValue);
        }
    }
};
