const suitName = ['spade', 'heart', 'diamond', 'club'];
const toRankName = (i) => ('0' + (i+1)).slice(-2);

const idToName = (i) => {
  const suit = i / rankSize | 0;
  const rank = i % rankSize;
  return `card_${suitName[suit]}_${toRankName(rank)}.png`;
}

const img = [];
for (let i = 0; i < cardSize; ++i) {
  img[i] = new Image();
  img[i].src=`./resources/${idToName(i)}`;
}
