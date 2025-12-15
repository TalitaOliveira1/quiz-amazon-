// Array com URLs das imagens de fundo para cada pergunta
const fundos = [
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://www.bostonherald.com/wp-content/uploads/2024/06/GettyImages-1244270074.jpg?w=1024&h=682",
  "https://d1apxakas9uxdu.cloudfront.net/uploads/38214/pictures/ea48d30e-6a0d-4245-b68b-e67358abc81cprime-day.png",
  "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1LN5km.img?w=722&h=406&m=4&q=93",
  "https://t4.ftcdn.net/jpg/03/89/64/95/360_F_389649537_5cM1Fj9ipju7EUwpfSVlCu3kmaCxa2kV.jpg",
  "https://etimg.etb2bimg.com/thumb/msid-78948335,imgsize-156395,width-1200,height=765,overlay-etretail/e-commerce/e-tailing/amazon-sees-pandemic-boosting-holiday-sales-and-investment-in-delivery.jpg",
  "https://parcelpath.com/wp-content/uploads/2024/01/amazon-package-late-refund.jpg",
  "https://i.ebayimg.com/images/g/riEAAOSw8gBnMK22/s-l500.png",
  "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1wjyf1.img?w=768&h=402&m=6",
  "https://habrastorage.org/r/w1560/webt/gx/me/t9/gxmet9e4jxct6mq29hhss4bdj78.png"
];

// Array com todas as perguntas do quiz
const QUESTIONS_MASTER = [
  { 
    question: 'Quem é o fundador da Amazon?', // Texto da pergunta
    options: ['Bill Gates', 'Jeff Bezos', 'Elon Musk', 'Mark Zuckerberg', 'Steve Jobs'], // Opções de resposta
    correctAnswer: 'Jeff Bezos', // Resposta correta
    points: 10 // Pontos por acertar
  },
  { 
    question: 'Qual o nome do assistente virtual da Amazon?', 
    options: ['Siri', 'Alexa', 'Google Assistant', 'Cortana', 'Bixby'], 
    correctAnswer: 'Alexa', 
    points: 10 
  },
  { 
    question: 'Qual o nome do serviço de streaming de música da Amazon?', 
    options: ['Amazon Tunes', 'Amazon Music', 'Amazon Sound', 'Amazon Stream', 'Prime Music'], 
    correctAnswer: 'Amazon Music', 
    points: 10 
  },
  { 
    question: 'Qual é o nome do serviço de streaming de vídeo da Amazon?', 
    options: ['Amazon Prime', 'Amazon Video', 'Prime Video', 'Amazon TV', 'Stream Amazon'], 
    correctAnswer: 'Prime Video', 
    points: 10 
  },
  { 
    question: 'Como se chama o leitor de livros digitais da Amazon?', 
    options: ['iPad', 'Kindle', 'Nook', 'Kobo', 'Paperwhite'], 
    correctAnswer: 'Kindle', 
    points: 10 
  },
  { 
    question: 'Qual é o nome do programa de assinatura premium da Amazon?', 
    options: ['Amazon Plus', 'Amazon Prime', 'Amazon Club', 'Amazon Premium', 'Prime Club'], 
    correctAnswer: 'Amazon Prime', 
    points: 10 
  },
  { 
    question: 'Em que ano a Amazon foi fundada?', 
    options: ['1994', '1995', '1996', '1997', '1998'], 
    correctAnswer: '1994', 
    points: 10 
  },
  { 
    question: 'Qual destes NÃO é um serviço da Amazon?', 
    options: ['AWS', 'Twitch', 'Whole Foods', 'Google Cloud', 'Audible'], 
    correctAnswer: 'Google Cloud', 
    points: 10 
  },
  { 
    question: 'Qual é a sede mundial da Amazon?', 
    options: ['Seattle', 'Nova York', 'San Francisco', 'Los Angeles', 'Chicago'], 
    correctAnswer: 'Seattle', 
    points: 10 
  },
  { 
    question: 'Qual destes produtos foi lançado pela Amazon?', 
    options: ['Echo', 'iPhone', 'Galaxy Tab', 'PlayStation', 'Fire TV'], 
    correctAnswer: 'Echo', 
    points: 10 
  }
];

