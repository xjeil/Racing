const cvs = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let background = new Image();
let mainCar = new Image();
let anotherCar = new Image();
let rightColum = new Image();
let borderR = new Image();
let borderL = new Image();
let musicOn = new Image();
let musicOff = new Image();

let audioGame = new Audio();
let audioGO = new Audio();

let carPosition = 90;
let arrPosition = [30, 60, 120, 178];
let anotherCarPosition = Math.floor(Math.random() * arrPosition.length);
let moveY = 0;
let moveY2 = 2;
let animationCars;
let animationBord;
let score = 0;
let maxRecord = parseInt(localStorage.getItem('record'));
let howManyCar = 0;
let howManyCar2 = 0;
let music = true;
let bordL = [];
bordL[0] = {
    x : 0,
    y : -40
}
let bordR = [];
bordR[0] = {
    x : 265,
    y : -40
}


background.src = 'img/bg.png';
mainCar.src = 'img/Car.png';
anotherCar.src = 'img/Car.png';
rightColum.src = 'img/rColum.png';
borderR.src = 'img/bord.png';
borderL.src = 'img/bord.png';
musicOn.src = 'img/volumeOn.png';
musicOff.src = 'img/volumeOff.png';

audioGame.src = 'audio/play.mp3';
audioGO.src = 'audio/crash.mp3';

// Отрисовка основного вида игры
function mainGame() {
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(rightColum, 294, 0);
}

// Движение встречных машин
function Cars() {
    mainGame();
    scoreShow();
    record();
    ctx.drawImage(mainCar, carPosition, 470);
    ctx.drawImage(anotherCar, arrPosition[anotherCarPosition], moveY);
    musicOnOff();
    border();
    
    moveY += moveY2;
    score += 0.3; // Общий счетчик 

    // Перемещение встречной машины в начало
    if (moveY > 584) {
        moveY = -100;
        anotherCarPosition = Math.floor(Math.random() * arrPosition.length);
        howManyCar += 1; // Увеличение счетчика машин
        moveY2 += 0.3; // Увеличение скорости движения
    }

    // Анимация движения
    animationCars = requestAnimationFrame(Cars);
    
    // Условие остановки игры при столкновении
    if ((carPosition >= arrPosition[anotherCarPosition] - 87 && carPosition <= arrPosition[anotherCarPosition] + 87) && moveY > 350) {
        audioGO.play();
        audioGame.pause();
        cancelAnimationFrame(animationCars);
        alert('Вы проиграли!');
        location.reload();
    }

}

// Движение и появление бордюров
function border() {
    for (let i = 0; i < bordL.length; i++) {
        ctx.drawImage(borderL, bordL[i].x, bordL[i].y);
        bordL[i].y += 4;
        if (bordL[i].y == 120) {
            bordL.push({
                x : 0,
                y : -40
            });
        }
    }
    for (let i = 0; i < bordR.length; i++) {
        ctx.drawImage(borderR, bordR[i].x, bordR[i].y);
        bordR[i].y += 4;
        if (bordR[i].y == 120) {
            bordR.push({
                x : 265,
                y : -40
            });
        }
    }
}

// Событие нажатия на клавишу "влево"
function carLeft(keyDown) {
    if (carPosition > 40) {
        carPosition -= 29;
        mainGame();
    }
}

// Событие нажатия на клавишу "вправо"
function carRight(keyDown) {
    if (carPosition < 170) {
        carPosition += 29;
        mainGame();
    }
}

// Проверка нажатия клавиш
function keyEvent(keyDown) {
    if (keyDown.keyCode === 37) {
        carLeft();
    } else if (keyDown.keyCode === 39) {
        carRight();
    } else if (keyDown.keyCode === 32) {
        if (music) {
            music = false;
        } else {
            music = true;
        }
    }
}

// Вывод счетчиков и подписи на экран 
function scoreShow() {
    ctx.font = '20px arial';
    ctx.fillText("Score: " + Math.floor(score), 305, 50, 100);
    ctx.fillText("Cars: " + howManyCar, 305, 100);
}

// Сохранение максимального рекорда
function record() {
    ctx.fillText("Record: " + maxRecord, 305, 300);
    if (score > maxRecord) {
        localStorage.setItem("record", score);
        maxRecord = parseInt(localStorage.getItem('record'));
    }

}

// Включить и отключить музыку
function musicOnOff() {
    if (music) {
        audioGame.play();
        ctx.drawImage(musicOn, 330, 500);
    } else {
        audioGame.pause();
        ctx.drawImage(musicOff, 330, 500);
    }
}

// Запуск анимации игры
function moveCars() {
    mainGame();
    animationCars = requestAnimationFrame(Cars);
}

// Запуск игры после подтверждения пользователя
if(confirm('Хотите ли вы начать игру?')) {
    alert('Управляйте машинкой с помощью клавиш "вправо" и "влево", пробел - вкл/выкл музыку');
    setTimeout(moveCars, 200);
    document.addEventListener('keydown', keyEvent);
}
