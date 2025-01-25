import { PatchType } from "./PatchType";

export class RemovePatch {
  type = PatchType.REMOVE;

  constructor(id) {
    this.id = id;
  }

  /**
   * @param {string} id
   * @returns {RemovePatch}
   */
  static create(id) {
    return new RemovePatch(id);
  }

  /**
   *
   * @param {HTMLElement} root
   */
  apply(root) {
    const node = root.querySelector(`[id="${this.id}"]`);
    root.removeChild(node);

    return null;
  }
}
