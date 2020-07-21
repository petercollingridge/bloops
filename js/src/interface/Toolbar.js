const Toolbar = function(world, height) {
    this.world = world;
    this.width = world.width;
    this.height = height;
};

Toolbar.prototype.display = function(ctx) {
    // Information panel
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.beginPath();
    ctx.moveTo(0, this.height - 0.5);
    ctx.lineTo(this.width, this.height - 0.5);
    ctx.lineWidth = '0.5';
    ctx.strokeStyle = '#666';
    ctx.stroke();
    
    // Display counts
    ctx.font = "15px Arial";
    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.textAlign = "center";

    const food = this.world.food;
    const creatures = this.world.creatures;
    let energy = food.length * this.world.foodEnergy;
    energy += creatures.reduce((currentValue, creature) => currentValue + creature.energy, 0);

    const values = {
        'Time': this.world.numTicks,
        'Creatures': creatures.length,
        'Food': food.length,
        'Energy': Math.round(energy).toLocaleString(),
    };

    const dx = this.width / Object.keys(values).length;
    let i = 0.5;
    for (key in values) {
        ctx.fillText(`${ key }: ${ values[key] }`, dx * i, 19);
        i++;
    }
};