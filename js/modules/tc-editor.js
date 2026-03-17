import { StateManager } from './state-manager.js';

export const TCEditor = {
    tcContainer: null,
    tcValue: null,
    modal: null,
    modalInput: null,
    btnSave: null,
    btnCancel: null,
    overlay: null,
    isEditorOpen: false,

    init() {
        this.tcContainer = document.getElementById('tc');
        this.tcValue = document.getElementById('tcValue');
        this.modal = document.getElementById('tcEditorModal');
        this.modalInput = document.getElementById('tcEditorInput');
        this.btnSave = document.getElementById('tcEditorBtnSave');
        this.btnCancel = document.getElementById('tcEditorBtnCancel');
        this.overlay = document.getElementById('tcEditorOverlay');

        if (this.tcContainer) {
            this.tcContainer.addEventListener('click', () => this.openEditor());
        }

        if (this.btnSave) {
            this.btnSave.addEventListener('click', () => this.saveTC());
        }

        if (this.btnCancel) {
            this.btnCancel.addEventListener('click', () => this.closeEditor());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeEditor());
        }

        if (this.modalInput) {
            this.modalInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.saveTC();
                }
            });
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
        if (!this.tcValue || !this.modal || this.isEditorOpen) return;

        this.isEditorOpen = true;
        const currentValue = this.tcValue.textContent.trim();

        if (this.modalInput) {
            this.modalInput.value = currentValue;
        }

        this.modal.style.display = 'block';

        setTimeout(() => {
            if (this.modalInput) {
                this.modalInput.focus();
                this.modalInput.select();
            }
        }, 100);
    },

    closeEditor() {
        if (!this.modal) return;

        this.modal.style.display = 'none';
        this.isEditorOpen = false;

        if (this.modalInput) {
            this.modalInput.value = '';
        }
    },

    saveTC() {
        if (!this.modalInput) return;

        const newTCNumber = this.modalInput.value.trim();
        if (!newTCNumber) {
            this.closeEditor();
            return;
        }

        this.setTC(newTCNumber);
        this.closeEditor();
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
