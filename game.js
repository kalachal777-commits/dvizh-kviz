const questions = [
    // ЧАСТЬ 1 — ВЫБОР ОТВЕТА (1 балл)
    
    { q: "Кто должен был сыграть Нео в «Матрице», но отказался?", type: "choice", options: ["Брэд Питт", "Уилл Смит", "Джонни Депп", "Том Круз"], correct: "Уилл Смит", points: 1 },
    { q: "Какой фильм НЕ получил «Оскар» за лучший фильм?", type: "choice", options: ["Гладиатор", "Титаник", "Начало", "Властелин колец"], correct: "Начало", points: 1 },
    { q: "Какой фильм Квентина Тарантино вышел первым?", type: "choice", options: ["Бешеные псы", "Криминальное чтиво", "Джеки Браун", "Убить Билла"], correct: "Бешеные псы", points: 1 },
    { q: "Как называется вирус в сериале «Одни из нас» (The Last of Us)?", type: "choice", options: ["Коридис", "Корицепс", "Ковидис", "Кордицепс"], correct: "Кордицепс", points: 1 },
    { q: "Фильм: герой не помнит прошлого, записывает всё на теле, ищет убийцу жены.", type: "choice", options: ["Неизвестный", "Помни", "Вспомнить всё", "Убийца"], correct: "Помни", points: 1 },
    { q: "Сериал: парк развлечений, андроиды, восстание машин, философия сознания.", type: "choice", options: ["Одна из многих", "Мир дикого запада", "Ходячие мертвецы", "Остаться в живых"], correct: "Мир дикого запада", points: 1 },

    // ЧАСТЬ 4 — ФОТО/ВИДЕО (4 балла)

    { 
        q: "🎥 Какого персонажа преобразила нейросеть?", 
        type: "input", 
        correct: "Хагрид", 
        points: 4, 
        media: "Хагрид.jpg" 
    },
    { 
        q: "🖼 Из какого фильма этот мем?", 
        type: "input", 
        correct: "Великий Гэтсби", 
        points: 4, 
        media: "https://i.ytimg.com/vi/DAmjETE6zmI/maxresdefault.jpg" 
    },
    { 
        q: "🎥 Какой актёр скрывается за гримом?", 
        type: "input", 
        correct: "Колин Фаррелл", 
        points: 4, 
        media: "https://images.squarespace-cdn.com/content/v1/5ddbea8fe7b0381e7563251a/1695307902718-NRMDGQILSC49K6QYH4WY/jonathan-olley-the-batman-colin-farrell-warner-bros-unit-stills-movie-film-stills-photography_14.jpg" 
    }
        { 
        q: "🖼 Из какого фильма этот отрывок?", 
        type: "input", 
        correct: "Шпион", 
        points: 4, 
        media: "Shpion.mp4" 
    },
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const inputContainer = document.getElementById('input-container');
const answerInput = document.getElementById('answer-input');
const feedback = document.getElementById('feedback');
const correctText = document.getElementById('correct-answer-text');
const timerDisplay = document.getElementById('timer');
const startGameBtn = document.getElementById('start-game-btn');
const timerDiv = document.getElementById('timer');

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-container').classList.add('hide');
    document.getElementById('question-container').classList.add('hide');
    feedback.classList.add('hide');
    startGameBtn.classList.remove('hide'); 
    timerDiv.classList.add('hide');
}

function startActualGame() {
    startGameBtn.classList.add('hide');
    timerDiv.classList.remove('hide');
    document.getElementById('question-container').classList.remove('hide');
    showQuestion();
}

startGameBtn.addEventListener('click', startActualGame);

function showQuestion() {
    resetState();
    let q = questions[currentQuestionIndex];
    questionText.innerText = q.q;

    const mediaContainer = document.getElementById('media-container');
    mediaContainer.innerHTML = ''; 

    if (q.media) {
        const isYoutube = q.media.includes('youtube.com') || q.media.includes('youtu.be');
        const isVK = q.media.includes('vkvideo.ru') || q.media.includes('vk.com');
        const isMP4 = q.media.toLowerCase().endsWith('.mp4'); // Проверка на формат файла

        if (isYoutube || isVK) {
            // Видео с хостингов
            mediaContainer.innerHTML = `
                <div class="video-responsive" style="margin-bottom: 20px;">
                    <iframe src="${q.media}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen 
                        style="width:100%; aspect-ratio: 16/9; border-radius:15px;"></iframe>
                </div>`;
        } else if (isMP4) {
            // Локальное видео MP4
            mediaContainer.innerHTML = `
                <video controls autoplay playsinline style="width:100%; border-radius:15px; margin-bottom: 20px;">
                    <source src="${q.media}" type="video/mp4">
                    Ваш браузер не поддерживает видео.
                </video>`;
        } else {
            // Обычная картинка
            mediaContainer.innerHTML = `<img src="${q.media}" style="max-width:100%; border-radius:15px; margin-bottom: 20px;">`;
        }
    }
    // ... остальной код функции (кнопки, таймер) без изменений

    if (q.type === "choice") {
        answerButtons.classList.remove('hide');
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.classList.add('answer-btn');
            btn.onclick = () => checkAnswer(opt);
            answerButtons.appendChild(btn);
        });
    } else {
        inputContainer.classList.remove('hide');
    }

    startTimer();
}

function startTimer() {
    timeLeft = 30;
    timerDisplay.innerText = `Осталось: ${timeLeft} сек`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Осталось: ${timeLeft} сек`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null); 
        }
    }, 1000);
}

function resetState() {
    clearInterval(timerInterval);
    feedback.classList.add('hide');
    answerButtons.innerHTML = '';
    answerButtons.classList.add('hide');
    inputContainer.classList.add('hide');
    answerInput.value = '';
}

function checkAnswer(userAnswer) {
    clearInterval(timerInterval);
    let q = questions[currentQuestionIndex];
    let isCorrect = false;

    if (q.type === "choice") {
        isCorrect = (userAnswer === q.correct);
    } else {
        let val = (userAnswer || answerInput.value).trim().toLowerCase();
        isCorrect = (val === q.correct.toLowerCase());
    }

    if (isCorrect) score += q.points;

    correctText.innerHTML = isCorrect ? 
        `<span style="color:#22c55e">Верно! +${q.points} баллов</span>` : 
        `<span style="color:#ef4444">Неверно. Ответ: ${q.correct}</span>`;
    
    feedback.classList.remove('hide');
}

document.getElementById('next-btn').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
};

document.getElementById('submit-btn').onclick = () => checkAnswer();

function showResults() {
    document.getElementById('question-container').classList.add('hide');
    feedback.classList.add('hide');
    timerDiv.classList.add('hide');
    
    const res = document.getElementById('result-container');
    res.classList.remove('hide');
    
    let message = score > 10 ? "Отличный результат!" : "Неплохо, но можно лучше!";
    document.getElementById('score-text').innerHTML = `<h3>${message}</h3><p>Вы набрали <strong>${score}</strong> баллов.</p>`;
}

initQuiz();
