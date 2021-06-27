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
    numTicks: 0,
    food: [],
    creatures: [],
};

function getWorld(params) {
    const world = Object.assign(DEFAULT_PARAMS, params);

    world.update = function() {
        this.numTicks++;

        while (Math.random() < this.foodGrowthRate) {
            addRandomFoodUniform(this);
        }

        updateObjects(this.creatures, world);
        removeDeadCreatures(this.creatures, world);
    };

    world.display = function(ctx) {
        displayObjects(this.food, ctx);
        displayObjects(this.creatures, ctx);
    };

    // Add n randomly-positioned created with the same energy level
    world.addCreatures = function(n, energy) {
        const getGenome = world.creatureType.getRandomGenome || world.getGenome;
        for (let i = 0; i < n; i++) {
            world.addCreature(energy, getGenome());
        }
    }

    world.addCreature = function(energy, genome, position) {
        position = position || getRandomPositionUniform(world);
        const newCreature = new world.creatureType(position, energy, genome);
        world.creatures.push(newCreature);
    
        // Save some additional data about the creature
        newCreature.id = getNewCreatureId();
        newCreature.born = world.numTicks;
    }

    function getNewCreatureId() {
        world.creatureId = (world.creatureId || 0) + 1;
        return world.creatureId;
    }

    // Initialise world
    addRandomFoodUniform(world, world.initialFoodNum);

    // Function to set initial genome
    world.getGenome = world.getGenome || (() => world.creatureR);
    world.addCreatures(world.initialCreatureNum, world.creatureEnergy, world.getGenome);

    return world;
};
