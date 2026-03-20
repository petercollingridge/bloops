/**********************************************************************
 * Simulation 3
 * 
 * Same as simulation 2, but with the Bloop3 creature, which has a
 * gene to control its size. Larger creatures move slower.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop3.js

function start(params = {}) {
    params.creatures = params.creatures || {};
    params.creatures.type = Bloop3;

    // Create world object
    const world = new World(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder('world', {
        Time: world => world.time,
        Food: world => world.food.length,
        Creatures: world => world.creatures.length,
        Size: world => mean(world.creatures, 'size'),
        'Size std': world => stdev(world.creatures.map(creature => creature.genome[0])),
    }, 100);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Mean size', (world) => {
        const meanSize = mean(world.creatures, 'size');
        return Math.round(meanSize * 100) / 100;
    });
}
