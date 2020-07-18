// Object for recording values about the world and downloading as a tab-delimited file


const Recorder = function (keys, interval, world) {
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
