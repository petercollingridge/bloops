// Generic organism.
// Has a position and energy.
// Any other properties are part of its genome

// require ../helpers/display.js
// require ./utils.js

const Organism = function(position, energy, genome) {
    this.age = 0;
    this.x = position.x;
    this.y = position.y;
    this.energy = energy;
    this.genome = genome;
    this.calculatePhenotype();
};

// To be overridden
Organism.prototype.calculatePhenotype = function() {};

// To be overridden
Organism.prototype.getChildGenome = function() {
    return this.genome;
};

// Draw organisms as a circle
Organism.prototype.display = function(ctx) {
    ctx.fillStyle = this.getColour();
    drawCircle(ctx, this);
};

Organism.prototype.getColour = function() {
    return 'rgb(50, 60, 210, 160)';
};