// Variáveis para controlar o estado do jogo
let questions = []; // Perguntas embaralhadas para esta rodada
let currentQuestionIndex = 0; // Índice da pergunta atual (começa em 0)
let totalPoints = 0; // Pontuação total do jogador
let timer = null; // Referência ao timer em execução
let timeLeft = 30; // Tempo restante para a pergunta atual
const TIME_PER_QUESTION = 30; // Tempo total por pergunta (30 segundos)
let wrongAnswers = []; // Array para armazenar respostas erradas
let playerName = ""; // Nome do jogador

// Referências aos elementos HTML
const startOverlay = document.getElementById('start-overlay'); // Tela inicial
const startBtn = document.getElementById('start-btn'); // Botão Começar
const startAnonBtn = document.getElementById('start-anon-btn'); // Botão Anônimo
const playerInput = document.getElementById('player-input'); // Input do nome
const errorMessage = document.getElementById('error-message'); // Mensagem de erro
const questionContainer = document.getElementById('question-container'); // Container do quiz
const questionEl = document.getElementById('question'); // Elemento da pergunta
const optionsContainer = document.getElementById('options-container'); // Container das opções
const resultEl = document.getElementById('result'); // Elemento do resultado
const pointsValue = document.getElementById('points-value'); // Display da pontuação
const timeText = document.getElementById('time-text'); // Texto do timer
const timerBar = document.getElementById('timer-bar'); // Barra do timer
const progressBar = document.getElementById('progress-bar'); // Barra de progresso
const progressText = document.getElementById('progress-text'); // Texto do progresso
const playerEl = document.getElementById('player'); // Display do nome do jogador

// Event listener para validar input do nome
playerInput.addEventListener('input', function() {
  const name = this.value.trim(); // Remove espaços do início e fim
  
  if (name.length > 0) { // Se o nome não estiver vazio
    startBtn.disabled = false; // Ativa o botão Começar
    errorMessage.textContent = ''; // Limpa mensagem de erro
  } else { // Se o nome estiver vazio
    startBtn.disabled = true; // Desativa o botão Começar
    errorMessage.textContent = ''; // Limpa mensagem de erro
  }
});

// Função para tocar sons de feedback
function playSound(type) {
  try {
    if (type === 'correct') { // Som para resposta correta
      const ctx = new (window.AudioContext || window.webkitAudioContext)(); // Cria contexto de áudio
      const oscillator = ctx.createOscillator(); // Cria oscilador
      const gainNode = ctx.createGain(); // Cria nó de ganho (volume)
      
      oscillator.connect(gainNode); // Conecta oscilador ao ganho
      gainNode.connect(ctx.destination); // Conecta à saída
      
      oscillator.frequency.value = 800; // Frequência alta
      oscillator.type = 'sine'; // Tipo de onda
      gainNode.gain.value = 0.1; // Volume baixo
      
      oscillator.start(); // Inicia o som
      setTimeout(() => oscillator.stop(), 200); // Para após 200ms
      return;
    } else if (type === 'wrong') { // Som para resposta errada
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 400; // Frequência baixa
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 300); // Para após 300ms
      return;
    }
  } catch (e) { // Se der erro no áudio
    console.log("Áudio não suportado:", e); // Log no console
  }
}

// Handler para botão Começar (com nome)
startBtn.onclick = () => {
  const name = playerInput.value.trim(); // Pega o nome digitado
  
  if (name.length === 0) { // Se o nome estiver vazio
    errorMessage.textContent = 'Por favor, digite seu nome'; // Mostra erro
    return; // Sai da função
  }
  
  playSound('correct'); // Toca som de confirmação
  playerName = name; // Armazena o nome
  playerEl.textContent = `Jogador: ${playerName}`; // Mostra na tela
  startOverlay.style.display = "none"; // Esconde tela inicial
  initQuiz(); // Inicia o quiz
};

// Handler para botão Anônimo
startAnonBtn.onclick = () => {
  playSound('correct'); // Toca som de confirmação
  playerName = "Anônimo"; // Define nome como Anônimo
  playerEl.textContent = `Jogador: ${playerName}`; // Mostra na tela
  startOverlay.style.display = "none"; // Esconde tela inicial
  initQuiz(); // Inicia o quiz
};

