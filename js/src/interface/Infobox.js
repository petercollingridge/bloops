function getInfobox(simulation) {
  const infoBoxElement = createElement('div')
    .addClass('infobox')
    .addTo(simulation.controls);

  let textNodes = [];

  const clear = () => {
    textNodes.forEach((box) => {
      box.text('');
    });
  }

  const obj = {
    element: infoBoxElement,
    update: () => {
      if (simulation.selectedCreature) {
        if (simulation.selectedCreature.dead) {
          simulation.selectedCreature = false;
          clear();
        } else {
          // Clear any current info
          infoBoxElement.textContent = '';

          const info = simulation.selectedCreature.info();
          Object.entries(info).map(([key, value], index) => {
            let child = textNodes[index];
  
            // Create child if it doesn't exist
            if (!child) {
              child = createElement('div').addTo(infoBoxElement);
            }
            textNodes.push(child);
            
            child.text(`${key}: ${Math.round(value * 1e6) / 1e6}`)
          })
        }
      }
    }
  };

  return obj;
}