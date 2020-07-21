// require ./Organism.js

// Food is an organism whose genome determines its size.
const Food = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Food.prototype = Object.create(Organism.prototype);

Food.prototype.calculatePhenotype = function() {
    this.r = this.genome;
};

Food.prototype.getColour = function() {
    return 'rgb(40, 120, 10)';
}
