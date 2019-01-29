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
    this.angle = Math.PI * Math.random();
};

Bloop.prototype.update = function(world) {
    this.energy -= 0.2;
    this.eat(world.food);
    this.move(world);
};

Bloop.prototype.move = function(world) {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);

    // Wrap around world
    if (this.x > world.width) { this.x -= world.width; }
    else if (this.x < 0) { this.x += world.width; }
    if (this.y > world.height) { this.y -= world.height; }
    else if (this.y < 0) { this.y += world.height; }

    if (Math.random() < 0.05) {
        this.angle += (Math.random() - 0.5);
    }
};

Bloop.prototype.eat = function(food) {
    for (var i = 0; i < food.length; i++) {
        if (collide(this, food[i])) {
            this.energy += food[i].energy;
            food.splice(i, 1);
            break;
        }
    }
};

function collide(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy <= (a.r + b.r) * (a.r + b.r);
}

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
            this.creatures[i].update(this);
        }
    },

    setTimeout: function() {
        this.update();
        this.animation = setTimeout(this.setTimeout.bind(this), 20);
    },

    run: function() {
        if (!this.animation) {
            this.setTimeout();
        }
    },

    stop: function() {
        clearTimeout(this.animation);
        this.animation = false;
    },
};
