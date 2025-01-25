import { generateRealDOMElement } from "../generateDOM/generateRealDOMElement";
import { PatchType } from "./PatchType";

export class CreatePatch {
  type = PatchType.CREATE;

  constructor(virtualNode) {
    this.virtualNode = virtualNode;
  }

  /**
   *
   * @param {VirtualDOMElement} virtualNode
   * @returns {CreatePatch}
   */
  static create(virtualNode) {
    return new CreatePatch(virtualNode);
  }

  /**
   *
   * @param {HTMLElement} node
   */
  apply(node) {
    const element = generateRealDOMElement(this.virtualNode);

    if (!element) {
      return;
    }

    node.appendChild(element);
  }
}
