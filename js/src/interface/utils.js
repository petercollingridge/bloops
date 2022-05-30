function createElement(tag) {
    const element = document.createElement(tag);

    const obj = {
        element,
        attr: (attributes) => {
            for (const key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
            return obj;
        },
        addClass: (className) => {
          element.classList.add(className);
          return obj;
        },
        addElement(tag) {
            const childElement = createElement(tag).addTo(this);
            return childElement;
        },
        addEventListener: (type, func) => {
            element.addEventListener(type, func);
            return obj;
        },
        text: (text) => {
            element.innerHTML = text;
            return obj;
        },
        css: (styles) => {
            let cssString = ''
            for (const key in styles) {
                cssString += `${key}: ${styles[key]};`;
            }
            element.style.cssText = cssString;
            return obj;
        },
        addTo: (parent) => {
            parent.appendChild(element);
            return obj;
        },
        appendChild: (child) => {
            element.appendChild(child);
            return obj;
        }
    };

    return obj;
}