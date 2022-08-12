// Top-level object for running and display the simulation

// require ./eventHandler.js
// require ../interface/Recorder.js
// require ../interface/Toolbar.js
// require ../interface/Infobox.js
// require ../interface/utils.js
// require ../helpers/utils.js
// require ../helpers/display.js


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
    this._buildControls();

    // Object update every tick of the simulation
    this.updateListeners = [this.world];

    // Object update every tick of the simulation
    this.displayListeners = [this.toolbar, this.infobox];

    // Display now to show simulation before the first update runs
    this.display();
};

Simulation.prototype._addCanvas = function(container, world, width, height) {
    this.offsetX = 0;
    this.offsetY = 0;
    let dragging = false;
    let mouseX;
    let mouseY;

    width = width || world.width;
    height = height || world.height;

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
};

Simulation.prototype._buildControls = function() {
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
        updateObjects(this.updateListeners);
    }
};

Simulation.prototype.display = function() {
    updateObjects(this.displayListeners);

    this.ctx.clearRect(0, 0, this.world.width, this.world.height);
    this.ctx.translate(-this.offsetX, -this.offsetY);

    this.world.display(this.ctx);

    if (this.selectedCreature) {
        const {x, y, r} = this.selectedCreature;
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
    this.display();
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
