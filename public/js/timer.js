const timerUpdate = () => {
  if (!isOwnTurn()) { return; }
  const game = state.game;
  if (game.state !== 'start') { return; }
  --state.local.remainTime;
  actuateTime();
  if (state.local.remainTime <= 0) { onNext(); }
}

