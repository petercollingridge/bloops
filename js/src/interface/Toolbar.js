function getToolbarItem(itemName, toolbarElement, getValue) {
  const itemElement = createElement('span')
    .addClass('toolbar-item')
    .text(itemName)
    .addTo(toolbarElement);

  const obj = {
    update: (world) => {
      const value = getValue(world);
      itemElement.text(`${itemName}: ${value}`); 
    }
  };

  return obj;
}

function getToolbar(container) {
  const defaultItems = {
    Time: world => world.numTicks,
    Creatures: world => world.creatures.length,
    Food: world => world.food.length,
  };

  const toolbarElement = createElement('div')
    .addClass('toolbar')
    .addTo(container);

  const _items = [];

  const obj = {
    element: toolbarElement,
    addItem: (name, getValue) => {
      const newItem = getToolbarItem(name, toolbarElement, getValue);
      _items.push(newItem);
    },
    update: (world) => {
      _items.forEach((item) => {
        item.update(world);
      });
    }
  }

  for (const item in defaultItems) {
    obj.addItem(item, defaultItems[item]);
  }

  return obj;
}
