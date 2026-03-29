// Object for recording values about the world and downloading as a tab-delimited file
// Every interval it saves data about the world into an array which can be downloaded

const writeLine = (arr) => arr.join('\t') + '\n';
const writeObject = (obj) =>
    Object.entries(obj)
        .map(([key, value]) => `${key}: ${typeof value === 'function' ? value.name : value}`)
        .join(', ') + '\n';

class Recorder {
    constructor(fields, interval, world) {
        this.fields = fields;
        this.fieldNames = Object.keys(fields);
        this.interval = interval;
        this.world = world;

        this.worldConfig = `width: ${world.width}; height: ${world.height}\n`;
        this.worldConfig += writeObject(world.foodProps);
        this.worldConfig += writeObject(world.creatureProps);

        // Map field name to an array of data
        this.data = {};
        this.fieldNames.forEach(fieldName => {
            const value = this.fields[fieldName](this.world);
            this.data[fieldName] = [value];
        });
        this.dataLength = 1;

    }

    update() {
        if (this.world.time % this.interval === 0) {
            this.dataLength++;
            this.fieldNames.forEach(fieldName => {
                const value = this.fields[fieldName](this.world);
                this.data[fieldName].push(value);
            });
        }
    }

    download() {
        let results = this.worldConfig;
        results += writeLine(this.fieldNames);

        for (let i = 0; i < this.dataLength; i++) {
            const values = this.fieldNames.map(fieldName => this.data[fieldName][i]);
            results += writeLine(values);
        }
        download(results);
    }
}

// Saves creature data into an array.
class CreatureRecorder {
    constructor(keys) {
        this.keys = keys;
        this.data = [];
    }
    record(creature) {
        this.data.push(creature);
    }
    download() {
        let results = writeLine(this.keys);
        this.data.forEach(creature => {
            const values = this.keys.map(key => creature[key]);
            results += writeLine(values)
        });
        download(results);
    }
}

function download(data, filename="data.txt") {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getToolbarItem(itemName, toolbarElement, getValue, world) {
  const itemElement = toolbarElement.addElement('span')
    .addClass('toolbar-item')
    .text(itemName);

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
    Time: world => world.time.toLocaleString(),
    Creatures: world => world.creatures.length,
    Food: world => world.food.length,
  };

  const toolbarElement = createElement('div')
    .addClass('toolbar')
    .addTo(container);

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
  const infoBoxElement = createElement('div')
    .addClass('infobox')
    .addTo(simulation.controls);

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
const WORLD_DEFAULTS = {
  width: 600,
  height: 400,
};

const BLOOP_DEFAULTS = {
  initialCount: 50,
  energy: 500,
  metabolism: 1,
  reproductionThreshold: 1000,
  size: 6,
  speed: 0.2,
};

const FOOD_DEFAULTS = {
  initialCount: 300,
  energy: 500,
  r: 1,
  growthRate: 0.1,
};

function extract(arr, accessor) {
  return arr.map(item => item[accessor]);
}

function sum(arr, accessor) {
    let sum = 0;

    if (accessor) {
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i][accessor];
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
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

function mean(arr, accessor) {
    if (arr.length === 0) { return null; }
    return sum(arr, accessor) / arr.length;
}

function stdev(arr) {
    if (arr.length < 1) { return null; }
    const meanValue = mean(arr);
    return Math.sqrt(sumSq(arr) / arr.length - meanValue * meanValue);
}

const TAU = 2 * Math.PI;

function drawCircle(ctx, obj) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, TAU, true);
    ctx.fill();
}
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

// Get a random array of n genes
// Each gene is an integer between <min> and <max>
function getRandomGenome(n, min = 1, max = 100) {
  const genome = [];
  while(n-- > 0) {
    genome.push(randomInRange(min, max));
  }
  return genome;
}

// Given value, within a range of min - max,
// leave it unchanged (p = 0.5)
// change its value by +1 or -1 (p = 0.49)
// or pick a new value at random  (p = 0.01)
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

// require ../helpers/display.js
// require ./utils.js

