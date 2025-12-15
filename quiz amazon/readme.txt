// ============================================
// QUIZ AMAZON - VERSÃO OFFLINE COMPLETA
// ============================================

// IMPORTANTE: Use caminhos RELATIVOS, não absolutos
const fundos = [
  "imagem/fotos/img1.png",
  "imagem/fotos/img2.jpg",
  "imagem/fotos/img3.jpg",
  "imagem/fotos/img4.jpg",
  "imagem/fotos/img5.jpg",
  "imagem/fotos/img6.jpg",
  "imagem/fotos/img7.jpg",
  "imagem/fotos/img8.jpg",
  "imagem/fotos/img9.jpg",
  "imagem/fotos/img10.jpg"
];

// Array com todas as perguntas do quiz
const QUESTIONS_MASTER = [
  { 
    question: 'Quem é o fundador da Amazon?',
    options: ['Bill Gates', 'Jeff Bezos', 'Elon Musk', 'Mark Zuckerberg', 'Steve Jobs'],
    correctAnswer: 'Jeff Bezos',
    points: 10
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
let questions = [];
let currentQuestionIndex = 0;
let totalPoints = 0;
let timer = null;
let timeLeft = 30;
const TIME_PER_QUESTION = 30;
let wrongAnswers = [];
let playerName = "";

// Referências aos elementos HTML
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const startAnonBtn = document.getElementById('start-anon-btn');
const playerInput = document.getElementById('player-input');
const errorMessage = document.getElementById('error-message');
const questionContainer = document.getElementById('question-container');
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const resultEl = document.getElementById('result');
const pointsValue = document.getElementById('points-value');
const timeText = document.getElementById('time-text');
const timerBar = document.getElementById('timer-bar');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const playerEl = document.getElementById('player');

// ============================================
// FUNÇÃO PARA TROCAR FUNDO (CORRIGIDA PARA OFFLINE)
// ============================================

function trocarFundo() {
  const index = currentQuestionIndex;
  
  if (index < fundos.length) {
    // IMPORTANTE: Remover barras invertidas do Windows
    const imgPath = fundos[index].replace(/\\/g, '/');
    console.log(`Tentando carregar imagem: ${imgPath} (pergunta ${index + 1})`);
    
    // Tenta carregar a imagem
    const img = new Image();
    
    img.onload = function() {
      // Aplica a imagem como fundo
      document.body.style.backgroundImage = `url('${imgPath}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      console.log(`✓ Imagem carregada: ${imgPath}`);
    };
    
    img.onerror = function() {
      console.error(`✗ ERRO: Não foi possível carregar a imagem: ${imgPath}`);
      console.log('Verifique:');
      console.log('1. O arquivo existe na pasta "imagem/fotos/" ?');
      console.log('2. O nome está correto?');
      console.log('3. A extensão (.jpg/.png) está correta?');
      console.log('4. O arquivo está na mesma pasta que o index.html?');
      console.log(`   Caminho completo: ${window.location.origin}/${imgPath}`);
      
      // Tenta usar uma imagem alternativa ou placeholder
      usarImagemAlternativa(index);
    };
    
    img.src = imgPath;
  } else {
    console.warn(`Índice ${index} fora do range. Usando cor padrão.`);
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#131921';
  }
}

// Função para tentar imagem alternativa se a principal falhar
function usarImagemAlternativa(index) {
  console.log('Tentando imagens alternativas...');
  
  // Primeiro tenta carregar imagens locais com nomes alternativos
  const alternativasLocais = [
    `img${index + 1}.jpg`,
    `img${index + 1}.png`,
    `imagem${index + 1}.jpg`,
    `foto${index + 1}.jpg`
  ];
  
  // Função para testar cada alternativa local
  function tentarProximaAlternativa(i) {
    if (i >= alternativasLocais.length) {
      // Se nenhuma alternativa local funcionar, usa placeholder
      usarPlaceholderOnline(index);
      return;
    }
    
    const altPath = alternativasLocais[i];
    const imgAlt = new Image();
    
    imgAlt.onload = function() {
      document.body.style.backgroundImage = `url('${altPath}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      console.log(`✓ Usando alternativa local: ${altPath}`);
    };
    
    imgAlt.onerror = function() {
      console.log(`✗ Alternativa local falhou: ${altPath}`);
      tentarProximaAlternativa(i + 1);
    };
    
    imgAlt.src = altPath;
  }
  
  // Começa testando alternativas locais
  tentarProximaAlternativa(0);
}

// Função para usar placeholder online como último recurso
function usarPlaceholderOnline(index) {
  const placeholders = [
    `https://via.placeholder.com/1200x600/131921/FF9900?text=Amazon+Quiz+Pergunta+${index + 1}`,
    `https://via.placeholder.com/1200x600/232F3E/FFFFFF?text=Pergunta+${index + 1}`,
    `https://via.placeholder.com/1200x600/37475A/FF9900?text=Quiz+Amazon`
  ];
  
  const placeholderIndex = index % placeholders.length;
  const placeholderUrl = placeholders[placeholderIndex];
  
  const imgPlaceholder = new Image();
  
  imgPlaceholder.onload = function() {
    document.body.style.backgroundImage = `url('${placeholderUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    console.log(`Usando placeholder online para pergunta ${index + 1}`);
  };
  
  imgPlaceholder.onerror = function() {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#131921';
    console.log('Usando cor sólida como fallback final');
  };
  
  imgPlaceholder.src = placeholderUrl;
}

// ============================================
// CÓDIGO PRINCIPAL DO QUIZ (MANTIDO)
// ============================================

// Event listener para validar input do nome
playerInput.addEventListener('input', function() {
  const name = this.value.trim();
  
  if (name.length > 0) {
    startBtn.disabled = false;
    errorMessage.textContent = '';
  } else {
    startBtn.disabled = true;
    errorMessage.textContent = '';
  }
});

// Função para tocar sons de feedback
function playSound(type) {
  try {
    if (type === 'correct') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
      return;
    } else if (type === 'wrong') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 400;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 300);
      return;
    }
  } catch (e) {
    console.log("Áudio não suportado:", e);
  }
}

// Handler para botão Começar
startBtn.onclick = () => {
  const name = playerInput.value.trim();
  
  if (name.length === 0) {
    errorMessage.textContent = 'Por favor, digite seu nome';
    return;
  }
  
  playSound('correct');
  playerName = name;
  playerEl.textContent = `Jogador: ${playerName}`;
  startOverlay.style.display = "none";
  initQuiz();
};

// Handler para botão Anônimo
startAnonBtn.onclick = () => {
  playSound('correct');
  playerName = "Anônimo";
  playerEl.textContent = `Jogador: ${playerName}`;
  startOverlay.style.display = "none";
  initQuiz();
};

// Função para inicializar o quiz
function initQuiz() {
  // Embaralha perguntas e opções
  questions = shuffleArray(QUESTIONS_MASTER).map(q => ({...q, options: shuffleArray(q.options)}));
  currentQuestionIndex = 0;
  totalPoints = 0;
  wrongAnswers = [];
  questionContainer.style.display = 'flex';

  // Define fundo inicial
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = '#131921';
  
  loadQuestion();
}

// Função para embaralhar array (Fisher-Yates)
function shuffleArray(arr) {
  const a = [...arr];
  
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  
  return a;
}

// Função para carregar uma pergunta
function loadQuestion() {
  // Troca o fundo PRIMEIRO
  trocarFundo();
  
  const q = questions[currentQuestionIndex];

  questionEl.textContent = q.question;
  resultEl.textContent = "";
  resultEl.style.color = '';

  optionsContainer.innerHTML = "";
  
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => {
      handleAnswer(opt, btn);
    };
    optionsContainer.appendChild(btn);
  });

  resetTimer();
  updateProgress();
}

// Atualiza barra de progresso
function updateProgress() {
  const total = questions.length;
  progressText.textContent = `Pergunta ${currentQuestionIndex+1} / ${total}`;
  progressBar.style.width = ((currentQuestionIndex)/total)*100 + "%";
}

// Processa resposta do usuário
function handleAnswer(selected, btn) {
  stopTimer();

  const q = questions[currentQuestionIndex];

  const buttons = optionsContainer.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if (selected === q.correctAnswer) {
    btn.classList.add("correct");
    resultEl.textContent = `Correto! +${q.points} pontos`;
    resultEl.style.color = 'var(--good)';
    totalPoints += q.points;
    pointsValue.textContent = totalPoints;
    playSound('correct');
  } else {
    btn.classList.add("incorrect");
    buttons.forEach(b => {
      if (b.textContent === q.correctAnswer) b.classList.add("correct");
    });
    resultEl.textContent = `Incorreto! A resposta correta era: ${q.correctAnswer}`;
    resultEl.style.color = 'var(--bad)';
    playSound('wrong');
    
    wrongAnswers.push({
      question: q.question,
      userAnswer: selected,
      correctAnswer: q.correctAnswer,
      questionNumber: currentQuestionIndex + 1
    });
  }

  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

// Avança para próxima pergunta
function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= questions.length) {
    finishQuiz();
    return;
  }
  
  loadQuestion();
}

// Reinicia o timer
function resetTimer() {
  stopTimer();
  timeLeft = TIME_PER_QUESTION;
  timeText.textContent = timeLeft + "s";
  timerBar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft + "s";
    timerBar.style.width = (timeLeft / TIME_PER_QUESTION) * 100 + "%";

    if (timeLeft <= 0) {
      stopTimer();
      resultEl.textContent = "Tempo esgotado!";
      resultEl.style.color = 'var(--bad)';
      playSound('wrong');
      
      const q = questions[currentQuestionIndex];
      
      optionsContainer.querySelectorAll("button").forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.correctAnswer) btn.classList.add("correct");
      });
      
      wrongAnswers.push({
        question: q.question,
        userAnswer: "Tempo esgotado",
        correctAnswer: q.correctAnswer,
        questionNumber: currentQuestionIndex + 1
      });
      
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }, 1000);
}

// Para o timer
function stopTimer() {
  if (timer) clearInterval(timer);
}

// Mostra tela final
function finishQuiz() {
  const totalQuestions = questions.length;
  const correctAnswers = totalQuestions - wrongAnswers.length;
  const scorePercentage = Math.round((totalPoints / (totalQuestions * 10)) * 100);
  const isPerfectScore = wrongAnswers.length === 0;
  
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
  
  if (isPerfectScore) {
    finalContent += `
      <div class="perfect-score">
        <h3>Pontuação Perfeita!</h3>
        <p>Excelente trabalho! Você demonstrou um conhecimento excepcional sobre a Amazon acertando todas as questões!</p>
      </div>
    `;
  }
  
  if (wrongAnswers.length > 0) {
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
  
  questionContainer.innerHTML = finalContent;
  questionContainer.style.display = 'block';
  
  // Resetar fundo para cor sólida na tela final
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = '#131921';
  
  const restartBtn = questionContainer.querySelector('.restart-btn');
  restartBtn.onclick = () => location.reload();
}

// ============================================
// INICIALIZAÇÃO
// ============================================

// Quando a página carrega
window.addEventListener('DOMContentLoaded', function() {
  console.log("===================================");
  console.log("QUIZ AMAZON - VERSÃO OFFLINE");
  console.log("===================================");
  console.log("Configuração de imagens:");
  console.log(`- Total de imagens configuradas: ${fundos.length}`);
  console.log(`- Total de perguntas: ${QUESTIONS_MASTER.length}`);
  console.log("");
  console.log("ESTRUTURA DE PASTAS NECESSÁRIA:");
  console.log("pasta-do-projeto/");
  console.log("├── index.html");
  console.log("├── style.css");
  console.log("├── script.js");
  console.log("└── imagem/");
  console.log("    └── fotos/");
  console.log("        ├── img1.png");
  console.log("        ├── img2.jpg");
  console.log("        ├── img3.jpg");
  console.log("        ├── img4.jpg");
  console.log("        ├── img5.jpg");
  console.log("        ├── img6.jpg");
  console.log("        ├── img7.jpg");
  console.log("        ├── img8.jpg");
  console.log("        ├── img9.jpg");
  console.log("        └── img10.jpg");
  console.log("===================================");
  
  // Verifica se tem imagens locais
  verificarImagensLocais();
});

// Função para verificar imagens locais
function verificarImagensLocais() {
  console.log("Verificando imagens locais...");
  
  let encontradas = 0;
  
  fundos.forEach((imgSrc, index) => {
    // Corrige caminhos para formato web
    const imgPath = imgSrc.replace(/\\/g, '/');
    
    const img = new Image();
    
    img.onload = function() {
      encontradas++;
      console.log(`✓ ${imgPath} - OK`);
      
      if (encontradas === fundos.length) {
        console.log("✅ Todas as imagens locais foram encontradas!");
      }
    };
    
    img.onerror = function() {
      console.warn(`⚠ ${imgPath} - NÃO ENCONTRADA`);
      console.log(`   Verifique se o arquivo existe na pasta "imagem/fotos/"`);
    };
    
    img.src = imgPath;
  });
}