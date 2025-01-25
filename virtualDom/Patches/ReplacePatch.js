import { generateRealDOMElement } from "../generateDOM/generateRealDOMElement";
import { VirtualDOMElement } from "../virtualDom/VirtualDOMElement";
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
    const element = generateRealDOMElement(this.virtualNode);

    if (!element) {
      return;
    }

    node.parentNode.replaceChild(element, node);
  }
}