class Organism {
    constructor(position, energy, genome) {
        this.age = 0;
        this.x = position.x;
        this.y = position.y;
        this.energy = energy;
        this.genome = genome || this.getRandomGenome();
        this.calculatePhenotype();
    }

    // To be overridden
    calculatePhenotype() { }

    // To be overridden
    getChildGenome() {
        return this.genome;
    }

    // To be overridden
    getRandomGenome() {}

    // Draw organisms as a circle
    display(ctx) {
        ctx.fillStyle = this.getColour();
        drawCircle(ctx, this);
    }

    getColour() {
        return 'rgb(50, 60, 210, 160)';
    }
}

// require ./Organism.js

// Food is an organism whose genome determines its size.
class Food extends Organism {
    constructor(position, energy, genome) {
        super(position, energy, genome);
    }
    calculatePhenotype() {
        this.r = this.genome;
    }
    getColour() {
        return 'rgb(40, 120, 10)';
    }
}

// Top-level object for handling the running and display the simulation

// require ./eventHandler.js
// require ../interface/Recorder.js
// require ../interface/Toolbar.js
// require ../interface/Infobox.js
// require ../interface/utils.js
// require ../helpers/utils.js
// require ../helpers/display.js


class Simulation {
    constructor(id, world, width, height) {
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
        this._buildControls();

        // Object update every tick of the simulation
        this.updateListeners = [this.world];

        // Object update every tick of the simulation
        this.displayListeners = [this.toolbar, this.infobox];

        // Display now to show simulation before the first update runs
        this.display();
    }

    _addCanvas(container, world, width = 600, height = 400) {
        this.offsetX = 0;
        this.offsetY = 0;
        let dragging = false;
        let mouseX;
        let mouseY;

        const maxX = world.width - width;
        const maxY = world.height - height;

        const canvas = createElement('canvas')
            .attr({ width, height })
            .addClass('main')
            .addEventListener('mousedown', (evt) => {
                dragging = true;
                mouseX = evt.offsetX;
                mouseY = evt.offsetY;
            })
            .addEventListener('mousemove', (evt) => {
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
            })
            .addEventListener('mouseup', (evt) => {
                // Get the coordinates in the world where user clicked
                const x = evt.offsetX + this.offsetX;
                const y = evt.offsetY + this.offsetY;
                this.selectedCreature = this.world.findCreatureAtCoord(x, y);

                // Trigger an update even if the display is not updating
                if (this.selectedCreature) {
                    this.infobox.update();
                }

            })
            .addTo(container);

        document.addEventListener('mouseup', () => {
            dragging = false;
        });

        this.ctx = canvas.element.getContext('2d');
    }
    
    _buildControls() {
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
        const sliderLabel = this.controls.addElement('label')
            .attr({ for: 'speed-control' })
            .text(`Speed: ${this.updateSpeed}`)
            .css({ 'padding-top': '0.5rem' });

        this.controls.addElement('input')
            .attr({
                type: 'range',
                id: 'speed-control',
                value: this.updateSpeed
            })
            .addEventListener('input', (evt) => {
                this.updateSpeed = evt.target.value;
                sliderLabel.text(`Speed: ${this.updateSpeed}`);
            });
    }

    addRecorder(name, fields, interval) {
        interval = interval || 50;
        const recorder = new Recorder(fields, interval, this.world);
        this.updateListeners.push(recorder);
        this.addDownloadButton(name, recorder.download.bind(recorder));
    }

    addCreatureRecorder(keys) {
        const recorder = new CreatureRecorder(keys);
        this.world.creatureRecorder = recorder;
        this.addDownloadButton('creatures', recorder.download.bind(recorder));
        // Save initial creatures
        this.world.creatures.forEach(creature => recorder.record(creature));
    }

    addDownloadButton(name, downloadFunction) {
        const downloadLink = document.createElement('button');
        downloadLink.innerHTML = `Download ${name}`;
        downloadLink.addEventListener('click', downloadFunction);
        this.controls.appendChild(downloadLink);
    }

