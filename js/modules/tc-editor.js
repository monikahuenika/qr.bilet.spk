import { StateManager } from './state-manager.js';

/**
 * Редактор T/C номера
 * Позволяет вручную редактировать T/C номер
 */
export const TCEditor = {
    tcContainer: null,
    tcValue: null,
    tcInput: null,

    /**
     * Инициализация модуля
     */
    init() {
        this.tcContainer = document.getElementById('tc');
        this.tcValue = document.getElementById('tcValue');
        this.tcInput = document.getElementById('tcInput');

        // Клик на контейнер T/C для редактирования
        if (this.tcContainer) {
            this.tcContainer.addEventListener('click', () => this.show());
        }

        if (this.tcInput) {
            this.tcInput.addEventListener('input', () => this.updateDisplay());
            this.tcInput.addEventListener('blur', () => this.hide());
            // Enter тоже закрывает инпут
            this.tcInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.tcInput.blur();
                }
            });
        }
    },

    /**
     * Показать поле ввода для редактирования
     */
    show() {
        if (!this.tcInput || !this.tcValue) return;

        this.tcInput.style.display = 'inline-block';
        this.tcInput.value = this.tcValue.textContent.trim();
        this.tcInput.focus();
        this.tcValue.style.display = 'none';
    },

    /**
     * Скрыть поле ввода
     */
    hide() {
        if (!this.tcInput || !this.tcValue) return;

        this.tcInput.style.display = 'none';
        this.tcValue.style.display = 'inline';
    },

    /**
     * Обновить отображение T/C номера
     */
    updateDisplay() {
        if (!this.tcInput || !this.tcValue) return;

        const newTCNumber = this.tcInput.value;
        this.tcValue.textContent = newTCNumber;

        // Сохранить в LocalStorage
        StateManager.saveTCNumber(newTCNumber);
    },

    /**
     * Получить текущий T/C номер
     */
    getCurrentTC() {
        return this.tcValue?.textContent.trim() || '';
    },

    /**
     * Установить T/C номер программно
     * @param {string} tcNumber - T/C номер
     */
    setTC(tcNumber) {
        if (this.tcValue) {
            this.tcValue.textContent = tcNumber;
            StateManager.saveTCNumber(tcNumber);
        }
    }
};
