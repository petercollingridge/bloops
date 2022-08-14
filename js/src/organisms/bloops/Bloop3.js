// Bloop3 is like a Bloop except it has a gene controlling its size
// Its radius is the square root of its size.
// Size mutates when Bloop2s reproduce getting +1 or -1 50% of the time.

// require ./Bloop.js

const Bloop3 = function(position, energy, genome) {
    Bloop.call(this, position, energy, genome);
    this.childType = Bloop3;
};
Bloop3.prototype = Object.create(Bloop.prototype);

Bloop3.prototype.calculatePhenotype = function() {
    this.r = Math.sqrt(this.genome);
    this.speed = (101 - this.genome) * 0.005;
    this.angle = Math.PI * Math.random();
};

Bloop3.prototype.getChildGenome = function() {
    const mutation = Math.random();
    if (mutation < 0.25 && this.genome < 100) {
        return this.genome + 1;
    } else if (mutation < 0.50 && this.genome > 1) {
        return this.genome - 1;
    }
    return this.genome;
};
