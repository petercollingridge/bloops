var Food = function(position, energy) {
    this.position = position;
    this.energy = energy;
};


var Creature = function(position, energy, genome) {
    this.position = position;
    this.energy = energy;
    this.genome = genome;
};

Creature.prototype.update = function() {
};


var World = {
    // Default values
    width: 100,
    height: 100,
    foodEnergy: 100,

    creatures: [],
    food: [],

    init: function(params) {
        for (var param in params) {
            this[param] = params[param];
        }
    },

    addFood: function(n) {
        n = n || 1;
        for (var i = 0; i < n; i++) {
            var newFood = new Food(this.getRandomPosition(), this.foodEnergy);
            this.food.push(newFood);
        }
    },

    addCreature: function() {

    },

    getRandomPosition: function() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
        };
    },

    update: function() {
        for (var i = 0; i < this.creatures.length; i++) {
            this.creatures[i].update();
        }
    }
};

// Example
World.init({
    width: 400,
    height: 400,
});

World.addFood(100);

console.log(World.food)