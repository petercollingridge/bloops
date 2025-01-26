/**********************************************************************
 * Simulation 3
 * 
 * Same as simulation 2, but with the Bloop3 creature, which has a
 * gene to control its size. Larger creatures move slower.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop3.js

function start(params = {}) {
    params.creatureType = Bloop3;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;
    params.getGenome = () => Math.ceil(Math.random() * 100);

    // Create world object
    const world = getWorld(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder('world', [
        world => world.food.length,
        world => world.creatures.length,
        world => mean(world.creatures.map(c => c.genome)),
        world => stdev(world.creatures.map(c => c.genome)),
    ]);

    sim.addCreatureRecorder(['id', 'born', 'died', 'genome']);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Mean gene', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.genome));
        return Math.round(meanGene * 100) / 100;
    });
}
