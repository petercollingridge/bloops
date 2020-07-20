// require ./bloops.js

const World = {
    food: [],
    creatures: [],

    // Default values
    width: 600,
    height: 400,

    foodR: 1,
    foodEnergy: 500,
    foodGrowthRate: 0.1,

    creatureType: Bloop,
    creatureR: 5,
    creatureEnergy: 500,

    numTicks: 0,
    saveData: [],

    init: function(params) {
        // Overwrite default values
        for (const param in params) {
            this[param] = params[param];
        }
    },

    addFood: function(n=1) {
        for (let i = 0; i < n; i++) {
            const newFood = new Food(this.getRandomPosition(), this.foodEnergy, this.foodR);
            this.food.push(newFood);
        }
    },

    addCreature: function(genome, position) {
        position = position || this.getRandomPosition();
        const newCreature = new this.creatureType(position, this.creatureEnergy, genome);
        this.creatures.push(newCreature);
    },

    addCreatures: function(n, genome, position) {
        for (let i = 0; i < n; i++) {
            this.addCreature(genome, position);
        }
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
        for (let i = 0; i < this.creatures.length; i++) {
            this.creatures[i].update(this);
        }

        // Remove dead creatures
        for (let i = this.creatures.length; i--;) {
            if (this.creatures[i].dead) {
                this.creatures.splice(i, 1);
            }
        }

        this.numTicks++
    },
};
