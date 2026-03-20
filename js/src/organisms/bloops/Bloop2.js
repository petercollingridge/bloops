// Bloop2 is like a Bloop except it has a gene controlling its size
// Its radius is the square root of its size.
// Size mutates when Bloop2s reproduce getting +1 or -1 50% of the time.

// require ./Bloop.js

class Bloop2 extends Bloop {
    constructor(position, energy, genome) {
        super(position, energy, genome);
        this.childType = Bloop2;
    }

    calculatePhenotype() {
        // Bloop2 has one gene that determines it's size
        this.r = Math.sqrt(this.genome);
        this.angle = Math.PI * Math.random();
    }

    getRandomGenome() {
        return [BLOOP_DEFAULTS.size];
    }

    getChildGenome() {
        // Mutations 25% chance of getting smaller and 25% chance of getting bigger
        const mutation = Math.random();
        if (mutation < 0.25 && this.genome > 1) {
            return this.genome - 1;
        } else if (mutation > 0.75) {
            return this.genome + 1;
        }
        return this.genome;
    }
}
