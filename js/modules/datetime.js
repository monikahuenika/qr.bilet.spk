import { StateManager } from './state-manager.js';

export const DateTimeManager = {
    dateTimeDisplay: null,
    timeOldNumber: null,
    timerInterval: null,
    seconds: 0,
    sessionStartDateTime: null,
    purchaseTimestamp: null,
    offsetSeconds: 30,
    btnDownloadTicket: null,

    init() {
        this.dateTimeDisplay = document.getElementById('DataTime');
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
            this.dateTimeDisplay.addEventListener('click', () => this.updateDateTime());
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

    setInitialDateTime() {
        if (!this.dateTimeDisplay || !this.sessionStartDateTime) return;

        this.dateTimeDisplay.innerText = this.formatDateTime(this.sessionStartDateTime);
    },

    updateDateTime() {
        if (!this.dateTimeDisplay || !this.timeOldNumber) return;

        const currentText = this.formatDateTime(this.sessionStartDateTime || new Date());
        const userValue = window.prompt('Введите дату и время покупки в формате ДД.ММ.ГГГГ ЧЧ:ММ', currentText);

        if (userValue === null) return;

        const parsedDate = this.parseDateTime(userValue);
        if (!parsedDate) {
            window.alert('Неверный формат даты. Используйте: ДД.ММ.ГГГГ ЧЧ:ММ');
            return;
        }

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

    parseDateTime(value) {
        const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
        if (!match) return null;

        const [, day, month, year, hours, minutes] = match;
        const parsed = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes),
            0,
            0
        );

        if (
            parsed.getFullYear() !== Number(year)
            || parsed.getMonth() !== Number(month) - 1
            || parsed.getDate() !== Number(day)
            || parsed.getHours() !== Number(hours)
            || parsed.getMinutes() !== Number(minutes)
        ) {
            return null;
        }

        return parsed;
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