// Função para inicializar o quiz
function initQuiz() {
  // Embaralha perguntas e opções
  questions = shuffleArray(QUESTIONS_MASTER).map(q => ({...q, options: shuffleArray(q.options)}));
  currentQuestionIndex = 0; // Começa na primeira pergunta
  totalPoints = 0; // Zera pontuação
  wrongAnswers = []; // Limpa respostas erradas
  questionContainer.style.display = 'flex'; // Mostra container (mudado para flex)

  loadQuestion(); // Carrega primeira pergunta
}

// Função para embaralhar array (Fisher-Yates)
function shuffleArray(arr) {
  const a = [...arr]; // Cria cópia do array
  
  for (let i = a.length - 1; i > 0; i--) { // Percorre de trás para frente
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatório
    [a[i], a[j]] = [a[j], a[i]]; // Troca elementos
  }
  
  return a; // Retorna array embaralhado
}

// Função para trocar imagem de fundo
function trocarFundo() {
  const index = currentQuestionIndex; // Índice da pergunta atual
  
  if (index < fundos.length) { // Se existe imagem para esta pergunta
    document.body.style.backgroundImage = `url('${fundos[index]}')`; // Aplica imagem
  }
}

// Função para carregar uma pergunta
function loadQuestion() {
  trocarFundo(); // Muda o fundo
  
  const q = questions[currentQuestionIndex]; // Pega pergunta atual

  questionEl.textContent = q.question; // Mostra pergunta
  resultEl.textContent = ""; // Limpa resultado anterior
  resultEl.style.color = ''; // Reseta cor

  optionsContainer.innerHTML = ""; // Limpa opções anteriores
  
  // Cria botões para cada opção
  q.options.forEach(opt => {
    const btn = document.createElement('button'); // Cria botão
    btn.className = "option-btn"; // Adiciona classe CSS
    btn.textContent = opt; // Define texto
    btn.onclick = () => { // Handler de clique
      handleAnswer(opt, btn); // Processa resposta
    };
    optionsContainer.appendChild(btn); // Adiciona ao container
  });

  resetTimer(); // Reinicia timer
  updateProgress(); // Atualiza progresso
}

// Atualiza barra de progresso
function updateProgress() {
  const total = questions.length; // Total de perguntas
  progressText.textContent = `Pergunta ${currentQuestionIndex+1} / ${total}`; // Atualiza texto
  progressBar.style.width = ((currentQuestionIndex)/total)*100 + "%"; // Atualiza largura
}

