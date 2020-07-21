// Basic world with food randomly appearing

// require ../simulation.js
// require ../organisms/bloops/bloops-1.js
// require ../helpers/utils.js
// require ./utils.js


function getWorld(params) {
    const world = {
        // Get parameters or set defaults
        width: params.width || 600,
        height: params.height || 400,

        foodR: params.foodR || 1,
        foodEnergy: params.foodEnergy || 500,
        foodGrowthRate: params.foodGrowthRate || 0.1,

        creatures: [],
        food: [],

        update: function() {
            while (Math.random() < this.foodGrowthRate) {
                addRandomFoodUniform(this);
            }
        },

        display: function(ctx) {
            displayObjects(this.food, ctx);
            displayObjects(this.creatures, ctx);
        },
    };

    return world;
};
