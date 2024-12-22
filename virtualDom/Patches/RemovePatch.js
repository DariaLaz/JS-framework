import { PatchType } from "./PatchType";

export class RemovePatch {
  type = PatchType.REMOVE;
  static create() {
    return new RemovePatch();
  }

  /**
   *
   * @param {HTMLElement} node
   */
  apply(node) {
    node.parentNode.removeChild(node);
  }
}
