// Bloop4 is a Bloop with genes controlling its size and metabolism
// Its radius is the square root of its size.
// The higher its metabolism, the faster it moves and the more energy it uses each turn.
// Genes mutate when Bloop4s reproduce getting +1 or -1 50% of the time.

// require ./Bloop.js

const Bloop4 = function(position, energy, genome, id) {
    Bloop.call(this, position, energy, genome, id);
    this.childType = Bloop4;
};
Bloop4.prototype = Object.create(Bloop.prototype);

Bloop4.prototype.calculatePhenotype = function() {
    this.r = Math.sqrt(this.genome[0]);
    const energyForSpeed = this.genome[1] * 0.02;
    this.metabolism = energyForSpeed + 0.02;
    this.speed = (101 - this.genome[0]) * energyForSpeed * 0.005;
    // this.reproductionThreshold = 200 + this.genome[2] * 25;
    this.angle = Math.PI * Math.random();
};

Bloop4.prototype.getChildGenome = function() {
    const childGenome = this.genome.map(gene => mutate(gene));
    return childGenome;
};

Bloop4.getRandomGenome = function() {
    return [50, 50, 50];
    return [
        randomInRange(1, 100),  // Size
        randomInRange(1, 100),  // Metabolism
        randomInRange(1, 100),  // Energy for reproduction
    ];
};
