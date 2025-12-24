/**
 * Управление оверлеем "Сохранить билет"
 * Показывает начальный экран с предложением сохранить билет
 */
export const OverlayManager = {
    colorFonts: null,
    boxStartQr: null,
    btnSaveTicketStart: null,

    /**
     * Инициализация модуля
     */
    init() {
        this.colorFonts = document.getElementById('colorFonts');
        this.boxStartQr = document.getElementById('boxStartQr');
        this.btnSaveTicketStart = document.getElementById('btnSaveTicketStart');

        if (this.btnSaveTicketStart) {
            this.btnSaveTicketStart.addEventListener('click', () => this.hide());
        }
    },

    /**
     * Скрыть оверлей
     */
    hide() {
        if (this.colorFonts) {
            this.colorFonts.style.display = 'none';
        }
        if (this.boxStartQr) {
            this.boxStartQr.style.display = 'none';
        }
    }
};
