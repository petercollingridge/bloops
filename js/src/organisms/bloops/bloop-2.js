// require ./bloop-1.js

Bloop.prototype.calculatePhenotype = function() {
    this.r = Math.sqrt(this.genome);
    this.speed = 0.2;
    this.angle = Math.PI * Math.random();
    this.metabolism = 1;
};

Bloop.prototype.getChildGenome = function() {
    const mutation = Math.random();
    if (mutation < 0.25 && this.genome > 1) {
        return this.genome - 1;
    } else if (mutation > 0.75) {
        return this.genome + 1;
    }
    return this.genome;
};
