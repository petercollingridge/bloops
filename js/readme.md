# Introduction

Simulation of organisms moving around, eating food and evolving.
More details and analysis of the reults [on my blog](https://www.petercollingridge.co.uk/blog/alife/ecosystem-simulation/).

# Running the simulation

Open `index.html` in a browser.
`index.html` uses the non-bundled js files so is useful for developing.
The `sim-n.html` files have bundled files for the different worlds.

# Building up the simulation

- Basic simulation: creatures eating food
  - Look at stable population size
  - Investigate changing world size and creature speed
- Gene for size
  - Creatures evolve to get bigger
  - Investigate mutation rate and selection pressure
- Add cost to size
  - Create evolve to a stable size
- Add gene for metabolism
  - Two (or more) possible stable populations
- Add gene for spikes
  - Do spiky parents hurt their children?
- Spikes allow creatures steal energy
  - Prisoner's Dilemma - everyone evolves spikes?
  - Does changing speed make a difference?
- Add cost for spikes
  - What happens?
- Add shields
  - What strategies are viable?

## Bundling the js

Note. I'm no longer using bundle.js to bundle code.

Now I use bundle.py in the js folder, which is a very crude way to concatenate all the JS files.

The js files are in the /src folder in separate files.
To bundle them into a single js file,
run `npx bundle-js ./src/simulations/sim-1.js -o ./examples/bundles/bundle-1.js`
while in bloops/js.
You can then import just the bundle-1.js file.
