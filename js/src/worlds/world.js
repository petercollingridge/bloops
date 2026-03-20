// Basic world with food randomly appearing

// require ../simulations/simulation.js
// require ../organisms/bloops/Bloop.js
// require ./utils.js

class World {
    constructor(params) {
        this.width = params.width || WORLD_DEFAULTS.width;
        this.height = params.height || WORLD_DEFAULTS.height;

        this.creatureId = 0;
        this.time = 0;
        
        // Populate world with initial food
        this.food = [];
        this.foodProps = Object.assign(FOOD_DEFAULTS, params.food || {});
        this._addFood();
        
        // Populate world with initial creatures
        this.creatures = [];
        this.creatureProps = Object.assign(BLOOP_DEFAULTS, params.creatures || {});
        this._addCreatures();
    }

    update() {
        this.time++;
        this.growFood();
        this._detectBloopCollisions();
        updateObjects(this.creatures, this);
        this.removeDeadCreatures();
    }

    // Functions called during world.update
    growFood() {
        while (Math.random() < this.foodGrowthRate) {
            this._addFood();
        }
    }

    _detectBloopCollisions() {
        const n = this.creatures.length;

        for (let i = 0; i < n; i++) {
            this.creatures[i].hitBloops = [];
        }

        // Create empty arrays on each bloop for each other bloop they collide with
        for (let i = 0; i < n - 1; i++) {
            const thisCreature = this.creatures[i];
            for (let j = i + 1; j < n; j++) {
                if (collide(thisCreature, this.creatures[j])) {
                    thisCreature.hitBloops.push(this.creatures[j]);
                    this.creatures[j].hitBloops.push(thisCreature);
                }
            }
        }
    }

    removeDeadCreatures() {
        for (let i = this.creatures.length; i--;) {
            if (this.creatures[i].dead) {
                this.creatures.splice(i, 1);
            }
        }
    }

    _addFood() {
        for (let i = 0; i < this.foodProps.initialCount; i++) {
            const position = getRandomPositionUniform(this);
            const newFood = new Food(position, this.foodProps.energy, this.foodProps.r);
            this.food.push(newFood);
        }
    }

    _addCreatures() {
        this.addCreatures(this.creatureProps.initialCount, this.creatureProps.energy);
    }

    // Add n randomly-positioned created with the same energy level
    addCreatures(n, energy) {
        for (let i = 0; i < n; i++) {
            this.addCreature(energy);
        }
    }

    addCreature(energy, genome, position) {
        position = position || getRandomPositionUniform(this);
        const creatureType = this.creatureProps.type;
        const newCreature = new creatureType(position, energy, genome, this.creatureProps);
        this.creatures.push(newCreature);
    
        // Save some additional data about the creature
        newCreature.id = this.creatureId++;
        newCreature.born = this.time;

        if (this.creatureRecorder) {
            this.creatureRecorder.record(newCreature);
        }

        return newCreature;
    }

    display(ctx) {
        displayObjects(this.food, ctx);
        displayObjects(this.creatures, ctx);
    }

    // Detect if there is a creature at a coordinate
    // Used to select a creature
    findCreatureAtCoord(x, y) {
        let selectedCreature;
  
        for (let i = 0; i < this.creatures.length; i++) {
            const creature = this.creatures[i];
            const dx = creature.x - x;
            const dy = creature.y - y;
            const r = creature.r;
            if (dx * dx + dy * dy < r * r) {
                selectedCreature = creature;
                break;
            }
        }
  
        return selectedCreature;
    }
}
