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
        console.log(this.data);
    }
};

Recorder.prototype.download = function() {
    download(this.data
        .map(([creatures, food]) => `${creatures}\t${food}`)
        .join('\n'));
};
