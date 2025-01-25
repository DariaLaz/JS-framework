import { generateRealDOMElement } from "../../generateDOM/generateRealDOMElement";
import { VirtualTreeNode } from "../../virtualDom/VirtualTreeNode";

export class CreatePatch {
  constructor(virtualNode, index) {
    this.virtualNode = virtualNode;
    this.index = index;
  }

  /**
   *
   * @param {VirtualTreeNode} virtualNode
   * @returns {CreatePatch}
   */
  static create(virtualNode, index) {
    return new CreatePatch(virtualNode, index);
  }

  /**
   * @param {HTMLElement} root
   * @returns {HTMLElement}
   */
  apply(root) {
    const element = generateRealDOMElement(this.virtualNode);

    if (!element) {
      return;
    }

    if (this.index < root.childNodes.length) {
      root.insertBefore(element, root.childNodes[this.index]);
    } else {
      root.appendChild(element);
    }

    return element;
  }
}
