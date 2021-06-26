// Top-level object for running and display the simulation

// require ../interface/Recorder.js
// require ../interface/Toolbar.js
// require ../helpers/utils.js
// require ../helpers/display.js


const Simulation = function(id, world) {
    const container = document.getElementById(id);
    if (!container) {
        console.error('No element found with id ' + id);
        return;
    }

    this.world = world;
    this.updateSpeed = 1;
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

    // Speed slider
    const sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = `Speed: ${this.updateSpeed}`;
    sliderLabel.setAttribute('for', 'speed-control');
    sliderLabel.style.cssText = 'padding-top: 0.5rem;';
    this.controls.appendChild(sliderLabel); 

    const speedSlider = document.createElement('input');
    speedSlider.setAttribute('type', 'range');
    speedSlider.setAttribute('id', 'speed-control');
    speedSlider.setAttribute('value', this.updateSpeed);

    speedSlider.style.cssText = 'margin-bottom: 0.5rem;';
    speedSlider.addEventListener('input', (evt) => {
        this.updateSpeed = evt.target.value;
        sliderLabel.innerHTML = `Speed: ${this.updateSpeed}`;
    });
    this.controls.appendChild(speedSlider);
};

Simulation.prototype.addRecorder = function(keys, interval) {
    interval = interval || 50;
    const recorder = new Recorder(keys, interval, this.world);
    this.updateListeners.push(recorder);

    const downloadLink = document.createElement('button');
    downloadLink.innerHTML = "Download";
    downloadLink.addEventListener('click', recorder.download.bind(recorder));
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
