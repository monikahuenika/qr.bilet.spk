import { StateManager } from './state-manager.js';
import { TCSelector } from './tc-selector.js';

export const TCEditor = {
    tcContainer: null,
    tcValue: null,
    tcInput: null,
    tcSelect: null,
    currentMode: 'display',

    init() {
        this.tcContainer = document.getElementById('tc');
        this.tcValue = document.getElementById('tcValue');
        this.tcInput = document.getElementById('tcInput');
        this.tcSelect = document.getElementById('tcSelect');

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

        if (this.tcSelect) {
            this.tcSelect.addEventListener('change', () => this.updateFromSelect());
        }
    },

    show() {
        if (!this.tcValue) return;

        const transportType = document.getElementById('car')?.innerText.replace(':', '').trim();
        const routeNumber = document.getElementById('numberCar')?.textContent.trim();

        const hasList = TCSelector.hasTCList(transportType, routeNumber);

        if (hasList) {
            this.showSelect(transportType, routeNumber);
        } else {
            this.showInput();
        }
    },

    showSelect(transportType, routeNumber) {
        if (!this.tcSelect || !this.tcValue) return;

        const tcList = TCSelector.getTCList(transportType, routeNumber);
        const currentValue = this.tcValue.textContent.trim();

        this.tcSelect.innerHTML = '';

        const customOption = document.createElement('option');
        customOption.value = '__custom__';
        customOption.textContent = 'Ввести свой...';
        this.tcSelect.appendChild(customOption);

        tcList.forEach(tc => {
            const option = document.createElement('option');
            option.value = tc;
            option.textContent = tc;
            if (tc === currentValue) {
                option.selected = true;
            }
            this.tcSelect.appendChild(option);
        });

        this.currentMode = 'select';
        this.tcValue.style.display = 'none';
        this.tcInput.style.display = 'none';
        this.tcSelect.style.display = 'inline-block';

        setTimeout(() => {
            this.tcSelect.focus();
        }, 50);
    },

    showInput() {
        if (!this.tcInput || !this.tcValue) return;

        this.currentMode = 'input';
        this.tcInput.value = this.tcValue.textContent.trim();
        this.tcValue.style.display = 'none';
        this.tcSelect.style.display = 'none';
        this.tcInput.style.display = 'inline-block';

        setTimeout(() => {
            this.tcInput.focus();
        }, 50);
    },

    hide() {
        if (!this.tcValue) return;

        if (this.currentMode === 'display') return;

        this.tcInput.style.display = 'none';
        this.tcSelect.style.display = 'none';
        this.tcValue.style.display = 'inline';
        this.currentMode = 'display';
    },

    updateFromSelect() {
        if (!this.tcSelect || !this.tcValue) return;

        const selectedValue = this.tcSelect.value;

        if (selectedValue === '__custom__') {
            this.showInput();
        } else {
            this.tcValue.textContent = selectedValue;
            StateManager.saveTCNumber(selectedValue);
            this.hide();
        }
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
