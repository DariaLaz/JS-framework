import { diff, patch, renderElement } from "./virtualDom.js";

class BaseComponent {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.root = document.createElement("div");
    this.oldTree = null; // To store the previous VDOM tree
  }

  // Return an instance of DOMElement or a string for text nodes.
  render() {
    return null; // To be implemented by subclasses
  }

  // Updates the component's state and re-renders the DOM.
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  update() {
    const newTree = this.render();
    const patches = diff(this.oldTree, newTree);
    patch(this.root, patches);
    this.oldTree = newTree;
  }

  // Attaches the component to a container in the Real DOM.
  attachTo(container) {
    this.oldTree = this.render();
    const element = renderElement(this.oldTree);
    this.root.appendChild(element);
    container.appendChild(this.root);
  }

  // Detaches the component from the Real DOM.
  detach() {
    if (this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
  }
}

export default BaseComponent;
