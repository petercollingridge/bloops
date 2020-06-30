var TAU = 2 * Math.PI;
var canvas = document.getElementById('bloop-world');
var ctx = canvas.getContext('2d');

function drawCircle(obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, TAU, true);
    ctx.fill();
}

World.display = function() {
    const panelHeight = 25;

    ctx.clearRect(0, 0, this.width, this.height + panelHeight);
    ctx.translate(0, panelHeight);

    // Draw food
    ctx.fillStyle = 'rgb(40, 120, 10)';
    for (let i = 0; i < this.food.length; i++) {
        drawCircle(this.food[i]);
    }

    // Draw creatures
    for (let i = 0; i < this.creatures.length; i++) {
        const energy = Math.max(0, Math.min(1, this.creatures[i].energy / 200));
        const red = 255 * (1 - energy);
        const blue = 255 * energy;
        ctx.fillStyle = `rgba(${red}, 60, ${blue}, 160)`;
        drawCircle(this.creatures[i]);
    }

    ctx.translate(0, -panelHeight);
    
    // Information panel
    ctx.clearRect(0, 0, this.width, panelHeight);

    ctx.beginPath();
    ctx.moveTo(0, panelHeight - 0.5);
    ctx.lineTo(this.width, panelHeight - 0.5);
    ctx.lineWidth = '0.5';
    ctx.strokeStyle = '#666';
    ctx.stroke();
    
    // Display count of creatures
    ctx.font = "15px Arial";
    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.fillText(`Creatures: ${ this.creatures.length }`, 5, 19);
    ctx.fillText(`Food: ${ this.food.length }`, 130, 19);

    let energy = this.food.length * this.foodEnergy;
    energy += this.creatures.reduce((currentValue, creature) => currentValue + creature.energy, 0)
    ctx.fillText(`Energy: ${ Math.round(energy).toLocaleString() }`, 250, 19);
};

// Add play / pause button
function toggleRunning() {
    if (!World.animation) {
        this.innerHTML = 'Pause';
        World.run();
    } else {
        this.innerHTML = 'Run';
        World.stop();
    }
}

document.getElementById('run-button').addEventListener('click', toggleRunning);
