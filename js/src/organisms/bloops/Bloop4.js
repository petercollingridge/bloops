// Bloop3 is like a Bloop except it has a gene controlling its size
// Its radius is the square root of its size.
// Size mutates when Bloop2s reproduce getting +1 or -1 50% of the time.

// require ./Bloop.js

const Bloop4 = function(position, energy, genome) {
    Bloop.call(this, position, energy, genome);
    this.childType = Bloop4;
};
Bloop4.prototype = Object.create(Bloop.prototype);

Bloop4.prototype.calculatePhenotype = function() {
    this.r = Math.sqrt(this.genome[0]);
    this.metabolism = this.genome[1] * 0.02 + 0.02;
    this.speed = (101 - this.genome[0]) * (this.metabolism - 0.02) * 0.005;
    this.reproductionThreshold = 200 + this.genome[2] * 25;
    this.angle = Math.PI * Math.random();
};

Bloop4.prototype.getChildGenome = function() {
    return this.genome.map(mutate);
};

Bloop4.getRandomGenome = function() {
    return [
        randomInRange(1, 100),  // Size
        randomInRange(1, 100),  // Metabolism
        randomInRange(1, 100),  // Energy for reproduction
    ];
};
