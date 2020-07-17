
function drawCircle(ctx, obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, TAU, true);
    ctx.fill();
}

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


World.display = function(ctx) {
    const panelHeight = 25;
    ctx.clearRect(0, 0, this.width, this.height + panelHeight);
    ctx.translate(0, panelHeight);

    // Draw food
    ctx.fillStyle = 'rgb(40, 120, 10)';
    for (let i = 0; i < this.food.length; i++) {
        drawCircle(ctx, this.food[i]);
    }

    // Draw creatures
    for (let i = 0; i < this.creatures.length; i++) {
        const energy = Math.max(0, Math.min(1, this.creatures[i].energy / 200));
        const red = 255 * (1 - energy);
        const blue = 255 * energy;
        ctx.fillStyle = `rgba(${red}, 60, ${blue}, 160)`;
        drawCircle(ctx, this.creatures[i]);
    }

    ctx.translate(0, -panelHeight);
};
