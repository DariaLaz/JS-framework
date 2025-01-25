import { selectElement } from "../../../utils/selectElement";

export class RemovePatch {
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
    const node = selectElement(root, this.id);
    root.removeChild(node);

    return null;
  }
}
