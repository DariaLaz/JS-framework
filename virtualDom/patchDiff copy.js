import { PatchType } from "./Patches/PatchType";
import { PropsPatch } from "./Patches/PropsPatch";
import { TextPatch } from "./Patches/TextPatch";
import { CreatePatch } from "./Patches/CreatePatch";
import { RemovePatch } from "./Patches/RemovePatch";
import { ReplacePatch } from "./Patches/ReplacePatch";
import { BasePatch } from "./Patches/BasePatch";

/**
 * Diff function to compare two VDOM trees and generate patches.
 * Inspiration: https://medium.com/@ruchivora16/react-how-react-works-under-the-hood-9b621ee69fb5
 * @param {DOMElement | null} currentTree
 * @param {DOMElement | null} newTree
 * @returns {BasePatch[]}
 */
function getPatches(currentTree, newTree) {
  const patches = {};
  let patchIndex = 0;

  // Depth-first traversal to compare nodes and generate patches.
  function dfs(currentNode, newNode, index) {
    if (!currentNode && newNode) {
      patches[index] = CreatePatch.create(newNode);
      return;
    }

    if (currentNode && !newNode) {
      patches[index] = RemovePatch.create();
      return;
    }

    if (typeof currentNode === "string" && typeof newNode === "string") {
      patches[index] = TextPatch.create(currentNode, newNode);
      return;
    }

    if (currentNode.tag !== newNode.tag) {
      patches[index] = ReplacePatch.create(newNode);
      return;
    }

    // Same tag, check for props and children
    patches[index] = PropsPatch.create(currentNode.props, newNode.props);

    const maxChildrenLength = Math.max(
      currentNode.children.length,
      newNode.children.length
    );

    for (let i = 0; i < maxChildrenLength; i++) {
      patchIndex += 1;
      dfs(currentNode.children[i], newNode.children[i], patchIndex);
    }
  }

  dfs(currentTree, newTree, patchIndex);
  return patches;
}

/**
 * Apply patches to the Real DOM.
 * @param {DOMElement} parent
 * @param {BasePatch[]} patches
 */
function patch(parent, patches) {
  let currentIndex = 0;

  // Depth-first traversal to apply patches.
  function dfs(node) {
    const currentPatch = patches[currentIndex];

    currentPatch?.apply(node);

    // If the node was removed or replaced, do not traverse its children
    const isNodeRemovedOrReplaced =
      currentPatch?.type === PatchType.REMOVE ||
      currentPatch?.type === PatchType.REPLACE;

    if (!isNodeRemovedOrReplaced) {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        currentIndex++;
        dfs(children[i]);
      }
    }
  }

  dfs(parent);
}

/**
 *
 * @param {DOMElement} oldTree
 * @param {DOMElement} newTree
 * @param {DOMElement} root
 */
export function patchDiff(oldTree, newTree, root) {
  const patches = getPatches(oldTree, newTree);
  // TODO pass old tree to patch and index from zero in the path
  patch(root, patches);
}
