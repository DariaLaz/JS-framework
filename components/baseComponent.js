import { generateRealDOMElement } from "../virtualDom/generateDOM/generateRealDOMElement";
import { applyVirtualDOMDifferences } from "../virtualDom/VirtualDOMDifference/applyVirtualDOMDifferences";
import { shallowEqual } from "../utils/shallowEqual";
import { CHILD_SECRET_KEY } from "../virtualDom/virtualDom/VirtualDOMElement";

class BaseComponent {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.virtualDomTree = null; // To store the previous VDOM tree
    this.realDomTree = null; // To store the previous Real DOM tree
    this.effectHooks = [];
    this.effectIndex = 0;
    this.isMounted = false;
  }

  /**
   * Renders the component and returns its virtual DOM representation.
   * @returns {VirtualDOMElement | null} - The virtual DOM element for this component.
   * @throws {Error} If the method is not implemented.
   */
  render() {
    throw new Error("Method not implemented.");
  }

  useEffect(callback, dependencies) {
    const index = this.effectIndex++;
    if (index >= this.effectHooks.length) {
      this.effectHooks.push({
        callback,
        cleanup: null,
        dependencies,
        oldDependencies: null,
      });
    } else {
      this.effectHooks[index].callback = callback;
      this.effectHooks[index].dependencies = dependencies;
    }
  }

  runEffects() {
    this.runningEffects = true;

    for (const effect of this.effectHooks) {
      const depsChanged =
        !effect.oldDependencies ||
        !shallowEqual(effect.oldDependencies, effect.dependencies);

      if (depsChanged) {
        if (typeof effect.cleanup === "function") {
          effect.cleanup();
        }

        effect.cleanup = effect.callback();
        effect.oldDependencies = effect.dependencies
          ? [...effect.dependencies]
          : null;
      }
    }

    this.runningEffects = false;

    if (this.pendingStateFromEffects) {
      const pendingState = this.pendingStateFromEffects;
      this.pendingStateFromEffects = null;
      this.setState(pendingState);
    }
  }

  /**
   * Merges the provided partial state with the existing state, then triggers a component update if needed.
   * @param {Object} partialState - The new partial state to merge into the component’s current state.
   */
  setState(partialState) {
    if (this.runningEffects) {
      this.pendingStateFromEffects = {
        ...(this.pendingStateFromEffects ?? {}),
        ...partialState,
      };
      return;
    }

    const newState = { ...this.state, ...partialState };

    if (shallowEqual(this.state, newState)) {
      return;
    }

    this.state = newState;
    this.update();
  }

  /**
   * Generates and returns the latest virtual DOM tree for the component.
   * @returns {Object | null} - The newly generated virtual DOM tree, or null if none.
   */
  generateVirtualDomTree() {
    this.effectIndex = 0;
    const root = this.render();

    if (!root) return null;

    const currentKey = this.virtualDomTree?.key;

    if (currentKey && currentKey.includes(`.${CHILD_SECRET_KEY}.`)) {
      const marker = `.${CHILD_SECRET_KEY}.`;
      const pos = currentKey.lastIndexOf(marker);

      const parentKey = currentKey.slice(0, pos);
      const indexStr = currentKey.slice(pos + marker.length);
      const index = Number(indexStr);

      return root.generateVirtualTree({ parentKey, index });
    }

    return root.generateVirtualTree();
  }

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

    const updatedRealRoot = applyVirtualDOMDifferences(
      this.virtualDomTree,
      newVirtualTree,
      this.root,
    );

    if (updatedRealRoot) {
      this.realDomTree = updatedRealRoot;
    }

    this.virtualDomTree = newVirtualTree;
    this.runEffects();
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
    this.realDomTree = realDomTree;
    this.runEffects();
  }
}

export default BaseComponent;
