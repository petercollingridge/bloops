/**********************************************************************
 * Simulation 5
 * 
 * The Bloop5 creatures have genes to control size, metabolim and
 * the amount of energy required before reproduction.
 * Larger creatures move slower, creatures with higher metabolism
 * use more energy per tick, but can move faster.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop5.js

function start(params) {
    params.width = 1200;
    params.height = 800;
    params.creatureType = Bloop5;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;

    // Create world object
    const world = getWorld(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world, 600, 400);

    // Record the number of creatures and food every second
    sim.addRecorder('population',[
        world => world.food.length,
        world => world.creatures.length,
        world => mean(world.creatures.map(c => c.genome[0])),
        world => stdev(world.creatures.map(c => c.genome[0])),
        world => mean(world.creatures.map(c => c.genome[1])),
        world => stdev(world.creatures.map(c => c.genome[1])),
    ]);

    // Record genomes of the whole population every minute
    sim.addRecorder('genomes', [
        world => world.creatures.map(c => c.genome[0]).join(','),
        world => world.creatures.map(c => c.genome[1]).join(','),
        world => world.creatures.map(c => c.genome[2]).join(','),
    ], 50 * 60);

    // Record when each creature was born and died
    sim.addCreatureRecorder(['id', 'born', 'died', 'genome']);

    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Size', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.r * creature.r));
        return Math.round(meanGene * 10) / 10;
    });

    // Record mean metabolism on simulation toolbar
    sim.addToToolbar('Metabolism', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.metabolism));
        return Math.round(meanGene * 100) / 100;
    });

    // Record mean energy threshold on simulation toolbar
    sim.addToToolbar('Energy', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.reproductionThreshold));
        return Math.round(meanGene);
    });
}
