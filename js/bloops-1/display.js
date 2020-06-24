var TAU = 2 * Math.PI;
var canvas = document.getElementById('bloop-world');
var ctx = canvas.getContext('2d');

function drawCircle(obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, TAU, true);
    ctx.fill();
}

World.display = function() {
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw food
    ctx.fillStyle = 'rgb(40, 120, 10)';
    for (let i = 0; i < this.food.length; i++) {
        drawCircle(this.food[i]);
    }

    // Draw creatures
    ctx.fillStyle = 'rgba(20, 60, 180, 160)';
    for (let i = 0; i < this.creatures.length; i++) {
        drawCircle(this.creatures[i]);
    }

    // Display count of creatures
    ctx.font = "16px Arial";
    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.fillText(this.creatures.length, 8, 20);
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
