import { createRealDOMElement } from "../createRealDOMElement";
import { VirtualDOMElement } from "../VirtualDOMElement";
import { PatchType } from "./PatchType";

export class ReplacePatch {
  type = PatchType.REPLACE;

  constructor(virtualNode) {
    this.virtualNode = virtualNode;
  }

  /**
   *
   * @param {VirtualDOMElement} virtualNode
   * @returns {ReplacePatch}
   */
  static create(virtualNode) {
    return new ReplacePatch(virtualNode);
  }

  /**
   *
   * @param {HTMLElement} node
   */
  apply(node) {
    node.parentNode.replaceChild(createRealDOMElement(this.virtualNode), node);
  }
}
