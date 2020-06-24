// Generic organism.
// Has a position and energy.
// Any other properties are part of its genome
const Organism = function(position, energy, genome) {
    this.x = position.x;
    this.y = position.y;
    this.energy = energy;
    this.genome = genome;
    this.calculatePhenotype();
};
Organism.prototype.calculatePhenotype = function() {};


// Food is an organism whose genome determines its size.
const Food = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Food.prototype = Object.create(Organism.prototype);

Food.prototype.calculatePhenotype = function() {
    this.r = this.genome;
};


// Bloops have a speed and a size.
const Bloop = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Bloop.prototype = Object.create(Organism.prototype);

Bloop.prototype.calculatePhenotype = function() {
    this.r = this.genome;
    this.speed = 0.2;
    this.angle = Math.PI * Math.random();
    this.metabolism = 0.2;
};

Bloop.prototype.update = function(world) {
    this.energy -= this.metabolism;
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
    for (let i = 0; i < food.length; i++) {
        if (collide(this, food[i])) {
            this.energy += food[i].energy;
            food.splice(i, 1);
            break;
        }
    }
};
