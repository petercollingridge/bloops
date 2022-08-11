// Events are in the form [type, parameters]
const EventHander = {
    events: [],
    listeners: {},
    // Make <obj> a listener for event of <type>
    // When it hears the event, it calls the <func>
    addEventListener: function(type, obj, func) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(func.bind(obj));
    },
    update: function() {
        this.events.forEach((type, param) => {
            listenersForEvent = this.listeners[type] || [];
            listenersForEvent.forEach(listener => {
                listener(param);
            });
        });
        // Clear processed events
        this.events = [];
    },
};
// Object for recording values about the world and downloading as a tab-delimited file
// Every interval it saves data about the world into an array which can be downloaded
const Recorder = function(keys, interval, world) {
    this.keys = keys;
    this.interval = interval;
    this.world = world;
    this.data = [];
};
Recorder.prototype.update = function() {
    if (this.world.numTicks % this.interval === 0) {
        this.data.push(this.keys.map(key => key(this.world)));
        console.log(this.data.length);
    }
};
Recorder.prototype.download = function() {
    let results = '';
    for (let i = 0; i < this.data.length; i++) {
        results += this.data[i].join('\t') + '\n';
    }
    download(results);
};
// Saves creature data into an array.
const CreatureRecorder = function(keys) {
    this.keys = keys;
    this.data = [];
}
CreatureRecorder.prototype.record = function(creature) {
    this.data.push(creature);
};
CreatureRecorder.prototype.download = function() {
    let results = '';
    this.data.forEach(creature => {
        results += this.keys.map(key => creature[key]).join('\t') + '\n';
    });
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

function getToolbarItem(itemName, toolbarElement, getValue, world) {
    const itemElement = toolbarElement.addElement('span').addClass('toolbar-item').text(itemName);
    const obj = {
        update: () => {
            const value = getValue(world);
            itemElement.text(`${itemName}: ${value}`);
        }
    };
    return obj;
}

function getToolbar(container, world) {
    const defaultItems = {
        Time: world => world.numTicks.toLocaleString(),
        Creatures: world => world.creatures.length,
        Food: world => world.food.length,
    };
    const toolbarElement = createElement('div').addClass('toolbar').addTo(container);
    const _items = [];
    const obj = {
        element: toolbarElement,
        addItem: (name, getValue) => {
            const newItem = getToolbarItem(name, toolbarElement, getValue, world);
            _items.push(newItem);
        },
        update: (world) => {
            _items.forEach((item) => {
                item.update(world);
            });
        }
    }
    for (const item in defaultItems) {
        obj.addItem(item, defaultItems[item]);
    }
    return obj;
}

function getInfobox(simulation) {
    const infoBoxElement = createElement('div').addClass('infobox').addTo(simulation.controls);
    let textNodes = [];
    const clear = () => {
        textNodes.forEach((box) => {
            box.text('');
        });
    }
    const obj = {
        element: infoBoxElement,
        update: () => {
            if (simulation.selectedCreature) {
                if (simulation.selectedCreature.dead) {
                    simulation.selectedCreature = false;
                    clear();
                } else {
                    // Clear any current info
                    infoBoxElement.textContent = '';
                    const info = simulation.selectedCreature.info();
                    Object.entries(info).map(([key, value], index) => {
                        let child = textNodes[index];
                        // Create child if it doesn't exist
                        if (!child) {
                            child = createElement('div').addTo(infoBoxElement);
                        }
                        textNodes.push(child);
                        child.text(`${key}: ${Math.round(value * 1e6) / 1e6}`)
                    })
                }
            }
        }
    };
    return obj;
}

function createElement(tag) {
    const element = document.createElement(tag);
    const obj = {
        element,
        attr: (attributes) => {
            for (const key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
            return obj;
        },
        addClass: (className) => {
            element.classList.add(className);
            return obj;
        },
        addElement(tag) {
            const childElement = createElement(tag).addTo(this);
            return childElement;
        },
        addEventListener: (type, func) => {
            element.addEventListener(type, func);
            return obj;
        },
        text: (text) => {
            element.innerHTML = text;
            return obj;
        },
        css: (styles) => {
            let cssString = ''
            for (const key in styles) {
                cssString += `${key}: ${styles[key]};`;
            }
            element.style.cssText = cssString;
            return obj;
        },
        addTo: (parent) => {
            parent.appendChild(element);
            return obj;
        },
        appendChild: (child) => {
            element.appendChild(child);
            return obj;
        }
    };
    return obj;
}

function sum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

function sumSq(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i] * arr[i];
    }
    return sum;
}

