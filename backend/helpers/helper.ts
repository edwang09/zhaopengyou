export function newDeck(): string[] {
  const suits = ["h", "s", "c", "d"];
  const ranks = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];
  const deck = ranks.reduce(
    (acc, curr) => {
      const current = suits.map((s) => s + curr);
      return [...acc, ...current];
    },
    ["j0", "j1"]
  );
  return shuffle([...deck, ...deck, ...deck, ...deck]);
}
export function shuffle(array: string[]): string[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
