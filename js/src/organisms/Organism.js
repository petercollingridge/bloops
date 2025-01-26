// Generic organism.
// Has a position and energy.
// Any other properties are part of its genome

// require ../helpers/display.js
// require ./utils.js

class Organism {
    constructor(position, energy, genome) {
        this.age = 0;
        this.x = position.x;
        this.y = position.y;
        this.energy = energy;
        this.genome = genome;
        this.calculatePhenotype();
    }

    // To be overridden
    calculatePhenotype() { }

    // To be overridden
    getChildGenome() {
        return this.genome;
    }

    // Draw organisms as a circle
    display(ctx) {
        ctx.fillStyle = this.getColour();
        drawCircle(ctx, this);
    }

    getColour() {
        return 'rgb(50, 60, 210, 160)';
    }
}
