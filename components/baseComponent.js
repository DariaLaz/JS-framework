import { generateRealDOMElement } from "../virtualDom/generateDOM/generateRealDOMElement";
import { patchDiff } from "../virtualDom/patchDiff";

class BaseComponent {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.virtualDomTree = null; // To store the previous VDOM tree
    this.realDomTree = null; // To store the previous Real DOM tree
  }

  /**
   * @returns {VirtualDOMElement | null}
   */
  render() {
    return null; // To be implemented by subclasses
  }

  // Updates the component's state and re-renders the DOM.
  setState(newState) {
    this.state = { ...this.state, ...newState };
    // TODO trigger rerender only on state change
    this.update();
  }

  generateVirtualDomTree() {
    const root = this.render();

    return root?.generateVirtualTree();
  }

  update() {
    // Първия път в attachTO се суздава дървото което ще пази стейтовете по нататък.
    // Тук създаваме ново дърво и го сравняваме със стартоот, като идеята е че ще модифицираме стартоо за да не загубим стейта на компонента.
    // Пачваме си дома какот си трябва и тн.

    const newTree = this.render();
    patchDiff(this.virtualDomTree, newTree, this.realDomTree);
    this.virtualDomTree = newTree;
  }

  // Attaches the component to a container in the Real DOM.
  attachTo(container) {
    this.virtualDomTree = this.render();
    this.realDomTree = generateRealDOMElement(this.virtualDomTree);

    if (!this.realDomTree) {
      return;
    }

    container.appendChild(this.realDomTree);
  }

  // Detaches the component from the Real DOM.
  detach() {
    if (this.realDomTree.parentNode) {
      this.realDomTree.parentNode.removeChild(this.realDomTree);
    }
  }
}

export default BaseComponent;

// TODO handle render of components inside components
// TODO maybe call recursively  render