    addToToolbar(name, getValue) {
        this.toolbar.addItem(name, getValue);
    }

    update() {
        // Update the world multiple times before updating the display to speed things up
        for (let i = 0; i < this.updateSpeed; i++) {
            updateObjects(this.updateListeners);
        }
    }

    display() {
        updateObjects(this.displayListeners);

        this.ctx.clearRect(0, 0, this.world.width, this.world.height);
        this.ctx.translate(-this.offsetX, -this.offsetY);

        this.world.display(this.ctx);

        if (this.selectedCreature) {
            const { x, y, r } = this.selectedCreature;
            const s = 2;
            const width = 2 * (s + r);
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.rect(x - r - s, y - r - s, width, width);
            this.ctx.stroke();
        }

        this.ctx.translate(this.offsetX, this.offsetY);
    }

    setTimeout() {
        this.update();
        this.display();
        this.animation = setTimeout(this.setTimeout.bind(this), 20);
    }

    run() {
        if (!this.animation) {
            this.setTimeout();
        }
    }
    
    stop() {
        clearTimeout(this.animation);
        this.animation = false;
    }
}

// These bloops have a speed and a size which is not genetically controlled
// They reproduce by splitting in half, giving each cell half the energy.
// There are no genes or mutations

// require ../Organism.js

const creatureProps = ['energy', 'metabolism', 'reproductionThreshold', 'size', 'speed'];

class Bloop extends Organism {
    constructor(position, energy, genome, params = {}) {
        super(position, energy, genome);
        this.childType = Bloop;

        // Default values
        creatureProps.forEach((prop) => {
            this[prop] = this[prop] || params[prop] || BLOOP_DEFAULTS[prop];
        });

        this.r = this.size / 2;
        this.setAngle(Math.PI * Math.random());
    }

    getColour() {
        // Colour based on energy/hunger
        const energy = Math.max(0, Math.min(1, this.energy / 500));
        const red = 255 * (1 - energy);
        const blue = 255 * energy;
        return `rgba(${red}, 60, ${blue}, 160)`;
    }

    calculatePhenotype() {}

    setAngle(angle) {
        this.angle = angle;
        this.dx = Math.cos(this.angle);
        this.dy = Math.sin(this.angle);
    }

    update(world) {
        this.age++;
        this.energy -= this.metabolism;

        this.move(world);
        this.eat(world.food);
        this._update(world);

        if (this.energy < 0) {
            this.dead = true;
            this.died = world.time;
        } else if (this.energy > this.reproductionThreshold) {
            this.reproduce(world);
        }
    }

    eat(food) {
        for (let i = 0; i < food.length; i++) {
            if (collide(this, food[i])) {
                this.energy += food[i].energy;
                food.splice(i, 1);
                break;
            }
        }
    }

    move(world) {
        this.x += this.speed * this.dx;
        this.y += this.speed * this.dy;

        // Wrap around world
        if (this.x > world.width) { this.x -= world.width; }
        else if (this.x < 0) { this.x += world.width; }
        if (this.y > world.height) { this.y -= world.height; }
        else if (this.y < 0) { this.y += world.height; }

        if (Math.random() < 0.05) {
            this.setAngle(this.angle + Math.random() - 0.5)
        }
    }

    reproduce(world) {
        this.energy /= 2;
        const position = { x: this.x, y: this.y };
        const newGenome = this.getChildGenome();
        const child = world.addCreature(this.energy, newGenome, position);
        // Move child outside of parent
        const dr = 1 + this.r + child.r;
        child.x -= dr * this.dx;
        child.y -= dr * this.dy;
        child.dx = -this.dx
        child.dy = -this.dy
    }

    info() {
        const info = {
            Id: this.id,
            Age: this.age,
            Energy: this.energy,
            Speed: this.speed,
            Metabolism: this.metabolism,
        };
        return Object.assign(info, this._extra_info());
    }

    _extra_info() {
        return {};
    }

    _update(world) {}
}

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

// Basic world with food randomly appearing

