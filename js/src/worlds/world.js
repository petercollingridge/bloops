// Basic world with food randomly appearing

// require ../simulations/simulation.js
// require ../organisms/bloops/Bloop.js
// require ./utils.js


function getWorld(params) {
    // Default values
    const world = {
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
        numTicks: 0,
        food: [],
        creatures: [],
    };

    // Overwrite default parameters with passed in values
    for (const key in params) {
        world[key] = params[key];
    }

    world.update = function() {
        this.numTicks++;

        while (Math.random() < this.foodGrowthRate) {
            addRandomFoodUniform(this);
        }

        updateObjects(this.creatures, world);
        removeDeadCreatures(this.creatures);
    };

    world.display = function(ctx) {
        displayObjects(this.food, ctx);
        displayObjects(this.creatures, ctx);
    };

    // Initialise world
    addRandomFoodUniform(world, world.initialFoodNum);
    addCreatures(world, world.initialCreatureNum, world.creatureEnergy, world.creatureR);
    return world;
};
