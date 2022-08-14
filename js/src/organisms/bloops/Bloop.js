// These bloops have a speed and a size which is not genetically controlled
// They reproduce by splitting in half, giving each cell half the energy.
// There are no genes or mutations

// require ../Organism.js


const Bloop = function(position, energy, genome) {
    // Default values
    this.metabolism = 1;
    this.speed = 0.2;
    this.reproductionThreshold = 1000;

    Organism.call(this, position, energy, genome);
    this.childType = Bloop;
};
Bloop.prototype = Object.create(Organism.prototype);

Bloop.prototype.getColour = function() {
    // Colour based on energy/hunger
    const energy = Math.max(0, Math.min(1, this.energy / 500));
    const red = 255 * (1 - energy);
    const blue = 255 * energy;
    return `rgba(${red}, 60, ${blue}, 160)`;
};

Bloop.prototype.calculatePhenotype = function() {
    this.r = this.genome;
    this.angle = Math.PI * Math.random();
};

Bloop.prototype.update = function(world) {
    this.age++;
    this.energy -= this.metabolism;
    this.eat(world.food);
    this.move(world);

    if (this.energy < 0) {
        this.dead = true;
        this.died = world.time;
    } else if (this.energy > this.reproductionThreshold) {
        this.reproduce(world);
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

Bloop.prototype.reproduce = function(world) {
    this.energy /= 2;
    const position = { x: this.x, y: this.y };
    const newGenome = this.getChildGenome();
    world.addCreature(this.energy, newGenome, position);
};

Bloop.prototype.info = function() {
  const info = {
    Id: this.id,
    Age: this.age,
    Energy: this.energy,
    Speed: this.speed,
    Metabolism: this.metabolism,
  };
  return Object.assign(info, this._extra_info())
};

Bloop.prototype._extra_info = function() {
  return {};
}
