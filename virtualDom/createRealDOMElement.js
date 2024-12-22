import { isDOMEvent } from "./constants/EventListeners";
import { VirtualDOMElement } from "./VirtualDOMElement";

/**
 * @param {VirtualDOMElement} virtualDomElement
 * @returns {HTMLElement | Text}
 */
export function createRealDOMElement(virtualDomElement) {
  if (typeof virtualDomElement === "string") {
    // Text node rather than an HTML element
    return document.createTextNode(virtualDomElement);
  }

  const element = document.createElement(virtualDomElement.tag);

  if (virtualDomElement.props) {
    for (const key in virtualDomElement.props) {
      if (isDOMEvent(key)) {
        // TODO remove event listeners
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
