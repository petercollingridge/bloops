/**********************************************************************
 * Simulation 1
 * 
 * Basic simulation withone creature type, moving at random, eating
 * food and reproducing when they have enough energy.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop.js

function start(params = {}) {
    // Create world object
    params.width = 1200;
    params.height = 800;
    params.creatureType = Bloop6;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;

    const world = new World(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder('population', {
        Time: world => world.time,
        Food: world => world.food.length,
        Creatures: world => world.creatures.length,
    }, 100);

    // Record energy on simulation toolbar
    sim.addToToolbar('Energy', (world) => {
        let energy = world.food.length * world.foodEnergy;
        energy += sum(world.creatures, 'energy');
        return Math.round(energy).toLocaleString();
    });
}
