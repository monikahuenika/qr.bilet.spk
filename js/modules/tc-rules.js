import { StateManager } from './state-manager.js';
import { TCEditor } from './tc-editor.js';

/**
 * Правила автоматического определения T/C (Terminal/Card) номера
 * на основе типа транспорта и номера маршрута
 *
 * Специальные правила:
 * - Трамвай маршрут 18 → T/C: 852
 * - Трамвай маршрут 2 → T/C: 033
 */
export const TCRulesManager = {
    terminalCardNumber: null,

    /**
     * Правила для определения T/C
     */
    RULES: {
        'Трамвай': {
            '18': '852',
            '2': '033'
        }
    },

    /**
     * Инициализация модуля
     */
    init() {
        this.terminalCardNumber = document.getElementById('tcValue');

        // Восстановить сохраненный T/C номер
        this.restoreFromState();
    },

    /**
     * Восстановить T/C номер из сохраненного состояния
     */
    restoreFromState() {
        const state = StateManager.getState();
        if (state.tcNumber && this.terminalCardNumber) {
            this.terminalCardNumber.textContent = state.tcNumber;
            console.log('🎫 Восстановлен T/C номер:', state.tcNumber);
        }
    },

    /**
     * Обновить T/C номер согласно правилам
     * @param {string} transport - Тип транспорта
     * @param {string} route - Номер маршрута
     */
    update(transport, route) {
        if (!this.terminalCardNumber) return;

        const tcValue = this.RULES[transport]?.[route];
        if (tcValue) {
            // Используем TCEditor для установки значения
            TCEditor.setTC(tcValue);
            console.log(`🔄 T/C обновлен: ${transport} ${route} → ${tcValue}`);
        }
    }
};
