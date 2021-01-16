/**********************************************************************
 * Simulation 1
 * 
 * Basic simulation withone creature type, moving at random, eating
 * food and reproducing when they have enough energy.
***********************************************************************/

// require ..worlds/world.js
// require ../organisms/bloops/Bloop.js

function start(params) {
    // Create world object
    const world = getWorld(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder([
        world => world.food.length,
        world => world.creatures.length
    ]);
}
