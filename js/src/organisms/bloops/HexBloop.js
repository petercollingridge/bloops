/*
* A hexagonal cell
* Each of its six sides can have an eye, a fin or nothing.
*/

// require ./Bloop.js

// Inputs for sides 1 - 6
const HEX_SIDES = [[0,1,1], [1,1,0], [1,-1,0], [0,-1,-1], [-1,-1,0], [-1,1,0]];

const HexBloop = function(position, energy, genome) {
  Bloop.call(this, position, energy, genome);
  this.childType = HexBloop;
};
HexBloop.prototype = Object.create(Bloop.prototype);

HexBloop.prototype.calculatePhenotype = function() {
  this.angle = Math.PI * Math.random();

};