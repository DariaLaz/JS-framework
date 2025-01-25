import { generateRealDOMElement } from "../generateDOM/generateRealDOMElement";
import { VirtualTreeNode } from "../virtualDom/VirtualTreeNode";
import { PatchType } from "./PatchType";

export class ReplacePatch {
  type = PatchType.REPLACE;

  constructor(oldNode, newNode) {
    this.oldNode = oldNode;
    this.newNode = newNode;
  }

  /**
   *
   * @param {VirtualTreeNode} oldNode
   * @param {VirtualTreeNode} newNode
   * @returns {ReplacePatch}
   */
  static create(oldNode, newNode) {
    return new ReplacePatch(oldNode, newNode);
  }

  /**
   *
   * @param {HTMLElement} node
   * @returns {HTMLElement}
   */
  apply(root) {
    const element = generateRealDOMElement(this.newNode);

    const oldElement = root.querySelector(`[id="${this.oldNode.key}"]`);

    if (!element) {
      return;
    }

    root.replaceChild(element, oldElement);

    return element;
  }
}
