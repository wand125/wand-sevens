const actuate = (game) => {
  if (game==null) { game = state.game; }
  game.board.forEach((card,i) => {
    const row = i / rankSize | 0;
    const col = i % rankSize;
    if (card === -1) {
      const cardImg = document.querySelector(`.board-card-${row}-${col} img`);
      cardImg.removeAttribute('src');
    }
    else {
      const cardImg = document.querySelector(`.board-card-${row}-${col} img`);
      cardImg.src = img[card].src;
    }
  });

  Array.from(document.querySelectorAll('.own-card img')).filter((e,i) => i >= ownHand().length).forEach((e) => e.removeAttribute('src'));
  ownHand().forEach((card,i) => {
    const row = i / rankSize | 0;
    const col = i % rankSize;
    const cardImg = document.querySelector(`.own-card-${row}-${col} img`);
    cardImg.src = img[card].src;
  });

  Array.from(document.querySelectorAll('.opponent-card img')).filter((e,i) => i >= opponentHand().length).forEach((e) => e.removeAttribute('src'));
  opponentHand().forEach((card,i) => {
    const row = i / rankSize | 0;
    const col = i % rankSize;
    const cardImg = document.querySelector(`.opponent-card-${row}-${col} img`);
    cardImg.src = img[card].src;
  });

  document.querySelectorAll('.all-card').forEach((obj,i)=> {
    if (ownHand().indexOf(i) !== - 1) {
      obj.classList.add('is-own-card');
    }
    else {
      obj.classList.remove('is-own-card');
    }
    if (opponentHand().indexOf(i) !== - 1) {
      obj.classList.add('is-opponent-card');
    }
    else {
      obj.classList.remove('is-opponent-card');
    }
    if (state.game.board.indexOf(i) !== - 1) {
      obj.classList.add('is-board-card');
    }
    else {
      obj.classList.remove('is-board-card');
    }
  });

  const stateMessages = {
    'win': 'あなたの勝ちです',
    'lose': 'あなたの負けです',
    'draw': '引き分けです',
    'own-turn': 'あなたの番です',
    'opponent-turn': '相手の番です',
  };

  let stateKey = getStateKey();
  document.querySelector('#state-message').innerHTML = 
    stateMessages[stateKey];
  actuateTime();
}

const getStateKey = () => {
  let stateKey = '';
  const game = state.game;
  if (game.state === 'start') {
    stateKey = isOwnTurn() ? 'own-turn' : 'opponent-turn';
  }
  else {
    if (game.state == 'host-win') {
      stateKey = isHost() ? 'win' : 'lose';
    }
    else if (game.state == 'host-lose') {
      stateKey = !isHost() ? 'win' : 'lose';
    }
    else {
      stateKey = 'draw';
    }
  }
  return stateKey;
}

const actuateTime = () => {
  let stateKey = getStateKey();
  document.querySelector('#time-message').innerHTML = stateKey === 'own-turn' ? `残り時間は${state.local.remainTime}秒です`: '';
}

const initHtml = () => {
  let boardHtml = '';
  let allCardHtml = '';
  for (i = 0; i < suitSize; ++i) {
    for (j = 0; j < rankSize; ++j) {
      const id = i * rankSize + j;
      boardHtml += `<div class='board-card-${i}-${j}' onClick='onBoardSelected(${i*rankSize+j});'><img></div>`
      allCardHtml += `<div class='all-card all-card-${i}-${j}'><img></div>`
    }
  }

  let ownCardHtml = '';
  let opponentCardHtml = '';
  for (i = 0; i < 2; ++i) {
    for (j = 0; j < rankSize; ++j) {
      const id = i * rankSize + j;
      ownCardHtml += `<div class='own-card own-card-${i}-${j}' onClick='onHandSelected(${i*rankSize+j});'><img></div>`
      opponentCardHtml += `<div class='opponent-card opponent-card-${i}-${j}'><img></div>`
    }
  }
 
  const boardContainer = document.querySelector('#board-container');
  boardContainer.innerHTML = boardHtml;

  const allCardContainer = document.querySelector('#all-card-container');
  allCardContainer.innerHTML = allCardHtml;
  const cardImg = document.querySelectorAll(`.all-card img`).forEach((e,i) => e.src = img[i].src);

  const ownCardContainer = document.querySelector('#own-card-container');
  ownCardContainer.innerHTML = ownCardHtml;

  const opponentCardContainer = document.querySelector('#opponent-card-container');
  opponentCardContainer.innerHTML = opponentCardHtml;
}
