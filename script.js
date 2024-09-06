let questions = [];
let currentQuestion = {};
let userAnswer = "";
let score = 0;
let timer;
let baseTime = 10;
let timeLeft = baseTime;
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
    timeLeft = baseTime - (level * 2); // Reduz 2 segundos por nível
    timeLeft = Math.max(3, timeLeft); // Garantir pelo menos 3 segundos de resposta
    isTimeOut = false; // Reseta a variável de tempo esgotado
    startTimer();

    const questionElement = document.getElementById('question');
    const optionsList = document.getElementById('options');

    // Adicionar animação ao carregar pergunta
    questionElement.classList.add('animate__animated', 'animate__fadeIn');
    optionsList.classList.add('animate__animated', 'animate__fadeIn');

    setTimeout(() => {
        questionElement.classList.remove('animate__animated', 'animate__fadeIn');
        optionsList.classList.remove('animate__animated', 'animate__fadeIn');
    }, 1000);

    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];

    questionElement.textContent = currentQuestion.question;
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

    // Armazenar pontuação no localStorage
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(score);
    highScores.sort((a, b) => b - a); // Ordenar da maior para a menor pontuação
    highScores = highScores.slice(0, 5); // Manter apenas os 5 melhores

    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Exibir ranking
    let ranking = 'Ranking:\n';
    highScores.forEach((highScore, index) => {
        ranking += `${index + 1}. ${highScore} pontos\n`;
    });
    alert(ranking);

    location.reload(); // Recarrega a página para reiniciar o quiz
}

// Carrega as perguntas e inicializa o quiz
loadQuestions();