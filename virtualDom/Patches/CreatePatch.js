import { createRealDOMElement } from "../createRealDOMElement";
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
    node.appendChild(createRealDOMElement(this.virtualNode));
  }
}
