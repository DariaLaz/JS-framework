import { selectElement } from "../../../utils/selectElement";
import { BasePatch } from "./BasePatch";

export class NodePatch {
  /**
   *
   * @param {string} key
   * @param {BasePatch} elementPatch
   * @param {NodePatch[]} childrenPatches
   * @returns {NodePatch}
   */
  constructor(key, elementPatch, childrenPatches) {
    this.key = key;
    this.elementPatch = elementPatch;
    this.childrenPatches = childrenPatches;
  }

  /**
   * @param {{key: string| undefined, elementPatch: BasePatch | undefined, childrenPatches: NodePatch[] | undefined}} param0
   * @returns {NodePatch}
   */
  static create({ key, elementPatch, childrenPatches }) {
    return new NodePatch(key, elementPatch, childrenPatches);
  }

  /**
   * @param {HTMLElement} root
   */
  apply(root) {
    const domElement =
      this.elementPatch?.apply(root) ??
      (this.key ? selectElement(root, this.key) : undefined);

    if (!domElement || !this.childrenPatches) {
      return;
    }

    this.childrenPatches.forEach((childPatch) => {
      childPatch.apply(domElement);
    });
  }
}
