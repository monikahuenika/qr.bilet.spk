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
            this.tcInput.addEventListener('blur', () => this.hide());
            this.tcInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.tcInput.blur();
                }
            });
        }

        if (this.tcSelect) {
            this.tcSelect.addEventListener('change', () => this.updateFromSelect());
            this.tcSelect.addEventListener('blur', () => this.hide());
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
        this.tcSelect.style.display = 'inline-block';
        this.tcSelect.focus();
        this.tcValue.style.display = 'none';
        this.tcInput.style.display = 'none';
    },

    showInput() {
        if (!this.tcInput || !this.tcValue) return;

        this.currentMode = 'input';
        this.tcInput.style.display = 'inline-block';
        this.tcInput.value = this.tcValue.textContent.trim();
        this.tcInput.focus();
        this.tcValue.style.display = 'none';
        this.tcSelect.style.display = 'none';
    },

    hide() {
        if (!this.tcValue) return;

        this.tcInput.style.display = 'none';
        this.tcSelect.style.display = 'none';
        this.tcValue.style.display = 'inline';
        this.currentMode = 'display';
    },

    updateFromSelect() {
        if (!this.tcSelect || !this.tcValue) return;

        const selectedValue = this.tcSelect.value;

        if (selectedValue === '__custom__') {
            this.tcSelect.style.display = 'none';
            this.showInput();
        } else {
            this.tcValue.textContent = selectedValue;
            StateManager.saveTCNumber(selectedValue);
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
