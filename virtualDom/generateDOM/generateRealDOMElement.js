import { isDOMEvent } from "../constants/EventListeners";
import { VirtualTreeNode } from "../virtualDom/VirtualTreeNode";
import toDomEventName, { TEXT_TAG } from "../../utils/toDomEventName";

/**
 * @param {VirtualTreeNode} virtualDomElement
 * @returns {HTMLElement | Text}
 */
function generateComponent(virtualDomElement) {
  function createHTMLElement() {
    const element = document.createElement(virtualDomElement.tag);

    if (virtualDomElement.props) {
      for (const key in virtualDomElement.props) {
        const value = virtualDomElement.props[key];

        if (isDOMEvent(key)) {
          const eventName = toDomEventName(key);
          if (typeof value === "function")
            element.addEventListener(eventName, value);
          continue;
        }

        if (key === "nodeValue") {
          element.textContent = String(value ?? "");
          continue;
        }

        if (value === false || value === null || value === undefined) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, String(value));
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
    const scopedTree = virtualDomSubTree?.generateVirtualTree({
      parentKey: virtualDomElement.key,
      index: 0,
    });

    componentInstance.virtualDomTree = scopedTree;

    const dom = generateRealDOMElement(scopedTree);
    componentInstance.realDomTree = dom;

    return dom;
  }

  switch (typeof virtualDomElement.tag) {
    case "string": {
      if (virtualDomElement.tag === TEXT_TAG) {
        const span = document.createElement("span");
        span.textContent = virtualDomElement.props?.nodeValue ?? "";
        span.setAttribute("data-vtext", "1");
        span.id = virtualDomElement.key;
        span.setAttribute("data-key", String(virtualDomElement.key));

        return span;
      }

      // Normal HTML element
      return createHTMLElement();
    }
    case "function": {
      return createCustomElement(virtualDomElement);
    }
    default: {
      throw new Error(
        "Invalid tag type " + JSON.stringify(virtualDomElement, null, 2),
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
          JSON.stringify(virtualDomElement, null, 2),
      );
    }
  }
}
