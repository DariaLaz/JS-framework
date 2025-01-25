import { isDOMEvent } from "./constants/EventListeners";
import { VirtualDOMElement } from "./VirtualDOMElement";

function createHTMLElement(virtualDomElement) {
  const element = document.createElement(virtualDomElement.tag);

  if (virtualDomElement.props) {
    for (const key in virtualDomElement.props) {
      if (isDOMEvent(key)) {
        element.addEventListener(key, virtualDomElement.props[key]);
      } else {
        element.setAttribute(key, virtualDomElement.props[key]);
      }
    }
  }

  virtualDomElement.children?.forEach((child) => {
    element.appendChild(createRealDOMElement(child));
  });

  return element;
}

function createCustomElement(virtualDomElement) {
  const element = new virtualDomElement.tag({
    ...virtualDomElement.props,
    children: virtualDomElement.children,
  });

  const virtualDomSubTree = element.render();

  return createRealDOMElement(virtualDomSubTree);
}

/**
 * @param {VirtualDOMElement} virtualDomElement
 * @returns {HTMLElement | Text}
 */
export function createRealDOMElement(virtualDomElement) {
  if (typeof virtualDomElement === "string") {
    // Text node rather than an HTML element
    return document.createTextNode(virtualDomElement);
  }

  switch (typeof virtualDomElement.tag) {
    case "string": {
      return createHTMLElement(virtualDomElement);
    }
    case "function": {
      return createCustomElement(virtualDomElement);
    }
    default: {
      throw new Error(
        "Invalid tag type " + JSON.stringify(virtualDomElement, null, 2)
      );
    }
  }
}
