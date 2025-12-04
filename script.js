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

// Выбор вида транспорта
const car = document.getElementById('car');
const menuCar = document.getElementById('menuCar');
const btnMenuOne = document.getElementById('btnMenuOne');   // Трамвай
const btnMenuTwo = document.getElementById('btnMenuTwo');   // Тролейбус
const btnMenuThree = document.getElementById('btnMenuThree'); // Автобус

// Т/С
const tcValue = document.getElementById('tcValue');

//
// === ПРАВИЛА ДЛЯ Т/С ===
// Трамвай + 18 → 852
// Трамвай + 2  → 033
//
function updateTCByRules() {
    const transport = car.innerText.replace(':', '').trim(); // "Автобус", "Трамвай", "Тролейбус"
    const route = numberCar.textContent.trim();

    if (transport === 'Трамвай' && route === '18') {
        tcValue.textContent = '852';
    } else if (transport === 'Трамвай' && route === '2') {
        tcValue.textContent = '033';
    } else {
        // всё остальное оставляем как есть
        // tcValue.textContent = '1240';
    }
}

// Делаем функции доступными для inline-обработчиков в HTML
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

// Открытие меню выбора транспорта
car.addEventListener('click', () => {
    menuCar.style.display = 'flex';
});

// Кнопки транспорта
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

function nowFu() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeString = `${day}.${month}.${year} ${hours}:${minutes}`;
    DataTime.innerText = dateTimeString;
}

DataTime.addEventListener('click', nowFu);

// Таймер "С момента оплаты прошло"
let timerInterval;
let seconds = 0;
const timeOldNumber = document.getElementById('timeOldNumber');

function timeFu() {
    clearInterval(timerInterval);
    seconds = 30;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeString = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        seconds++;
        timeOldNumber.innerText = timeString;
    }, 1000);
}

timeOldNumber.addEventListener('click', timeFu);

// Один раз обновим правила при загрузке
updateTCByRules();
