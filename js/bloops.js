// Generic organism.
// Has a position and energy.
// Any other properties are part of its genome
var Organism = function(position, energy, genome) {
    this.x = position.x;
    this.y = position.y;
    this.energy = energy;
    this.genome = genome;
    this.calculatePhenotype();
};
Organism.prototype.calculatePhenotype = function() {};


// Food is an organism whose genome determines its size.
var Food = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Food.prototype = Object.create(Organism.prototype);

Food.prototype.calculatePhenotype = function() {
    this.r = this.genome;
};


// Bloops have a speed and a size.
// 
var Bloop = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Bloop.prototype = Object.create(Organism.prototype);

Bloop.prototype.calculatePhenotype = function() {
    this.r = this.genome;
    this.speed = (50 - this.r) * 0.01;
    console.log(this.r)
    console.log(this.genome)
};


var World = {
    food: [],
    creatures: [],

    // Default values
    width: 100,
    height: 100,

    foodR: 2,
    foodEnergy: 100,
    foodGrowthRate: 0.1,

    creatureType: Bloop,
    creatureR: 5,
    creatureEnergy: 100,

    init: function(params) {
        // Overwrite default values
        for (var param in params) {
            this[param] = params[param];
        }
    },

    addFood: function(n) {
        n = n || 1;

        for (var i = 0; i < n; i++) {
            var newFood = new Food(this.getRandomPosition(), this.foodEnergy, this.foodR);
            this.food.push(newFood);
        }
    },

    addCreature: function(genome, position) {
        position = position || this.getRandomPosition();
        var newCreature = new this.creatureType(position, this.creatureEnergy, genome);
        this.creatures.push(newCreature);
    },

    getRandomPosition: function() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
        };
    },

    update: function() {
        // Grow food
        while (Math.random() < this.foodGrowthRate) {
            this.addFood();
        }

        // Update creatures
        for (var i = 0; i < this.creatures.length; i++) {
            this.creatures[i].update();
        }
    }
};
