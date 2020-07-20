// Top-level object for running and display the simulation

// require ./Recorder.js
// require ./world.js
// require ./display.js


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
