import { selectElement } from "../../../utils/selectElement";
import { generateRealDOMElement } from "../../generateDOM/generateRealDOMElement";
import { VirtualTreeNode } from "../../virtualDom/VirtualTreeNode";

export class ReplacePatch {
  constructor(oldNodeId, newNode) {
    this.oldNodeId = oldNodeId;
    this.newNode = newNode;
  }

  /**
   *
   * @param {string} oldNodeId
   * @param {VirtualTreeNode} newNode
   * @returns {ReplacePatch}
   */
  static create(oldNodeId, newNode) {
    return new ReplacePatch(oldNodeId, newNode);
  }

  /**
   *
   * @param {HTMLElement} node
   * @returns {HTMLElement}
   */
  apply(root) {
    const element = generateRealDOMElement(this.newNode);

    const oldElement = selectElement(root, this.oldNodeId);

    if (!element) {
      return;
    }

    root.replaceChild(element, oldElement);

    return element;
  }
}
