import { isDOMEvent } from "../constants/EventListeners";
import { VirtualTreeNode } from "../virtualDom/VirtualTreeNode";

/**
 * @param {VirtualTreeNode} virtualDomElement
 * @returns {HTMLElement | Text}
 */
function generateComponent(virtualDomElement) {
  function createHTMLElement() {
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

    virtualDomElement.children
      ?.map(generateRealDOMElement)
      .filter(Boolean)
      .forEach((child) => {
        element.appendChild(child);
      });

    element.id = virtualDomElement.key;

    return element;
  }

  /**
   * @returns {HTMLElement | Text}
   */
  function createCustomElement() {
    const componentInstance = new virtualDomElement.tag({
      ...virtualDomElement.props,
      children: virtualDomElement.children,
    });

    const virtualDomSubTree = componentInstance.render();

    return generateRealDOMElement(virtualDomSubTree);
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

/**
 * @param {VirtualTreeNode} virtualDomElement
 * @returns {HTMLElement | Text | null}
 */
export function generateRealDOMElement(virtualDomElement) {
  if (!virtualDomElement) {
    return null;
  }

  switch (typeof virtualDomElement) {
    case "string": {
      // create a Text node rather than an HTML element
      return document.createTextNode(virtualDomElement);
    }
    case "object": {
      return generateComponent(virtualDomElement);
    }
    default: {
      throw new Error(
        "Invalid virtual DOM element " +
          JSON.stringify(virtualDomElement, null, 2)
      );
    }
  }
}

// TODO patch when the element is custom
// TODO lifecycle methods
