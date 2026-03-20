# Outline

## Bloops 1: Basic creature simulation

### Set up

 - Food appears at random
 - Bloops move at random, eating it, splitting when they reach a threshold

### Results

  - Chart of food and bloop populations over time

### Analysis

  - Predict stable populations of food and bloops
  - What affects size of oscillations?
  - Effect of slower creatures in a larger world
  - Effect of more food with less energy

 ## Bloops 2: Adding genetics

 ### Set up

  - Same as Bloops 1 plus a gene to control size with chance of mutation
  - Increased size means increased chance of hitting food

### Results

  - Chart of food and bloop populations over time
  - Add line of mean size over time (add range of sizes)

### Analysis

  - Bloops evolve to be bigger so they get more food - obviously
  - Effect of mutation bias toward smaller sizes

## Bloops 3: Balancing genes

 ### Set up

  - Same as Bloops 2 but larger Bloops are now slower
  - Now there is a trade off between getting bigger

### Results

  - Chart of Bloop size and distribution over time

### Analysis

  - Predict expected size of Bloops
  - How does this change based on size of world or amount of food?

## Bloops 4: Metabolism / Evolutionary stable strategies / Evolutionary stable strategies

 ### Set up

  - Same as Bloops 3 plus a gene for metabolism
  - Bloops can spend energy to move faster
    - Low metabolism + small => medium speed, low energy gain
    - Low metabolism + large => slow, medium energy gain
    - High metabolism + small => faster, medium energy gain
    - High metabolism + large => medium speed, high energy gain

### Results

  - Chart of Bloop size and distribution over time
  - Try to define/identify species

### Analysis

  - Predict expected evolutionary stable strategies

## Bloops 5: Child energy

 ### Set up

  - Same as Bloops 4 plus a gene for energy threshold before splitting
    - Maybe should be based on Bloops 1
  - Bloops with a lower threshold have more children, but a lower energy store

### Results

  - Chart of Bloop genes and population size over time

### Analysis

  - Can we predict the optimum value?
  - What does it depend on?
