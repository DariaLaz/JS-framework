import { createRealDOMElement } from "./createRealDOMElement";
import { PatchType } from "./Patches/PatchType";
import { PropsPatch } from "./Patches/PropsPatch";

// Diff function to compare two VDOM trees and generate patches.
// Inspiration: https://medium.com/@ruchivora16/react-how-react-works-under-the-hood-9b621ee69fb5
/**
 *
 * @param {DOMElement | null} currentTree
 * @param {DOMElement | null} newTree
 * @returns TODO
 */
function getPatches(currentTree, newTree) {
  const patches = {};
  // TODO why from one?
  let patchIndex = 1;

  // Depth-first traversal to compare nodes and generate patches.
  function dfs(currentNode, newNode, index) {
    // TODO create patch object
    const currentPatches = [];

    if (!currentNode && newNode) {
      currentPatches.push({ type: PatchType.CREATE, content: newNode });
    } else if (currentNode && !newNode) {
      currentPatches.push({ type: PatchType.REMOVE });
    } else if (typeof currentNode === "string" && typeof newNode === "string") {
      if (currentNode !== newNode) {
        // Text content changed
        currentPatches.push({ type: PatchType.TEXT, content: newNode });
      }
    } else if (currentNode.tag !== newNode.tag) {
      // Different tags, replace the node
      currentPatches.push({ type: PatchType.REPLACE, content: newNode });
    } else {
      // Same tag, check for props and children
      const propsPatch = PropsPatch.create(currentNode.props, newNode.props);
      if (propsPatch) {
        currentPatches.push(propsPatch);
      }

      const maxChildrenLength = Math.max(
        currentNode.children.length,
        newNode.children.length
      );
      for (let i = 0; i < maxChildrenLength; i++) {
        patchIndex += 1;
        dfs(currentNode.children[i], newNode.children[i], patchIndex);
      }
    }

    if (currentPatches.length > 0) {
      patches[index] = currentPatches;
    }
  }

  dfs(currentTree, newTree, patchIndex);
  return patches;
}

// Apply patches to the Real DOM.
function patch(parent, patches) {
  let currentIndex = 0;

  // Depth-first traversal to apply patches.
  function dfs(node) {
    const currentPatches = patches[currentIndex];

    if (currentPatches) {
      currentPatches.forEach((patch) => {
        switch (patch.type) {
          case PatchType.REMOVE: {
            node.parentNode.removeChild(node);
            break;
          }
          case PatchType.REPLACE: {
            node.parentNode.replaceChild(
              createRealDOMElement(patch.content),
              node
            );
            break;
          }
          case PatchType.PROPS: {
            patch.apply(node);
            break;
          }
          case PatchType.TEXT: {
            node.textContent = patch.content;
            break;
          }
          case PatchType.CREATE: {
            node.appendChild(createRealDOMElement(patch.content));
            break;
          }
          default: {
            break;
          }
        }
      });
    }

    // If the node was removed or replaced, do not traverse its children
    const isNodeRemovedOrReplaced =
      currentPatches &&
      currentPatches.some(
        (p) => p.type === PatchType.REMOVE || p.type === PatchType.REPLACE
      );
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

export function patchDiff(oldTree, newTree, root) {
  const patches = getPatches(oldTree, newTree);
  // TODO pass old tree to patch and index from zero in the path
  patch(root, patches);
}
