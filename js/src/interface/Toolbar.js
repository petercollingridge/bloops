const Toolbar = function(world, height) {
    this.world = world;
    this.width = world.width;
    this.height = height;

    // Default toolbar values
    this.values = {
        Time: world => world.numTicks,
        Creatures: world => world.creatures.length,
        Food: world => world.food.length,
    };
};

Toolbar.prototype.addValue = function(name, getValue) {
    this.values[name] = getValue;
}

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

    const dx = this.width / Object.keys(this.values).length;
    let i = 0.5;

    for (key in this.values) {
        const getValue = this.values[key];
        const value = typeof getValue === 'function' ? getValue(this.world) : getValue;
        ctx.fillText(`${ key }: ${ value }`, dx * i, 19);
        i++;
    }
};