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

function download(data, filename = "data.txt") {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
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

function sum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

function mean(arr) {
    if (arr.length === 0) {
        return null;
    }
    return sum(arr) / arr.length;
}
const TAU = 2 * Math.PI;

function drawCircle(ctx, obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, TAU, true);
    ctx.fill();
}
// Top-level object for running and display the simulation
const Simulation = function(id, world) {
    const container = document.getElementById(id);
    if (!container) {
        console.error('No element found with id ' + id);
        return;
    }
    this.world = world;
    this._buildControls(container);
    // Create toolbar
    this.toolbar = new Toolbar(world, 25);
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', world.width);
    canvas.setAttribute('height', world.height + this.toolbar.height);
    canvas.style.cssText = "border:1px solid #ddd";
    container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
    this.updateSpeed = 1;
    this.updateListeners = [world];
    // TODO: use display elements
    this.displayElements = [world, this.toolbar];
    this.display();
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
Simulation.prototype.addToToolbar = function(name, getValue) {
    this.toolbar.addValue(name, getValue);
    this.display();
}
Simulation.prototype.update = function() {
    for (let i = 0; i < this.updateSpeed; i++) {
        updateObjects(this.updateListeners);
    }
    console.log(this.recorder.data.length);
    this.display();
};
Simulation.prototype.display = function() {
    this.ctx.clearRect(0, this.toolbar.height, this.world.width, this.world.height);
    this.ctx.translate(0, this.toolbar.height);
    this.world.display(this.ctx);
    this.ctx.translate(0, -this.toolbar.height);
    this.toolbar.display(this.ctx);
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

function collide(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy <= (a.r + b.r) * (a.r + b.r);
}
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
// To be overridden
Organism.prototype.calculatePhenotype = function() {};
// To be overridden
Organism.prototype.getChildGenome = function() {
    return this.genome;
};
// Draw organisms as a circle
Organism.prototype.display = function(ctx) {
    ctx.fillStyle = this.getColour();
    drawCircle(ctx, this);
};
Organism.prototype.getColour = function() {
    return 'rgb(50, 60, 210, 160)';
};
// These bloops have a speed and a size which is not genetically controlled
// They reproduce by splitting in half, giving each cell half the energy.
// There are no genes or mutations
const Bloop = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
    this.childType = Bloop;
};
Bloop.prototype = Object.create(Organism.prototype);
Bloop.prototype.getColour = function() {
    // Colour based on energy/hunger
    const energy = Math.max(0, Math.min(1, this.energy / 200));
    const red = 255 * (1 - energy);
    const blue = 255 * energy;
    return `rgba(${red}, 60, ${blue}, 160)`;
};
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
    const newGenome = this.getChildGenome();
    const newCreature = new this.childType(position, this.energy, newGenome);
    world.creatures.push(newCreature);
};
// Food is an organism whose genome determines its size.
const Food = function(position, energy, genome) {
    Organism.call(this, position, energy, genome);
};
Food.prototype = Object.create(Organism.prototype);
Food.prototype.calculatePhenotype = function() {
    this.r = this.genome;
};
Food.prototype.getColour = function() {
    return 'rgb(40, 120, 10)';
}

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
    objects.forEach(function(obj) {
        obj.update(args);
    });
}

function addCreatures(world, n, energy, getGenome) {
    for (let i = 0; i < n; i++) {
        addCreature(world, energy, getGenome());
    }
}

function addCreature(world, energy, genome, position) {
    position = position || getRandomPositionUniform(world);
    const newCreature = new world.creatureType(position, energy, genome);
    world.creatures.push(newCreature);
}

function removeDeadCreatures(creatures) {
    for (let i = creatures.length; i--;) {
        if (creatures[i].dead) {
            creatures.splice(i, 1);
        }
    }
}
// Basic world with food randomly appearing
function getWorld(params) {
    // Default values
    const world = {
        width: 600,
        height: 400,
        foodR: 1,
        foodEnergy: 500,
        foodGrowthRate: 0.1,
        initialFoodNum: 200,
        creatureR: 3,
        creatureType: Bloop,
        creatureEnergy: 500,
        initialCreatureNum: 10,
        numTicks: 0,
        food: [],
        creatures: [],
    };
    // Overwrite default parameters with passed in values
    for (const key in params) {
        world[key] = params[key];
    }
    world.update = function() {
        this.numTicks++;
        while (Math.random() < this.foodGrowthRate) {
            addRandomFoodUniform(this);
        }
        updateObjects(this.creatures, world);
        removeDeadCreatures(this.creatures);
    };
    world.display = function(ctx) {
        displayObjects(this.food, ctx);
        displayObjects(this.creatures, ctx);
    };
    // Initialise world
    addRandomFoodUniform(world, world.initialFoodNum);
    // Function to set initial genome
    world.getGenome = world.getGenome || (() => world.creatureR);
    addCreatures(world, world.initialCreatureNum, world.creatureEnergy, world.getGenome);
    return world;
};
// Bloop3 is like a Bloop except it has a gene controlling its size
// Its radius is the square root of its size.
// Size mutates when Bloop2s reproduce getting +1 or -1 50% of the time.
const Bloop3 = function(position, energy, genome) {
    Bloop.call(this, position, energy, genome);
    this.childType = Bloop3;
};
Bloop3.prototype = Object.create(Bloop.prototype);
Bloop3.prototype.calculatePhenotype = function() {
    this.r = Math.sqrt(this.genome);
    this.speed = (101 - this.genome) * 0.005;
    this.angle = Math.PI * Math.random();
    this.metabolism = 1;
};
Bloop3.prototype.getChildGenome = function() {
    const mutation = Math.random();
    if (mutation < 0.25 && this.genome < 100) {
        return this.genome + 1;
    } else if (mutation < 0.50 && this.genome > 1) {
        return this.genome - 1;
    }
    return this.genome;
};
/**********************************************************************
 * Simulation 3
 * 
 * Same as simulation 2, but with the Bloop2 creature, which has a
 * gene to control its size.
 ***********************************************************************/
function start(params) {
    params.creatureType = Bloop3;
    params.initialFoodNum = params.initialFoodNum || 300;
    params.initialCreatureNum = params.initialCreatureNum || 50;
    params.getGenome = () => Math.ceil(Math.random() * 100);
    // Create world object
    const world = getWorld(params);
    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);
    // Run simulation faster
    // sim.updateSpeed = 50;
    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder([
        world => world.food.length,
        world => world.creatures.length,
        world => Math.min(...world.creatures.map(c => c.genome)),
        world => mean(world.creatures.map(c => c.genome)),
        world => Math.max(...world.creatures.map(c => c.genome)),
    ]);
    // Record mean cell size on simulation toolbar
    sim.addToToolbar('Mean gene', (world) => {
        const meanGene = mean(world.creatures.map(creature => creature.genome));
        return Math.round(meanGene * 100) / 100;
    });
}
