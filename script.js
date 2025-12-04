// Оверлей "сохраните билет"
const colorFonts = document.getElementById('colorFonts');
const boxStartQr = document.getElementById('boxStartQr');
const btnSaveTiketStart = document.getElementById('btnSaveTiketStart');

btnSaveTiketStart.addEventListener('click', () => {
    colorFonts.style.display = 'none';
    boxStartQr.style.display = 'none';
});

// Номер маршрута (редактирование)
const numberCar = document.getElementById('numberCar');
const impunFl = document.getElementById('impunFl');

// Сделаем функции доступными для inline-обработчиков в HTML
window.showInput = () => {
    impunFl.style.display = 'block';
    impunFl.value = numberCar.textContent.trim();
    impunFl.focus();
    numberCar.style.display = 'none';
};

window.hideInput = () => {
    impunFl.style.display = 'none';
    numberCar.style.display = 'block';
};

window.updateDisplay = () => {
    numberCar.textContent = impunFl.value;
    updateTCByRules();
};

// Выбор вида транспорта
const car = document.getElementById('car');
const menuCar = document.getElementById('menuCar');
const btnMenuOne = document.getElementById('btnMenuOne');   // Трамвай
const btnMenuTwo = document.getElementById('btnMenuTwo');   // Тролейбус
const btnMenuThree = document.getElementById('btnMenuThree'); // Автобус

car.addEventListener('click', () => {
    menuCar.style.display = 'flex';
});

btnMenuOne.addEventListener('click', () => {
    car.innerText = 'Трамвай';
    menuCar.style.display = 'none';
    updateTCByRules();
});

btnMenuTwo.addEventListener('click', () => {
    car.innerText = 'Тролейбус';
    menuCar.style.display = 'none';
    updateTCByRules();
});

btnMenuThree.addEventListener('click', () => {
    car.innerText = 'Автобус';
    menuCar.style.display = 'none';
    updateTCByRules();
});

// Дата и время
const DataTime = document.getElementById('DataTime');

const nowFu = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeString = `${day}.${month}.${year} ${hours}:${minutes}`;
    DataTime.innerText = dateTimeString;
};

DataTime.addEventListener('click', () => {
    nowFu();
});

// Таймер "С момента оплаты прошло"
let timerInterval;
let seconds = 0;
const timeOldNumber = document.getElementById('timeOldNumber');

const timeFu = () => {
    clearInterval(timerInterval);
    seconds = 30; // начинаем с 30 секунд

    timerInterval = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeString = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        seconds++;
        timeOldNumber.innerText = timeString;
    }, 1000);
};

timeOldNumber.addEventListener('click', () => {
    timeFu();
});

// --- ЛОГИКА Т/С ---

const tc = document.getElementById('tc');
const tcValue = document.getElementById('tcValue');
const tcInput = document.getElementById('tcInput');

let isManualTc = false; // если пользователь сам ввёл Т/С, правила больше не трогаем

// Автоподстановка Т/С по правилам
const updateTCByRules = () => {
    if (isManualTc) return; // не трогаем, если пользователь уже вручную редактировал

    const transport = car.innerText.replace(':', '').trim();   // "Автобус", "Трамвай", "Тролейбус"
    const route = numberCar.textContent.trim();                // номер маршрута

    if (transport === 'Трамвай' && route === '18') {
        tcValue.textContent = '852';
    } else if (transport === 'Трамвай' && route === '2') {
        tcValue.textContent = '033';
    } else {
        // можно оставить как есть, без сброса
        // tcValue.textContent = '1240';
    }
};

// Редактирование Т/С вручную по клику
const showTcInput = () => {
    isManualTc = true;
    tcInput.style.display = 'inline-block';
    tcInput.value = tcValue.textContent.trim();
    tcValue.style.display = 'none';
    tcInput.focus();
};

const hideTcInput = () => {
    const val = tcInput.value.trim();
    if (val) {
        tcValue.textContent = val;
        isManualTc = true;
    } else {
        // если пользователь стер всё — вернём управление правилам
        isManualTc = false;
        updateTCByRules();
    }
    tcInput.style.display = 'none';
    tcValue.style.display = 'inline';
};

tc.addEventListener('click', showTcInput);

tcInput.addEventListener('blur', hideTcInput);

tcInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        tcInput.blur();
    }
});

// Можно один раз вызвать правила при загрузке
updateTCByRules();
