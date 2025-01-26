// Bloop3 is like a Bloop except it has a gene controlling its size
// Its radius is the square root of its size.
// The larger they are, the slower they move
// Size mutates when Bloop3s reproduce getting +1 or -1 50% of the time.

// require ./Bloop.js

class Bloop3 extends Bloop {
    constructor(position, energy, genome) {
        super(position, energy, genome);
        this.childType = Bloop3;
    }
    calculatePhenotype() {
        this.r = Math.sqrt(this.genome);
        this.speed = (101 - this.genome) * 0.005;
        this.angle = Math.PI * Math.random();
    }
    getChildGenome() {
        const mutation = Math.random();
        if (mutation < 0.25 && this.genome < 100) {
            return this.genome + 1;
        } else if (mutation < 0.50 && this.genome > 1) {
            return this.genome - 1;
        }
        return this.genome;
    }
}
