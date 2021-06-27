// Object for recording values about the world and downloading as a tab-delimited file
// Every interval it saves data about the world into an array which can be downloaded

const Recorder = function (keys, interval, world) {
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
// Every tick it tests whether the creature has been saved before
// Would be more efficient to only save creatures when they are created
const CreatureRecorder = function(keys, creatures) {
    this.keys = keys;
    this.creatures = creatures;
    this.data = [];
}

CreatureRecorder.prototype.update = function() {
    for (let i = 0; i < this.creatures.length; i++) {
        const creature = this.creatures[i];
        if (creature.id > this.data.length) {
            this.data.push(creature);
        }
    }
};

CreatureRecorder.prototype.download = function() {
    let results = '';
    this.data.forEach(creature => {
        results += this.keys.map(key => creature[key]).join('\t') + '\n';
    });
    download(results);
};


function download(data, filename="data.txt") {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
