const TAU = 2 * Math.PI;

function collide(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy <= (a.r + b.r) * (a.r + b.r);
}

function download(data, filename = "data.txt") {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
// Object for recording values about the world and downloading as a tab-delimited file
const Recorder = function(keys, interval, world) {
    this.keys = keys;
    this.interval = interval;
    this.world = world;
    this.data = [];
};
Recorder.prototype.update = function() {
    if (this.world.numTicks % this.interval === 0) {
        this.data.push(this.keys.map(key => key(this.world)));
    }
};
Recorder.prototype.download = function() {
    let results = '';
    for (let i = 0; i < this.data.length; i++) {
        results += this.data[i].join('\t') + '\n';
    }
    download(results);
};
// Generic organism.
// Has a position and energy.
// Any other properties are part of its genome
const Organism = function(position, energy, genome) {
    this.x = position.x;
    this.y = position.y;
    this.energy = energy;
    this.genome = genome;
    this.calculatePhenotype();
};
Organism.prototype.calculatePhenotype = function() {};
// Food is an organism whose genome determines its size.
const Food = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Food.prototype = Object.create(Organism.prototype);
Food.prototype.calculatePhenotype = function() {
    this.r = this.genome;
};
// Bloops have a speed and a size.
const Bloop = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Bloop.prototype = Object.create(Organism.prototype);
Bloop.prototype.calculatePhenotype = function() {
    this.r = this.genome;
    this.speed = 0.2;
    this.angle = Math.PI * Math.random();
    this.metabolism = 1;
};
Bloop.prototype.update = function(world) {
    this.energy -= this.metabolism;
    this.eat(world.food);
    this.move(world);
    if (this.energy < 0) {
        this.dead = true;
    } else if (this.energy > 1000) {
        this.reproduce(world);
    }
};
Bloop.prototype.eat = function(food) {
    for (let i = 0; i < food.length; i++) {
        if (collide(this, food[i])) {
            this.energy += food[i].energy;
            food.splice(i, 1);
            break;
        }
    }
};
Bloop.prototype.move = function(world) {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    // Wrap around world
    if (this.x > world.width) {
        this.x -= world.width;
    } else if (this.x < 0) {
        this.x += world.width;
    }
    if (this.y > world.height) {
        this.y -= world.height;
    } else if (this.y < 0) {
        this.y += world.height;
    }
    if (Math.random() < 0.05) {
        this.angle += (Math.random() - 0.5);
    }
};
Bloop.prototype.reproduce = function(world) {
    this.energy /= 2;
    const position = {
        x: this.x,
        y: this.y
    };
    const newCreature = new Bloop(position, this.energy, this.genome);
    world.creatures.push(newCreature);
};
const World = {
    food: [],
    creatures: [],
    // Default values
    width: 600,
    height: 400,
    foodR: 1,
    foodEnergy: 500,
    foodGrowthRate: 0.1,
    creatureType: Bloop,
    creatureR: 5,
    creatureEnergy: 500,
    numTicks: 0,
    saveData: [],
    init: function(params) {
        // Overwrite default values
        for (const param in params) {
            this[param] = params[param];
        }
    },
    addFood: function(n = 1) {
        for (let i = 0; i < n; i++) {
            const newFood = new Food(this.getRandomPosition(), this.foodEnergy, this.foodR);
            this.food.push(newFood);
        }
    },
    addCreature: function(genome, position) {
        position = position || this.getRandomPosition();
        const newCreature = new this.creatureType(position, this.creatureEnergy, genome);
        this.creatures.push(newCreature);
    },
    addCreatures: function(n, genome, position) {
        for (let i = 0; i < n; i++) {
            this.addCreature(genome, position);
        }
    },
    getRandomPosition: function() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
        };
    },
    update: function() {
        // Grow food
        while (Math.random() < this.foodGrowthRate) {
            this.addFood();
        }
        // Update creatures
        for (let i = 0; i < this.creatures.length; i++) {
            this.creatures[i].update(this);
        }
        // Remove dead creatures
        for (let i = this.creatures.length; i--;) {
            if (this.creatures[i].dead) {
                this.creatures.splice(i, 1);
            }
        }
        this.numTicks++
    },
};

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
// Top-level object for running and display the simulation
const Simulation = function(id, world) {
    const container = document.getElementById(id);
    if (!container) {
        console.error('No element found with id ' + id);
        return;
    }
    this.world = world;
    this._buildControls(container);
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', world.width);
    canvas.setAttribute('height', world.height);
    canvas.style.cssText = "border:1px solid #ddd";
    container.appendChild(canvas);
    // Create toolbar
    this.toolbar = new Toolbar(world, 25);
    this.ctx = canvas.getContext('2d');
    this.updateSpeed = 1;
    this.updateListeners = [world];
    this.displayElements = [world, this.toolbar];
};
Simulation.prototype._buildControls = function(container) {
    container.style.cssText = "display:flex; flex-wrap:wrap;";
    this.controls = document.createElement('div');
    this.controls.style.cssText = "width:100px; margin-right: 2rem; margin-bottom: 1rem;display: flex;justify-content: center;flex-direction: column;";
    container.appendChild(this.controls);
    // Play / Pause button
    const runButton = document.createElement('button');
    runButton.innerHTML = 'Run';
    runButton.addEventListener('click', () => {
        if (!this.animation) {
            runButton.innerHTML = 'Pause';
            this.run();
        } else {
            runButton.innerHTML = 'Run';
            this.stop();
        }
    });
    this.controls.appendChild(runButton);
};
Simulation.prototype.addRecorder = function(keys, interval) {
    interval = interval || 50;
    this.recorder = new Recorder(keys, interval, this.world);
    this.updateListeners.push(this.recorder);
    const downloadLink = document.createElement('button');
    downloadLink.innerHTML = "Download";
    downloadLink.addEventListener('click', this.recorder.download.bind(this.recorder));
    this.controls.appendChild(downloadLink);
};
Simulation.prototype.update = function() {
    for (let i = 0; i < this.updateSpeed; i++) {
        for (let j = 0; j < this.updateListeners.length; j++) {
            this.updateListeners[j].update();
        }
    }
    for (let i = 0; i < this.displayElements.length; i++) {
        this.displayElements[i].display(this.ctx);
    }
};
Simulation.prototype.setTimeout = function() {
    this.update();
    this.animation = setTimeout(this.setTimeout.bind(this), 20);
};
Simulation.prototype.run = function() {
    if (!this.animation) {
        this.setTimeout();
    }
};
Simulation.prototype.stop = function() {
    clearTimeout(this.animation);
    this.animation = false;
};
