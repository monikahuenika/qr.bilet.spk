import { StateManager } from './state-manager.js';

/**
 * Управление датой/временем и таймером
 * Отображает дату/время открытия сессии и таймер с учетом прошедшего времени
 */
export const DateTimeManager = {
    dateTimeDisplay: null,
    timeOldNumber: null,
    timerInterval: null,
    seconds: 0,
    sessionStartDateTime: null,
    btnDownloadTicket: null,

    /**
     * Инициализация модуля
     */
    init() {
        this.dateTimeDisplay = document.getElementById('DataTime');
        this.timeOldNumber = document.getElementById('timeOldNumber');
        this.btnDownloadTicket = document.getElementById('btnDownloadTicket');

        // Получить или создать сессию
        const session = StateManager.getOrCreateSession();
        this.seconds = session.elapsedSeconds;
        this.sessionStartDateTime = new Date(session.initialDateTime);

        // Установить начальную дату/время из сессии
        this.setInitialDateTime();

        // Запустить таймер с учетом прошедшего времени
        this.startTimerFromSession();

        // Клик на дату/время обновляет на текущее время
        if (this.dateTimeDisplay) {
            this.dateTimeDisplay.addEventListener('click', () => this.updateDateTime());
        }

        // Клик на "Скачать билет" перезапускает сессию
        if (this.btnDownloadTicket) {
            this.btnDownloadTicket.addEventListener('click', () => this.handleDownloadTicket());
        }
    },

    /**
     * Обработчик кнопки "Скачать билет"
     * Перезапускает сессию (сбрасывает таймер и дату)
     */
    handleDownloadTicket() {
        console.log('📥 Скачивание билета - сброс таймера');
        this.restartSession();
    },

    /**
     * Установить начальную дату/время из сессии
     */
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

        console.log('📅 Дата/время установлено из сессии:', dateTimeString);
    },

    /**
     * Обновить отображение даты и времени (на текущее)
     */
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

    /**
     * Запустить таймер с учетом прошедшего времени из сессии
     */
    startTimerFromSession() {
        if (!this.timeOldNumber) return;

        // Очистить предыдущий интервал, если был
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Отобразить начальное значение
        this.updateTimerDisplay();

        // Запустить таймер
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateTimerDisplay();
        }, 1000);

        console.log(`⏱️ Таймер запущен с ${Math.floor(this.seconds / 60)}:${String(this.seconds % 60).padStart(2, '0')}`);
    },

    /**
     * Обновить отображение таймера
     */
    updateTimerDisplay() {
        if (!this.timeOldNumber) return;

        const minutes = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        const timeString = `${minutes}:${String(secs).padStart(2, '0')}`;

        this.timeOldNumber.innerText = timeString;
    },

    /**
     * Перезапустить сессию (при клике на кнопку "Скачать билет")
     */
    restartSession() {
        // Создать новую сессию
        const session = StateManager.startSession();
        this.seconds = 30; // Начать с 30 секунд
        this.sessionStartDateTime = new Date(session.initialDateTime);

        // Обновить дату/время
        this.setInitialDateTime();

        // Перезапустить таймер
        this.startTimerFromSession();

        console.log('🔄 Сессия перезапущена');
    },

    /**
     * Остановить таймер
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};