function mean(arr) {
    if (arr.length === 0) {
        return null;
    }
    return sum(arr) / arr.length;
}

function stdev(arr) {
    if (arr.length < 1) {
        return null;
    }
    const meanValue = mean(arr);
    return Math.sqrt(sumSq(arr) / arr.length - meanValue * meanValue);
}
const TAU = 2 * Math.PI;

function drawCircle(ctx, obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, TAU, true);
    ctx.fill();
}
// Top-level object for running and display the simulation
const Simulation = function(id, world, width, height) {
    const container = document.getElementById(id);
    if (!container) {
        console.error('No element found with id ' + id);
        return;
    }
    this.world = world;
    this.updateSpeed = 1;
    this.selectedCreature;
    this.toolbar = getToolbar(container, world);
    this._addCanvas(container, world, width, height);
    this.controls = createElement('div').addClass('sidebar').addTo(container);
    this.infobox = getInfobox(this);
    this._buildControls(this.controls);
    this.updateListeners = [this.toolbar, this.infobox];
    this.display();
};
Simulation.prototype._addCanvas = function(container, world, width, height) {
    this.offsetX = 0;
    this.offsetY = 0;
    let dragging = false;
    let mouseX;
    let mouseY;
    const maxX = world.width - width;
    const maxY = world.height - height;
    const canvas = createElement('canvas').attr({
        width: width || world.width,
        height: height || world.height
    }).addClass('main').addEventListener('mousedown', (evt) => {
        dragging = true;
        mouseX = evt.offsetX;
        mouseY = evt.offsetY;
    }).addEventListener('mousemove', (evt) => {
        if (dragging) {
            this.offsetX += mouseX - evt.offsetX;
            this.offsetY += mouseY - evt.offsetY;
            mouseX = evt.offsetX;
            mouseY = evt.offsetY;
            if (this.offsetX < 0) {
                this.offsetX = 0;
            } else if (this.offsetX > maxX) {
                this.offsetX = maxX;
            }
            if (this.offsetY < 0) {
                this.offsetY = 0;
            } else if (this.offsetY > maxY) {
                this.offsetY = maxY;
            }
            this.display();
        }
    }).addEventListener('mouseup', (evt) => {
        // Get the coordinates in the world where user clicked
        const x = evt.offsetX + this.offsetX;
        const y = evt.offsetY + this.offsetY;
        this.selectedCreature = this.world.findCreatureAtCoord(x, y);
        // Trigger an update even if the display is not updating
        if (this.selectedCreature) {
            this.infobox.update();
        }
    }).addTo(container);
    document.addEventListener('mouseup', () => {
        dragging = false;
    });
    this.ctx = canvas.element.getContext('2d');
};
Simulation.prototype._buildControls = function(container) {
    // Play / Pause button
    const runButton = this.controls.addElement('button').text('Run');
    runButton.addEventListener('click', () => {
        if (!this.animation) {
            runButton.text('Pause');
            this.run();
        } else {
            runButton.text('Run');
            this.stop();
        }
    });
    // Speed slider
    const sliderLabel = this.controls.addElement('label').attr({
        for: 'speed-control'
    }).text(`Speed: ${this.updateSpeed}`).css({
        'padding-top': '0.5rem'
    });
    this.controls.addElement('input').attr({
        type: 'range',
        id: 'speed-control',
        value: this.updateSpeed
    }).addEventListener('input', (evt) => {
        this.updateSpeed = evt.target.value;
        sliderLabel.text(`Speed: ${this.updateSpeed}`);
    });
};
Simulation.prototype.addRecorder = function(name, keys, interval) {
    interval = interval || 50;
    const recorder = new Recorder(keys, interval, this.world);
    this.updateListeners.push(recorder);
    this.addDownloadButton(name, recorder.download.bind(recorder));
};
Simulation.prototype.addCreatureRecorder = function(keys) {
    const recorder = new CreatureRecorder(keys);
    this.world.creatureRecorder = recorder;
    this.addDownloadButton('creatures', recorder.download.bind(recorder));
    // Save initial creatures
    this.world.creatures.forEach(creature => recorder.record(creature));
}
Simulation.prototype.addDownloadButton = function(name, downloadFunction) {
    const downloadLink = document.createElement('button');
    downloadLink.innerHTML = `Download ${name}`;
    downloadLink.addEventListener('click', downloadFunction);
    this.controls.appendChild(downloadLink);
}
Simulation.prototype.addToToolbar = function(name, getValue) {
    this.toolbar.addItem(name, getValue);
}
Simulation.prototype.update = function() {
    // Update the world multiple times before updating the display to speed things up
    for (let i = 0; i < this.updateSpeed; i++) {
        updateObjects([this.world]);
    }
    updateObjects(this.updateListeners);
    this.display();
};
Simulation.prototype.display = function() {
    this.ctx.clearRect(0, 0, this.world.width, this.world.height);
    this.ctx.translate(-this.offsetX, -this.offsetY);
    this.world.display(this.ctx);
    if (this.selectedCreature) {
        const {
            x,
            y,
            r
        } = this.selectedCreature;
        const s = 2;
        const width = 2 * (s + r);
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.rect(x - r - s, y - r - s, width, width);
        this.ctx.stroke();
    }
    this.ctx.translate(this.offsetX, this.offsetY);
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

function randomInRange(a, b) {
    if (!b) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a));
}

