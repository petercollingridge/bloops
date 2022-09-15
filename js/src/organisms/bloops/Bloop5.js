// Bloop4 is a Bloop with genes controlling its size, metabolism, and how much energy required to create a child
// Its radius is the square root of its size.
// The higher its metabolism, the faster it moves and the more energy it uses each turn.
// Genes mutate when Bloop5s reproduce getting +1 or -1 50% of the time.

// require ./Bloop.js

const Bloop5 = function(position, energy, genome) {
    Bloop.call(this, position, energy, genome);
    this.childType = Bloop5;
};
Bloop5.prototype = Object.create(Bloop.prototype);

Bloop5.prototype.calculatePhenotype = function() {
    this.r = Math.sqrt(this.genome[0]);
    const energyForSpeed = this.genome[1] * 0.02;
    this.metabolism = energyForSpeed + 0.02;
    this.speed = (101 - this.genome[0]) * energyForSpeed * 0.005;
    this.reproductionThreshold = 100 + this.genome[2] * 20;
    this.angle = Math.PI * Math.random();
};

Bloop5.prototype.getChildGenome = function() {
    const childGenome = this.genome.map(gene => mutate(gene));
    return childGenome;
};

Bloop5.prototype._extra_info = function() {
    return {
        Metabolism: this.metabolism,
        Size: this.genome[0],
        'Repro energy': this.reproductionThreshold,
    };
};

Bloop5.getRandomGenome = function() {
    return getRandomGenome(3);
};
