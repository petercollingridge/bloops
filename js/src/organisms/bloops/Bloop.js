// These bloops have a speed and a size which is not genetically controlled
// They reproduce by splitting in half, giving each cell half the energy.
// There are no genes or mutations

// require ../Organism.js


class Bloop extends Organism {
    constructor(position, energy, genome) {
        super(position, energy, genome);
        this.childType = Bloop;

        // Default values
        this.metabolism = this.metabolism || 1;
        this.reproductionThreshold = this.reproductionThreshold || 1000;
        this.speed = this.speed || 0.1;
        this.setAngle(Math.PI * Math.random());
    }
    getColour() {
        // Colour based on energy/hunger
        const energy = Math.max(0, Math.min(1, this.energy / 500));
        const red = 255 * (1 - energy);
        const blue = 255 * energy;
        return `rgba(${red}, 60, ${blue}, 160)`;
    }
    calculatePhenotype() {
        this.r = this.genome;

    }
    setAngle(angle) {
        this.angle = angle;
        this.dx = Math.cos(this.angle);
        this.dy = Math.sin(this.angle);
    }
    update(world) {
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
    }
    eat(food) {
        for (let i = 0; i < food.length; i++) {
            if (collide(this, food[i])) {
                this.energy += food[i].energy;
                food.splice(i, 1);
                break;
            }
        }
    }
    move(world) {
        this.x += this.speed * this.dx;
        this.y += this.speed * this.dy;

        // Wrap around world
        if (this.x > world.width) { this.x -= world.width; }
        else if (this.x < 0) { this.x += world.width; }
        if (this.y > world.height) { this.y -= world.height; }
        else if (this.y < 0) { this.y += world.height; }

        if (Math.random() < 0.05) {
            this.setAngle(this.angle + Math.random() - 0.5);
            this.dx = Math.cos(this.angle);
            this.dy = Math.sin(this.angle);
        }
    }
    reproduce(world) {
        this.energy /= 2;
        const position = { x: this.x, y: this.y };
        const newGenome = this.getChildGenome();
        world.addCreature(this.energy, newGenome, position);
    }
    info() {
        const info = {
            Id: this.id,
            Age: this.age,
            Energy: this.energy,
            Speed: this.speed,
            Metabolism: this.metabolism,
        };
        return Object.assign(info, this._extra_info());
    }
    _extra_info() {
        return {};
    }
}
