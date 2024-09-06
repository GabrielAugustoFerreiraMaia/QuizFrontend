let questions = [];
let currentQuestion = {};
let userAnswer = "";
let score = 0;
let timer;
let timeLeft = 10;
let level = 1;
const maxLevel = 3; // Número máximo de níveis
let isTimeOut = false; // Para controlar se o tempo acabou

// Carregar as perguntas do arquivo JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        loadQuestion();
    } catch (error) {
        console.error('Erro ao carregar as perguntas:', error);
    }
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    isTimeOut = false; // Reseta a variável de tempo esgotado
    startTimer();

    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];

    document.getElementById('question').textContent = currentQuestion.question;
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.classList.add('bg-gray-200', 'p-2', 'rounded', 'hover:bg-gray-300', 'cursor-pointer');
        li.onclick = () => {
            userAnswer = option;
            document.querySelectorAll('.options li').forEach(li => li.classList.remove('bg-blue-200'));
            li.classList.add('bg-blue-200');
        };
        optionsList.appendChild(li);
    });
}

function checkAnswer() {
    const result = document.getElementById('result');
    if (isTimeOut) {
        result.textContent = "Tempo esgotado! A resposta correta é " + currentQuestion.answer;
        result.classList.add('text-red-500');
        endQuiz(); // Termina o quiz se o tempo esgotar
    } else if (userAnswer === currentQuestion.answer) {
        score++;
        result.textContent = "Correto!";
        result.classList.add('text-green-500');

        document.getElementById('score').textContent = "Pontuação: " + score;

        // Aumenta o nível conforme a pontuação
        if (score % 3 === 0 && level < maxLevel) {
            level++;
            result.textContent += ` Parabéns! Você avançou para o nível ${level}!`;
            document.getElementById('level').textContent = "Nível: " + level;
        }

        // Carrega a próxima pergunta
        setTimeout(loadQuestion, 2000);
    } else {
        result.textContent = "Errado! A resposta correta é " + currentQuestion.answer;
        result.classList.add('text-red-500');
        endQuiz(); // Termina o quiz se o usuário errar
    }
}

function startTimer() {
    document.getElementById('timer').textContent = `Tempo restante: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Tempo restante: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            isTimeOut = true; // Marca que o tempo esgotou
            checkAnswer(); // Checa automaticamente quando o tempo esgota
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer); // Para o cronômetro
    alert(`Fim do jogo! Sua pontuação final foi: ${score}`);
    // Reinicia o quiz, se necessário
    location.reload(); // Recarrega a página para reiniciar o quiz
}

// Carrega as perguntas e inicializa o quiz
loadQuestions();