/**********************************************************************
 * Simulation 2
 * 
 * Same as simulation 1, but with the Bloop2 creature, which has a
 * gene to control its size.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop2.js

function start(params) {
    params.creatureR = params.creatureR || 9;
    params.creatureType = Bloop2;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;

    // Create world object
    const world = getWorld(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Run simulation faster
    sim.updateSpeed = 50;

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder([
        world => world.food.length,
        world => world.creatures.length,
        world => mean(world.creatures.map(c => c.genome))
    ]);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Mean size', (world) => {
        const meanSize = mean(world.creatures.map(creature => creature.genome));
        return Math.round(meanSize * 100) / 100;
    });
}
