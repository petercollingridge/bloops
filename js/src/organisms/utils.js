function collide(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy <= (a.r + b.r) * (a.r + b.r);
}

function randomInRange(a, b) {
    if (!b) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a));
}

// Get a random array of n genes
// Each gene is an integer between <min> and <max>
function getRandomGenome(n, min = 1, max = 100) {
  const genome = [];
  while(n-- > 0) {
    genome.push(randomInRange(min, max));
  }
  return genome;
}

// Given value, within a range of min - max,
// leave it unchanged (p = 0.5)
// change its value by +1 or -1 (p = 0.49)
// or pick a new value at random  (p = 0.01)
function mutate(value, min = 1, max = 100) {
    const mutation = Math.random();
    if (mutation < 0.01) {
        return randomInRange(min, max);
    } else if (mutation < 0.5) {
        const r = Math.random();
        if (r < 0.5 && value < max) {
            return value + 1;
        } else if (value > min) {
            return value - 1;
        }
    }
    return value;
}
