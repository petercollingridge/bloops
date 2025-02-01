// require ../organisms/Food.js

function addRandomFoodUniform(world, n) {
    n = n || 1;
    for (let i = 0; i < n; i++) {
        const newFood = new Food(getRandomPositionUniform(world), world.foodEnergy, world.foodR);
        world.food.push(newFood);
    }
}

function getRandomPositionUniform(world) {
    return {
        x: Math.random() * world.width,
        y: Math.random() * world.height,
    };
}

// Call the display method for every item in an array
function displayObjects(objects, ctx) {
    objects.forEach(function(obj) {
        obj.display(ctx);
    });
}

// Call the update method for every item in an array
function updateObjects(objects, args) {
    objects.forEach((obj) => obj.update(args));
}