function mutate(value, min = 1, max = 100) {
    const mutation = Math.random();
    if (mutation < 0.01) {
        return randomInRange(min, max);
    } else if (mutation < 0.5) {
        const r = Math.random();
        if (r < 0.5 && value < max) {
            return value + 1;
        } else if (value > min) {
            return value - 1;
        }
    }
    return value;
}
// Generic organism.
// Has a position and energy.
// Any other properties are part of its genome
const Organism = function(position, energy, genome) {
    this.age = 0;
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
    this.age++;
    this.energy -= this.metabolism;
    this.eat(world.food);
    this.move(world);
    if (this.energy < 0) {
        this.dead = true;
        this.died = world.numTicks;
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
    world.addCreature(this.energy, newGenome, position);
};
Bloop.prototype.info = function() {
    return {
        id: this.id,
        age: this.age,
        energy: this.energy,
        speed: this.speed,
        metabolism: this.metabolism,
    };
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

function removeDeadCreatures(creatures, world) {
    for (let i = creatures.length; i--;) {
        if (creatures[i].dead) {
            creatures.splice(i, 1);
        }
    }
}
// Basic world with food randomly appearing
const DEFAULT_PARAMS = {
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

function getWorld(params) {
    const world = Object.assign(DEFAULT_PARAMS, params || {});
    world.update = function() {
        this.numTicks++;
        while (Math.random() < this.foodGrowthRate) {
            addRandomFoodUniform(this);
        }
        updateObjects(this.creatures, world);
        removeDeadCreatures(this.creatures, world);
    };
    world.display = function(ctx) {
        displayObjects(this.food, ctx);
        displayObjects(this.creatures, ctx);
    };
    // Add n randomly-positioned created with the same energy level
    world.addCreatures = function(n, energy) {
        const getGenome = world.creatureType.getRandomGenome || world.getGenome;
        for (let i = 0; i < n; i++) {
            world.addCreature(energy, getGenome());
        }
    }
    world.addCreature = function(energy, genome, position) {
        position = position || getRandomPositionUniform(world);
        const newCreature = new world.creatureType(position, energy, genome);
        world.creatures.push(newCreature);
        // Save some additional data about the creature
        newCreature.id = getNewCreatureId();
        newCreature.born = world.numTicks;
        if (this.creatureRecorder) {
            this.creatureRecorder.record(newCreature);
        }
    }
    world.findCreatureAtCoord = function(x, y) {
        let selectedCreature;
        for (let i = 0; i < world.creatures.length; i++) {
            const creature = world.creatures[i];
            const dx = creature.x - x;
            const dy = creature.y - y;
            const r = creature.r;
            if (dx * dx + dy * dy < r * r) {
                selectedCreature = creature;
                break;
            }
        }
        return selectedCreature;
    }

    function getNewCreatureId() {
        world.creatureId = (world.creatureId || 0) + 1;
        return world.creatureId;
    }
    // Initialise world
    addRandomFoodUniform(world, world.initialFoodNum);
    // Function to set initial genome
    world.getGenome = world.getGenome || (() => world.creatureR);
    world.addCreatures(world.initialCreatureNum, world.creatureEnergy, world.getGenome);
    return world;
};
/**********************************************************************
 * Simulation 1
 * 
 * Basic simulation withone creature type, moving at random, eating
 * food and reproducing when they have enough energy.
 ***********************************************************************/
function start(params) {
    // Create world object
    const world = getWorld(params);
    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);
    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder('population', [
        world => world.food.length,
        world => world.creatures.length,
    ]);
    // Record energy on simulation toolbar
    sim.addToToolbar('Energy', (world) => {
        let energy = world.food.length * world.foodEnergy;
        energy += sum(world.creatures.map(creature => creature.energy));
        return energy.toLocaleString();
    });
}
