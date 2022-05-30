// Top-level object for running and display the simulation

// require ./eventHandler.js
// require ../interface/Recorder.js
// require ../interface/Toolbar.js
// require ../interface/utils.js
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
    this.toolbar = getToolbar(container, world);
    this._buildControls(container);

    // Create canvas
    const canvas = createElement('canvas')
      .attr({ width: world.width, height: world.height })
      .addClass('main')
      .addTo(container);

    this.ctx = canvas.element.getContext('2d');
    this.updateListeners = [world, this.toolbar];
    this.display();
};

Simulation.prototype._buildControls = function(container) {
    this.controls = document.createElement('div');
    this.controls.classList.add('sidebar');
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
    const sliderLabel = createElement('label')
      .attr({ for: 'speed-control' })
      .text(`Speed: ${this.updateSpeed}`)
      .css({ 'padding-top': '0.5rem' })
      .addTo(this.controls);

    const speedSlider = createElement('input').attr({
      type: 'range',
      id: 'speed-control',
      value: this.updateSpeed
    }).addTo(this.controls);

    speedSlider.element.addEventListener('input', (evt) => {
        this.updateSpeed = evt.target.value;
        sliderLabel.innerHTML = `Speed: ${this.updateSpeed}`;
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
    for (let i = 0; i < this.updateSpeed; i++) {
        updateObjects(this.updateListeners);
    }
    this.display();
};

Simulation.prototype.display = function() {
    this.ctx.clearRect(0, 0, this.world.width, this.world.height);
    this.ctx.rect(0, 0, this.world.width, this.world.height);
    this.world.display(this.ctx);
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
