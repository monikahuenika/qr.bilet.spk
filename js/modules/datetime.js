import { StateManager } from './state-manager.js';

export const DateTimeManager = {
    dateTimeDisplay: null,
    dateTimeContainer: null,
    timeOldNumber: null,
    timerInterval: null,
    seconds: 0,
    sessionStartDateTime: null,
    purchaseTimestamp: null,
    offsetSeconds: 30,
    btnDownloadTicket: null,

    init() {
        this.dateTimeDisplay = document.getElementById('DataTime');
        this.dateTimeContainer = document.querySelector('.dataAndNowTime');
        this.timeOldNumber = document.getElementById('timeOldNumber');
        this.btnDownloadTicket = document.getElementById('btnDownloadTicket');

        const session = StateManager.getOrCreateSession();
        this.seconds = session.elapsedSeconds;
        this.sessionStartDateTime = new Date(session.initialDateTime);
        this.purchaseTimestamp = session.purchaseTimestamp;
        this.offsetSeconds = session.offsetSeconds;

        this.setInitialDateTime();
        this.startTimerFromSession();

        if (this.dateTimeDisplay) {
            this.dateTimeDisplay.addEventListener('click', (event) => this.updateDateTime(event));
        }

        if (this.dateTimeContainer) {
            this.dateTimeContainer.addEventListener('click', (event) => this.updateDateTime(event));
        }

        if (this.btnDownloadTicket) {
            this.btnDownloadTicket.addEventListener('click', () => this.handleDownloadTicket());
        }
    },

    handleDownloadTicket() {
        this.restartSession();
    },

    formatDateTime(date) {
        const pad = (n) => String(n).padStart(2, '0');

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    },

    formatDateTimeForInput(date) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },

    setInitialDateTime() {
        if (!this.dateTimeDisplay || !this.sessionStartDateTime) return;

        this.dateTimeDisplay.innerText = this.formatDateTime(this.sessionStartDateTime);
    },

    applyNewPurchaseDate(parsedDate) {
        this.sessionStartDateTime = parsedDate;
        this.purchaseTimestamp = parsedDate.getTime();

        const elapsedByPhoneTime = Math.floor((Date.now() - this.purchaseTimestamp) / 1000);
        this.offsetSeconds = elapsedByPhoneTime > 30 ? 0 : 30;

        StateManager.saveSessionData({
            initialDateTime: parsedDate.toISOString(),
            purchaseTimestamp: this.purchaseTimestamp,
            offsetSeconds: this.offsetSeconds
        });

        this.setInitialDateTime();
        this.syncSecondsWithPhoneTime();
        this.updateTimerDisplay();
    },

    updateDateTime(event) {
        if (!this.dateTimeDisplay || !this.timeOldNumber) return;
        if (event) event.preventDefault();

        const baseDate = this.sessionStartDateTime || new Date();
        const pickerInput = document.createElement('input');

        pickerInput.type = 'datetime-local';
        pickerInput.value = this.formatDateTimeForInput(baseDate);
        pickerInput.style.position = 'fixed';
        pickerInput.style.opacity = '0';
        pickerInput.style.pointerEvents = 'none';
        pickerInput.style.width = '1px';
        pickerInput.style.height = '1px';
        pickerInput.style.left = '-9999px';

        document.body.appendChild(pickerInput);

        const cleanup = () => {
            pickerInput.removeEventListener('change', onChange);
            pickerInput.removeEventListener('blur', onBlur);
            pickerInput.remove();
        };

        const onChange = () => {
            if (!pickerInput.value) {
                cleanup();
                return;
            }

            const parsedDate = new Date(pickerInput.value);
            if (Number.isNaN(parsedDate.getTime())) {
                cleanup();
                return;
            }

            this.applyNewPurchaseDate(parsedDate);
            cleanup();
        };

        const onBlur = () => {
            cleanup();
        };

        pickerInput.addEventListener('change', onChange);
        pickerInput.addEventListener('blur', onBlur);

        if (typeof pickerInput.showPicker === 'function') {
            pickerInput.showPicker();
            return;
        }

        pickerInput.focus();
        pickerInput.click();
    },

    syncSecondsWithPhoneTime() {
        if (!this.purchaseTimestamp) return;

        const elapsedByPhoneTime = Math.floor((Date.now() - this.purchaseTimestamp) / 1000);
        this.seconds = Math.max(this.offsetSeconds, elapsedByPhoneTime + this.offsetSeconds);
    },

    startTimerFromSession() {
        if (!this.timeOldNumber) return;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.syncSecondsWithPhoneTime();
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.syncSecondsWithPhoneTime();
            this.updateTimerDisplay();
        }, 1000);
    },

    updateTimerDisplay() {
        if (!this.timeOldNumber) return;

        const minutes = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        const timeString = `${minutes}:${String(secs).padStart(2, '0')}`;

        this.timeOldNumber.innerText = timeString;
    },

    restartSession() {
        const session = StateManager.startSession();
        this.seconds = 30;
        this.sessionStartDateTime = new Date(session.initialDateTime);
        this.purchaseTimestamp = session.purchaseTimestamp;
        this.offsetSeconds = session.offsetSeconds;

        this.setInitialDateTime();
        this.startTimerFromSession();
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};
