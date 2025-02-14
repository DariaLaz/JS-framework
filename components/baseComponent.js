import { generateRealDOMElement } from "../virtualDom/generateDOM/generateRealDOMElement";
import { applyVirtualDOMDifferences } from "../virtualDom/VirtualDOMDifference/applyVirtualDOMDifferences";
import { shallowEqual } from "../utils/shallowEqual";

class BaseComponent {
  /**
   * Constructs a new BaseComponent instance, initializing props and state.
   * @constructor
   * @param {Object} [props={}] - The initial properties for the component.
   */
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.virtualDomTree = null; // To store the previous VDOM tree
    this.realDomTree = null; // To store the previous Real DOM tree
  }

  /**
   * Renders the component and returns its virtual DOM representation.
   * @returns {VirtualDOMElement | null} - The virtual DOM element for this component.
   * @throws {Error} If the method is not implemented.
   */
  render() {
    throw new Error("Method not implemented.");
  }

  /**
   * Merges the provided partial state with the existing state, then triggers a component update if needed.
   * @param {Object} partialState - The new partial state to merge into the component’s current state.
   */
  setState(partialState) {
    console.log(this.state)
    const newState = { ...this.state, ...partialState };

    if (shallowEqual(this.state, newState)) {
      return;
    }

    this.state = newState;
    console.log(newState)
    this.update();
  }

  /**
   * Generates and returns the latest virtual DOM tree for the component.
   * @returns {Object | null} - The newly generated virtual DOM tree, or null if none.
   */
  generateVirtualDomTree() {
    const root = this.render();

    return root?.generateVirtualTree();
  }

  // TODO Custom Components pass root to children somehow
  // handle render of components inside components;
  // maybe call recursively render
  // Първия път в attachTO се суздава дървото което ще пази стейтовете по нататък.
  // Тук създаваме ново дърво и го сравняваме със стартоот, като идеята е че ще модифицираме стартоо за да не загубим стейта на компонента.
  // Пачваме си дома какот си трябва и тн.
  /**
   * Updates the component by generating a new virtual DOM tree and applying any calculated differences.
   */
  update() {
    const newVirtualTree = this.generateVirtualDomTree();

    applyVirtualDOMDifferences(this.virtualDomTree, newVirtualTree, this.root);
    this.virtualDomTree = newVirtualTree;
  }

  /**
   * Attaches the current component to an existing DOM element.
   * @param {HTMLElement} root - The DOM element to contain the component’s rendered output.
   */
  attachTo(root) {
    this.root = root;
    this.virtualDomTree = this.generateVirtualDomTree();

    const realDomTree = generateRealDOMElement(this.virtualDomTree);

    if (!realDomTree) {
      return;
    }

    this.root.appendChild(realDomTree);
  }

  /**
   * Detaches the component from the DOM.
   */
  detach() {
    if (this.realDomTree.parentNode) {
      this.realDomTree.parentNode.removeChild(this.realDomTree);
    }
  }
}

export default BaseComponent;
