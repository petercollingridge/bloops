# Introduction

Simulation of organisms moving around, eating food and evolving.
More details and analysis of the reults [on my blog](https://www.petercollingridge.co.uk/blog/alife/ecosystem-simulation/).

# Running the simulation

Open `index.html` in a browser.
`index.html` uses the non-bundled js files so is useful for developing.
The `sim-n.html` files have bundled files for the different worlds.

## Bundling the js

The js files are in the /src folder in separate files.
To bundle them into a single js file,
run `npx bundle-js ./src/simulations/sim-1.js -o ./examples/bundles/bundle-1.js`
while in bloops/js.
You can then import just the bundle-1.js file.
