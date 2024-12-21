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
    Object.keys(virtualDomElement.props).forEach((key) => {
      // TODO: add event listener array and refacotr
      if (key.startsWith("on")) {
        element.addEventListener(
          key.slice(2).toLowerCase(),
          virtualDomElement.props[key]
        );
      } else {
        element.setAttribute(key, virtualDomElement.props[key]);
      }
    });
  }

  virtualDomElement.children?.forEach((child) => {
    element.appendChild(createRealDOMElement(child));
  });

  return element;
}
