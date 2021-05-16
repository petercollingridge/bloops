/**********************************************************************
 * Simulation 4
 * 
 * Same as simulation 2, but with the Bloop2 creature, which has a
 * gene to control its size.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop4.js

function start(params) {
    params.creatureType = Bloop4;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;

    // Create world object
    const world = getWorld(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food every second
    sim.addRecorder([
        world => world.food.length,
        world => world.creatures.length,
        world => mean(world.creatures.map(c => c.genome[0])),
        world => stdev(world.creatures.map(c => c.genome[0])),
        world => mean(world.creatures.map(c => c.genome[1])),
        world => stdev(world.creatures.map(c => c.genome[1])),
    ]);

    // Record genomes of the whole population every minute
    sim.addRecorder([
        world => world.creatures.map(c => c.genome[0]).join(','),
        world => world.creatures.map(c => c.genome[1]).join(','),
    ], 50 * 60);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Size', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.r * creature.r));
        return Math.round(meanGene * 10) / 10;
    });

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Metabolism', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.metabolism));
        return Math.round(meanGene * 100) / 100;
    });
}
