export const OverlayManager = {
    colorFonts: null,
    boxStartQr: null,
    btnSaveTicketStart: null,

    init() {
        this.colorFonts = document.getElementById('colorFonts');
        this.boxStartQr = document.getElementById('boxStartQr');
        this.btnSaveTicketStart = document.getElementById('btnSaveTiketStart');

        if (this.btnSaveTicketStart) {
            this.btnSaveTicketStart.addEventListener('click', () => this.hide());
        }
    },

    hide() {
        if (this.colorFonts) {
            this.colorFonts.style.display = 'none';
        }
        if (this.boxStartQr) {
            this.boxStartQr.style.display = 'none';
        }
    }
};
