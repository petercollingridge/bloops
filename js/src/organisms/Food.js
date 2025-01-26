// require ./Organism.js

// Food is an organism whose genome determines its size.
class Food extends Organism {
    constructor(position, energy, genome) {
        super(position, energy, genome);
    }
    calculatePhenotype() {
        this.r = this.genome;
    }
    getColour() {
        return 'rgb(40, 120, 10)';
    }
}