// Processa resposta do usuário
function handleAnswer(selected, btn) {
  stopTimer(); // Para o timer

  const q = questions[currentQuestionIndex]; // Pega pergunta atual

  const buttons = optionsContainer.querySelectorAll("button"); // Pega todos botões
  buttons.forEach(b => b.disabled = true); // Desabilita todos

  if (selected === q.correctAnswer) { // Se resposta correta
    btn.classList.add("correct"); // Adiciona classe correct
    resultEl.textContent = `Correto! +${q.points} pontos`; // Mostra mensagem
    resultEl.style.color = 'var(--good)'; // Cor verde
    totalPoints += q.points; // Adiciona pontos
    pointsValue.textContent = totalPoints; // Atualiza display
    playSound('correct'); // Toca som correto
  } else { // Se resposta errada
    btn.classList.add("incorrect"); // Adiciona classe incorrect
    // Destaca resposta correta
    buttons.forEach(b => {
      if (b.textContent === q.correctAnswer) b.classList.add("correct");
    });
    resultEl.textContent = `Incorreto! A resposta correta era: ${q.correctAnswer}`; // Mensagem
    resultEl.style.color = 'var(--bad)'; // Cor vermelha
    playSound('wrong'); // Toca som errado
    
    // Armazena resposta errada
    wrongAnswers.push({
      question: q.question,
      userAnswer: selected,
      correctAnswer: q.correctAnswer,
      questionNumber: currentQuestionIndex + 1
    });
  }

  // Aguarda 2 segundos antes de próxima pergunta
  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

// Avança para próxima pergunta
function nextQuestion() {
  currentQuestionIndex++; // Incrementa índice
  
  if (currentQuestionIndex >= questions.length) { // Se acabaram perguntas
    finishQuiz(); // Finaliza quiz
    return;
  }
  
  loadQuestion(); // Carrega próxima pergunta
}

// Reinicia o timer
function resetTimer() {
  stopTimer(); // Para timer anterior
  timeLeft = TIME_PER_QUESTION; // Reseta tempo
  timeText.textContent = timeLeft + "s"; // Atualiza texto
  timerBar.style.width = "100%"; // Reseta barra

  timer = setInterval(() => { // Inicia intervalo
    timeLeft--; // Decrementa tempo
    timeText.textContent = timeLeft + "s"; // Atualiza texto
    timerBar.style.width = (timeLeft / TIME_PER_QUESTION) * 100 + "%"; // Atualiza barra

    if (timeLeft <= 0) { // Se tempo acabou
      stopTimer(); // Para timer
      resultEl.textContent = "Tempo esgotado!"; // Mostra mensagem
      resultEl.style.color = 'var(--bad)'; // Cor vermelha
      playSound('wrong'); // Toca som
      
      const q = questions[currentQuestionIndex]; // Pega pergunta atual
      
      // Desabilita botões e destaca resposta correta
      optionsContainer.querySelectorAll("button").forEach(btn => {
        btn.disabled = true; // Desabilita
        if (btn.textContent === q.correctAnswer) btn.classList.add("correct"); // Destaca correta
      });
      
      // Armazena como resposta errada por tempo
      wrongAnswers.push({
        question: q.question,
        userAnswer: "Tempo esgotado",
        correctAnswer: q.correctAnswer,
        questionNumber: currentQuestionIndex + 1
      });
      
      // Aguarda 2 segundos antes de próxima
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }, 1000); // Executa a cada segundo
}

// Para o timer
function stopTimer() {
  if (timer) clearInterval(timer); // Limpa intervalo se existir
}

// Mostra tela final
function finishQuiz() {
  const totalQuestions = questions.length; // Total de perguntas
  const correctAnswers = totalQuestions - wrongAnswers.length; // Acertos
  const scorePercentage = Math.round((totalPoints / (totalQuestions * 10)) * 100); // Porcentagem
  const isPerfectScore = wrongAnswers.length === 0; // Se não errou nenhuma
  
  let finalContent = `
    <div class="final-header">
      <h2>Quiz Concluído!</h2>
      <div class="player-info"><strong>Jogador:</strong> ${playerName}</div>
      <div class="score-display">${totalPoints} Pontos</div>
      <div class="performance-badge">${correctAnswers}/${totalQuestions} acertos (${scorePercentage}%)</div>
    </div>
    
    <div class="final-stats">
      <h3>Estatísticas do Desempenho</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Acertos</div>
          <div class="stat-value correct">${correctAnswers}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Erros</div>
          <div class="stat-value incorrect">${wrongAnswers.length}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Pontuação Total</div>
          <div class="stat-value">${totalPoints}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Taxa de Acerto</div>
          <div class="stat-value">${scorePercentage}%</div>
        </div>
      </div>
    </div>
  `;
  
  if (isPerfectScore) { // Se pontuação perfeita
    finalContent += `
      <div class="perfect-score">
        <h3>Pontuação Perfeita!</h3>
        <p>Excelente trabalho! Você demonstrou um conhecimento excepcional sobre a Amazon acertando todas as questões!</p>
      </div>
    `;
  }
  
  if (wrongAnswers.length > 0) { // Se houve erros
    finalContent += `
      <div class="wrong-answers-container">
        <h3>Análise das Respostas Incorretas</h3>
        <ul class="wrong-answers-list">
          ${wrongAnswers.map(item => `
            <li class="wrong-answer-item">
              <strong>Pergunta ${item.questionNumber}: ${item.question}</strong>
              <div class="answer-comparison">
                <div class="user-answer">Sua resposta: ${item.userAnswer}</div>
                <div class="correct-answer">Resposta correta: ${item.correctAnswer}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  finalContent += `
    <button class="restart-btn">Jogar Novamente</button>
  `;
  
  questionContainer.innerHTML = finalContent; // Insere conteúdo
  questionContainer.style.display = 'block'; // Muda para block (tela final)
  
  const restartBtn = questionContainer.querySelector('.restart-btn'); // Pega botão restart
  restartBtn.onclick = () => location.reload(); // Recarrega página ao clicar
}