// require ../simulations/simulation.js
// require ../organisms/bloops/Bloop.js
// require ./utils.js

class World {
    constructor(params) {
        this.width = params.width || WORLD_DEFAULTS.width;
        this.height = params.height || WORLD_DEFAULTS.height;

        this.creatureId = 0;
        this.time = 0;
        
        // Populate world with initial food
        this.food = [];
        this.foodProps = Object.assign(FOOD_DEFAULTS, params.food || {});
        this.addFood(this.foodProps.initialCount);
        
        // Populate world with initial creatures
        this.creatures = [];
        this.creatureProps = Object.assign(BLOOP_DEFAULTS, params.creatures || {});
        this.addCreatures(this.creatureProps.initialCount, this.creatureProps.energy);
    }

    update() {
        this.time++;
        this.growFood();
        this._detectBloopCollisions();
        updateObjects(this.creatures, this);
        this.removeDeadCreatures();
    }

    // Functions called during world.update
    growFood() {
        while (Math.random() < this.foodProps.growthRate) {
            this.addFood(1);
        }
    }

    _detectBloopCollisions() {
        const n = this.creatures.length;

        for (let i = 0; i < n; i++) {
            this.creatures[i].hitBloops = [];
        }

        // Create empty arrays on each bloop for each other bloop they collide with
        for (let i = 0; i < n - 1; i++) {
            const thisCreature = this.creatures[i];
            for (let j = i + 1; j < n; j++) {
                if (collide(thisCreature, this.creatures[j])) {
                    thisCreature.hitBloops.push(this.creatures[j]);
                    this.creatures[j].hitBloops.push(thisCreature);
                }
            }
        }
    }

    removeDeadCreatures() {
        for (let i = this.creatures.length; i--;) {
            if (this.creatures[i].dead) {
                this.creatures.splice(i, 1);
            }
        }
    }

    addFood(n) {
        for (let i = 0; i < n; i++) {
            const position = getRandomPositionUniform(this);
            const newFood = new Food(position, this.foodProps.energy, this.foodProps.r);
            this.food.push(newFood);
        }
    }

    // Add n randomly-positioned created with the same energy level
    addCreatures(n, energy) {
        for (let i = 0; i < n; i++) {
            this.addCreature(energy);
        }
    }

    addCreature(energy, genome, position) {
        position = position || getRandomPositionUniform(this);
        const creatureType = this.creatureProps.type;
        const newCreature = new creatureType(position, energy, genome, this.creatureProps);
        this.creatures.push(newCreature);
    
        // Save some additional data about the creature
        newCreature.id = this.creatureId++;
        newCreature.born = this.time;

        if (this.creatureRecorder) {
            this.creatureRecorder.record(newCreature);
        }

        return newCreature;
    }

    display(ctx) {
        displayObjects(this.food, ctx);
        displayObjects(this.creatures, ctx);
    }

    // Detect if there is a creature at a coordinate
    // Used to select a creature
    findCreatureAtCoord(x, y) {
        let selectedCreature;
  
        for (let i = 0; i < this.creatures.length; i++) {
            const creature = this.creatures[i];
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
}

/**********************************************************************
 * Simulation 1
 * 
 * Basic simulation withone creature type, moving at random, eating
 * food and reproducing when they have enough energy.
***********************************************************************/

// require ../worlds/world.js
// require ../organisms/bloops/Bloop.js

function start(params = {}) {
    params.creatures = params.creatures || {};
    params.creatures.type = Bloop;

    // Create world object
    const world = new World(params);

    // Create simulation to run and display the world
    const sim = new Simulation('bloop-sim', world);

    // Record the number of creatures and food so they can be downloaded
    sim.addRecorder('population', {
        Time: world => world.time,
        Food: world => world.food.length,
        Creatures: world => world.creatures.length,
    }, 100);

    // Record energy on simulation toolbar
    sim.addToToolbar('Energy', (world) => {
        let energy = world.food.length * world.foodProps.energy;
        energy += sum(world.creatures, 'energy');
        return Math.round(energy).toLocaleString();
    });
}

