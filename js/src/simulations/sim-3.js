/**********************************************************************
 * Simulation 3
 * 
 * Same as simulation 2, but with the Bloop2 creature, which has a
 * gene to control its size.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop3.js

function start(params) {
    params.creatureType = Bloop3;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;
    params.getGenome = () => Math.ceil(Math.random() * 100);
    
    // Create world object
    const world = getWorld(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Run simulation faster
    // sim.updateSpeed = 50;

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder([
        world => world.food.length,
        world => world.creatures.length,
        world => Math.min(...world.creatures.map(c => c.genome)),
        world => mean(world.creatures.map(c => c.genome)),
        world => Math.max(...world.creatures.map(c => c.genome)),
    ]);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Mean gene', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.genome));
        return Math.round(meanGene * 100) / 100;
    });
}
