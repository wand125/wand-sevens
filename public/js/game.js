const suitSize = 4;
const rankSize = 5;
const cardSize = suitSize * rankSize;
const state = {};

const shuffle = (array) => {
  for(var i = array.length - 1; i > 0; i--){
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

const initDeck = () => {
  const deck = [...Array(cardSize)]
    .map((_, i) => i)
    .filter((e,i) => e % rankSize !== (rankSize - 1) / 2);
  return shuffle(deck);
}

const initBoard = () => {
  const deck = [...Array(cardSize)].map((_, i) => -1);
  for (let i = 0; i < suitSize; ++i) {
    deck[i * rankSize + (rankSize - 1) / 2 ] = 
      i * rankSize + (rankSize - 1) / 2;
  }
  return deck;
}

const isHost = () => {
  return state.game.hostId === state.user.uid;
}

const isOwnTurn = () => {
  const game = state.game;
  return ((game.turn % 2 === 0 ? 1 : 0)
    + (game.hostFirst ? 1 : 0)
    + (isHost() ? 1 : 0)) % 2 === 1;
}

const checkPutCount = () => {
  if (state.game.turn == 0 && state.local.putCount >= 1) { return false; }
  if (state.local.putCount >= 2) { return false; }
  return true;
}
const canPut = (neighbor, c) => {
  return ((neighbor / rankSize | 0) * rankSize <= c
  && c < (neighbor / rankSize | 0) * (rankSize) + rankSize)
  || (neighbor % rankSize === c % rankSize);
}

const initTurn = () => {
  state.local = { putCount: 0, remainTime: 60, neighborCard: -1, boardSelected: -1 };
}

const initLocalData = () => {
  const timer = window.setInterval(timerUpdate, 1000);
}

const ownHand = () => isHost() ? state.game.hostHand : state.game.clientHand;
const opponentHand = () => isHost() ? state.game.clientHand : state.game.hostHand;
