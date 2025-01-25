import { VirtualTreeNode } from "../virtualDom/VirtualTreeNode";
import { generateNodePatch } from "./generateNodePatch";

/**
 *
 * @param {VirtualTreeNode} oldTree
 * @param {VirtualTreeNode} newTree
 * @param {DOMElement} root
 */
export function applyVirtualDOMDifferences(oldTree, newTree, root) {
  const patch = generateNodePatch(oldTree, newTree);

  console.log(patch);

  patch?.apply(root);
}
