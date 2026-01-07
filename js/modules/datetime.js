import { StateManager } from './state-manager.js';

export const DateTimeManager = {
    dateTimeDisplay: null,
    timeOldNumber: null,
    timerInterval: null,
    seconds: 0,
    sessionStartDateTime: null,
    btnDownloadTicket: null,

    init() {
        this.dateTimeDisplay = document.getElementById('DataTime');
        this.timeOldNumber = document.getElementById('timeOldNumber');
        this.btnDownloadTicket = document.getElementById('btnDownloadTicket');

        const session = StateManager.getOrCreateSession();
        this.seconds = session.elapsedSeconds;
        this.sessionStartDateTime = new Date(session.initialDateTime);

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

    setInitialDateTime() {
        if (!this.dateTimeDisplay || !this.sessionStartDateTime) return;

        const pad = (n) => String(n).padStart(2, '0');
        const d = this.sessionStartDateTime;

        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());

        const dateTimeString = `${day}.${month}.${year} ${hours}:${minutes}`;
        this.dateTimeDisplay.innerText = dateTimeString;
    },

    updateDateTime() {
        if (!this.dateTimeDisplay) return;

        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');

        const day = pad(now.getDate());
        const month = pad(now.getMonth() + 1);
        const year = now.getFullYear();
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());

        const dateTimeString = `${day}.${month}.${year} ${hours}:${minutes}`;
        this.dateTimeDisplay.innerText = dateTimeString;
    },

    startTimerFromSession() {
        if (!this.timeOldNumber) return;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.seconds++;
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
