// Bloop4 is a Bloop with a gene controlling its spikiness
// The more spiky, the the more damage it deals when it hits another bloop.
//  - Gene 0: spikiness

// require ./Bloop.js

class Bloop6 extends Bloop {
    constructor(position, energy, genome) {
        super(position, energy, genome);
        this.childType = Bloop6;
    }
    static getRandomGenome() {
        return [randomInRange(1, 100)];
    }
    calculatePhenotype() {
        this.r = 3;
        this.speed = 1.5;
        this.spikiness = this.genome[0];
    }
    getChildGenome() {
        const childGenome = this.genome.map(gene => mutate(gene));
        return childGenome;
    }
    getColour() {
        // Colour varies from blue (not spiky) to red (most spiky)
        // The less energy the bloop has, the darker the colour
        const energy = Math.max(0, Math.min(1, this.energy / 500));
        const red = energy * 255 * Math.min(1, this.spikiness / 50);
        const blue = energy * 255 * Math.min(1, (100 - this.spikiness) / 50);

        return `rgba(${red}, 0, ${blue}, 128)`;
    }
    _extra_info() {
        return { Spikiness: this.genome[0] };
    }
}
