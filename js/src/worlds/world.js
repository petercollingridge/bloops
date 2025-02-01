// Basic world with food randomly appearing

// require ../simulations/simulation.js
// require ../organisms/bloops/Bloop.js
// require ./utils.js

const DEFAULT_PARAMS = {
    width: 600,
    height: 400,
    foodR: 1,
    foodEnergy: 500,
    foodGrowthRate: 0.1,
    initialFoodNum: 200,
    creatureR: 3,
    creatureType: Bloop,
    creatureEnergy: 500,
    initialCreatureNum: 10,
};

class World {
    constructor(params) {
        // Assign each key-value pair from params to the class instance
        const allParams = Object.assign(DEFAULT_PARAMS, params);

        for (const [key, value] of Object.entries(allParams)) {
            this[key] = value;
        }

        this.creatureId = 0;
        this.time = 0;
        this.food = [];
        this.creatures = []
        this.getGenome = this.getGenome || (() => this.creatureR);

        // Populate world with initial food and creatures
        this._addFood(this.initialFoodNum);
        this.addCreatures(this.initialCreatureNum, this.creatureEnergy);
    }

    update() {
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
                    thisCreature.hitBloops.append(this.creatures[j]);
                    this.creatures[j].hitBloops.append(thisCreature);
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

    _addFood(n = 1) {
        for (let i = 0; i < n; i++) {
            const position = getRandomPositionUniform(this);
            const newFood = new Food(position, this.foodEnergy, this.foodR);
            this.food.push(newFood);
        }
    }

    addCreature(energy, genome, position) {
        position = position || getRandomPositionUniform(this);
        const newCreature = new this.creatureType(position, energy, genome);
        this.creatures.push(newCreature);
    
        // Save some additional data about the creature
        newCreature.id = this.creatureId++;
        newCreature.born = this.time;

        if (this.creatureRecorder) {
            this.creatureRecorder.record(newCreature);
        }
    }

    // Add n randomly-positioned created with the same energy level
    addCreatures(n, energy) {
        const getGenome = this.creatureType.getRandomGenome || this.getGenome;
        for (let i = 0; i < n; i++) {
            this.addCreature(energy, getGenome());
        }
        
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
