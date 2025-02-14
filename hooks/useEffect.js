import hookManager from "./hookManager";
import { shallowEqual } from "../utils/shallowEqual";
import deepClone from "../utils/deepClone";

/**
 * Represents a single effect hook.
 * @class
 * @param {() => void} callback
 * @param {Array} dependencies
 * 
 */
class Effect {
  constructor(callback, dependencies) {
    this.callback = callback;
    this.clearup = null;
    this.dependencies = dependencies;
    this.oldDependencies = null;

    hookManager.addHook(this);
  }

  /**
   * Compares the current dependencies to the old dependencies. If they are different, the effect is run.
   * 
   * @returns {void}
   */
  use() {
    if (
      !this.oldDependencies ||
      !shallowEqual(this.oldDependencies, this.dependencies)
    ) {
      if (this.clearup) {
        this.clearup();
      }
      this.clearup = this.callback();

      this.oldDependencies = deepClone(this.dependencies);
    }
  }
}

/**
 * Creates a new effect hook.
 * @param {() => void} callback
 * @param {Array} dependencies
 * @returns {Effect}
 */ 
export function useEffect(callback, dependencies) {
  return new Effect(callback, dependencies);
}