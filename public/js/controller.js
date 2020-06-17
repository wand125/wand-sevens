const boardReset = () => {
  state.local.boardSelected = -1;
  state.local.neighborCard = -1;
  ownHand().forEach((e,i) => {
    const row = i / rankSize | 0;
    const col = i % rankSize;
    const obj = document.querySelector(`.own-card-${row}-${col}`);
    obj.classList.remove('disable');
  });
}

const onBoardSelected = (i) => {
  if (!isOwnTurn()) { return; }
  const game = state.game;
  if (game.state !== 'start') { return; }
  if (!checkPutCount()) { return; }
  console.log('board selected',i);
  if (game.board[i] !== -1) { 
    if (state.local.boardSelected != -1) {
      boardReset();
      actuate();
    }
    return;
  }
  let neighborCard = -1;
  if (i % rankSize > 0 && game.board[i - 1] !== -1) {
    neighborCard = game.board[i-1];
  }
  if (i % rankSize < rankSize - 1 && game.board[i + 1] !== -1) {
    neighborCard = game.board[i+1];
  }
  if (neighborCard === -1) { return; }
  console.log(neighborCard);
  state.local.boardSelected = i;
  state.local.neighborCard = neighborCard;
  ownHand().forEach((e,i) => {
    const row = i / rankSize | 0;
    const col = i % rankSize;
    const obj = document.querySelector(`.own-card-${row}-${col}`);
    console.log(row, col, neighborCard, e, canPut(neighborCard, e));
    if (!canPut(neighborCard, e)) {
      obj.classList.add('disable');
    }
    else {
      obj.classList.remove('disable');
    }
  });
}
const onHandSelected = (i) => {
  if (!isOwnTurn()) { return; }
  const game = state.game;
  if (game.state !== 'start') { return; }
  if (!checkPutCount()) { return; }
  const card = ownHand()[i];
  if (card == null) { return; }
  if (state.local.neighborCard === -1) {
    return;
  }
  if (canPut(state.local.neighborCard, card)) {
    state.game[isHost()?'hostHand':'clientHand'] = ownHand().filter((e) => e != card);
    state.game.board[state.local.boardSelected] = card;
    ++state.local.putCount;
    boardReset();
    if (ownHand().length == 0) {
      state.game.state = isHost() ? 'host-win' : 'host-lose';
    }
    actuate();
  }

  if (!checkPutCount()) {
    onNext();
  }
  else {
    const db = firebase.firestore();
    db.collection("game").doc('room1').set(game);
  }
  console.log('hand selected',i);
}
const onNext = () => {
  if (!isOwnTurn()) { return; }
  const game = state.game;
  // if (game.state !== 'start') { return; }
  if (game.prevCount === 0 && state.local.putCount === 0) {
    if (game.hostHand.length < game.clientHand.length) { game.state = 'host-win'; }
    else if (game.hostHand.length > game.clientHand.length) { game.state = 'host-lose'; }
    else { game.state = 'draw'; }
  }
  game.prevCount = state.local.putCount;
  ++game.turn;
  const db = firebase.firestore();
  db.collection("game").doc('room1').set(game)
    .then(function(docRef) {
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  boardReset();
}
const onReset = () => {
  console.log(firebase);
  const db = firebase.firestore();
  const deck = initDeck();
  console.log(deck, deck.length);
  const hostHand = deck.filter((e,i) => i < 2 * (rankSize - 1)).sort((a,b) => a-b);
  const clientHand = deck.filter((e,i) => i >= (2 * (rankSize - 1))).sort((a,b) => a-b);
  const board = initBoard();
  boardReset();
  console.log(state);
  const game = {
    state: 'start',
    hostFirst: (Math.random() * 2 | 0) === 0,
    hostId: state.user.uid,
    board,
    hostHand,
    clientHand,
    prevCount: -1,
    turn: 0,
  };
  state.game = game;
  if (isOwnTurn()) { initTurn(); }
  actuate(game);
  db.collection("game").doc('room1').set(game)
    .then(function(docRef) {
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}
window.onload = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      state.user = user;
      initHtml();
      const db = firebase.firestore();
      db.collection('game').doc('room1')
        .onSnapshot((doc) => {
          const game = doc.data();
          if (state.game == null) {
            state.game = game;
            initTurn();
            initLocalData();
          }
          else {
            const isTurnStart = state.game.turn !== game.turn;
            state.game = game;
            if (isTurnStart) { initTurn(); }
          }
          actuate(game);
        });
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });
  initHtml();
}
