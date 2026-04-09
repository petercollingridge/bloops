/**********************************************************************
 * Simulation 2
 * 
 * Same as simulation 1, but with the Bloop2 creature, which has a
 * gene to control its size.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop2.js

function start(params) {
    params.creatures = params.creatures || {};
    params.creatures.type = Bloop2;

    // Create world object
    const world = new World(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder('population', {
        Time: world => world.time,
        Food: world => world.food.length,
        Creatures: world => world.creatures.length,
        MeanSize: world => mean(world.creatures, 'size'),
        MinSize: world => min(world.creatures, 'size'),
        MaxSize: world => max(world.creatures, 'size'),
    }, 100);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Mean size', (world) => {
        const meanSize = mean(world.creatures, 'size');
        return Math.round(meanSize * 100) / 100;
    });
}
