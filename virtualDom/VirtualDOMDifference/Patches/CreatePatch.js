import { generateRealDOMElement } from "../../generateDOM/generateRealDOMElement";

export class CreatePatch {
  constructor(parentKey, virtualNode, index) {
    this.parentKey = parentKey;
    this.virtualNode = virtualNode;
    this.index = index;
  }
  /**
   *
   * @returns {CreatePatch}
   */
  static create(parentKey, virtualNode, index) {
    return new CreatePatch(parentKey, virtualNode, index);
  }

  /**
   * @param {HTMLElement} root
   * @returns {HTMLElement}
   */
  apply(root) {
    const parent = document.getElementById(String(this.parentKey));

    if (!parent) {
      throw new Error(`CreatePatch: parent not found by id=${this.parentKey}`);
    }

    const element = generateRealDOMElement(this.virtualNode);
    if (!element) return;

    const before = parent.childNodes[this.index] ?? null;
    parent.insertBefore(element, before);

    return element;
  }
}
