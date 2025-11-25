let colorFonts = document.getElementById('colorFonts')
let boxStartQr = document.getElementById('boxStartQr')
const numberCar = document.getElementById('numberCar')


const btnSaveTiketStart = document.getElementById('btnSaveTiketStart')
btnSaveTiketStart.addEventListener(('click'), () => {
    colorFonts.style.display = 'none'
    boxStartQr.style.display = 'none'
})

const impunFl = document.getElementById('impunFl')

const showInput = () => {
    impunFl.style.display = 'block'
    impunFl.focus()
    numberCar.style.display = 'none'
}

const hideInput = () => {
    impunFl.style.display = 'none'
    numberCar.style.display = 'block'
}

const updateDisplay = () => {
    numberCar.textContent = impunFl.value;
}

showInput()
hideInput()
updateDisplay()


let car = document.getElementById('car')
const menuCar = document.getElementById('menuCar')
const btnMenuOne = document.getElementById('btnMenuOne')
const btnMenuTwo = document.getElementById('btnMenuTwo')
const btnMenuThree = document.getElementById('btnMenuThree')
car.addEventListener(('click'), () => {
    menuCar.style.display = 'flex'
})

btnMenuOne.addEventListener(('click'), () => {
    car.innerText = 'Трамвай'
    menuCar.style.display = 'none'
})
btnMenuTwo.addEventListener(('click'), () => {
    car.innerText = 'Тролейбус'
    menuCar.style.display = 'none'
})
btnMenuThree.addEventListener(('click'), () => {
    car.innerText = 'Автобус'
    menuCar.style.display = 'none'
})

let DataTime = document.getElementById('DataTime');


const nowFu = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const dateTimeString = `${day}.${month}.${year} ${hours}:${minutes}`; // Собираем строку
            DataTime.innerText = dateTimeString            
}
DataTime.addEventListener(('click'), () => {
    nowFu()
})


let timerInterval;
let seconds = 0;
timeOldNumber = document.getElementById('timeOldNumber')

const timeFu = () => {
    clearInterval(timerInterval); // Очищаем предыдущий таймер, если он есть
    seconds = 30; // Начинаем с 1 минуты

    timerInterval = setInterval(function() {
        const minutes = Math.floor(seconds / 60); // Увеличиваем на 1, чтобы минуты начинались с 1
        const secs = seconds % 60;

        // Формируем строку времени
        const timeString = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        seconds ++;
        timeOldNumber.innerText = timeString
},1000);
}

timeOldNumber.addEventListener(('click'), () => {
    timeFu()
})

// ----- Редактирование Т/С -----
const tc = document.getElementById('tc');
const tcValue = document.getElementById('tcValue');
const tcInput = document.getElementById('tcInput');

const showTcInput = () => {
    tcInput.style.display = 'inline-block';
    tcInput.value = tcValue.textContent.trim();
    tcValue.style.display = 'none';
    tcInput.focus();
};

const hideTcInput = () => {
    tcValue.textContent = tcInput.value.trim() || tcValue.textContent;
    tcInput.style.display = 'none';
    tcValue.style.display = 'inline';
};

// Клик по блоку Т/С — включаем редактирование
tc.addEventListener('click', showTcInput);

// При потере фокуса — сохраняем и скрываем инпут
tcInput.addEventListener('blur', hideTcInput);

// По Enter тоже сохраняем
tcInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        tcInput.blur();
    }
});









