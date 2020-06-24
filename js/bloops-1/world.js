const World = {
    food: [],
    creatures: [],

    // Default values
    width: 400,
    height: 400,

    foodR: 1,
    foodEnergy: 100,
    foodGrowthRate: 0.1,

    creatureType: Bloop,
    creatureR: 5,
    creatureEnergy: 100,

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

        if (this.display) {
            this.display();
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