// Object for recording values about the world and downloading as a tab-delimited file
// Every interval it saves data about the world into an array which can be downloaded

const writeLine = (arr) => arr.join('\t') + '\n';

class Recorder {
    constructor(fields, interval, world) {
        this.fields = fields;
        this.fieldNames = Object.keys(fields);
        this.interval = interval;
        this.world = world;

        // Map field name to an array of data
        this.data = {};
        this.fieldNames.forEach(fieldName => {
            this.data[fieldName] = [];
        });
        this.dataLength = 0;
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
        let results = writeLine(this.fieldNames);
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
