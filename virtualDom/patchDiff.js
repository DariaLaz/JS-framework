import { PropsPatch } from "./Patches/PropsPatch";
import { TextPatch } from "./Patches/TextPatch";
import { CreatePatch } from "./Patches/CreatePatch";
import { RemovePatch } from "./Patches/RemovePatch";
import { ReplacePatch } from "./Patches/ReplacePatch";
import { BasePatch } from "./Patches/BasePatch";
import { VirtualTreeNode } from "./virtualDom/VirtualTreeNode";

function getRemovedNodes(oldNode, newNode) {
  const mapToType = (child) =>
    typeof child === "string"
      ? { type: "text", text: child }
      : { type: "element", element: child.key };
  const oldChildren = oldNode.children.map(mapToType);
  const newChildren = newNode.children.map(mapToType);

  const removed = oldChildren.filter(
    (child) =>
      !newChildren.find(
        (newChild) =>
          child.type === newChild.type &&
          (child.type === "text"
            ? child.text === newChild.text
            : child.element.key === newChild.element.key)
      )
  );

  const removedPatches = removed.map((child) => {
    if (child.type === "text") {
      return {
        key: undefined,
        elementPatch: TextPatch.create(undefined),
        childrenPatches: [],
      };
    }
    return {
      key: child.element.key,
      elementPatch: RemovePatch.create(child.element.key),
      childrenPatches: [],
    };
  });

  const restOldChildren = oldChildren.filter(
    (child) => !removed.includes(child)
  );

  return { removedPatches, restOldChildren };
}

/**
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {BasePatch[]} Wrong return type
 */
function getChildrenPatches(oldNode, newNode) {
  const { removedPatches, restOldChildren } = getRemovedNodes(oldNode, newNode);

  const mapToType = (child) =>
    typeof child === "string"
      ? { type: "text", text: child }
      : { type: "element", element: child.key };
  const newChildren = newNode.children.map(mapToType);

  let indexInOldNode = 0;
  const newTreePatches = newChildren.children.forEach((child, index) => {
    if (indexInOldNode > restOldChildren.length) {
      return child.type === "text"
        ? {
            key: undefined,
            elementPatch: TextPatch.create(child.text),
            childrenPatches: [],
          }
        : {
            key: child.element.key,
            elementPatch: CreatePatch.create(child.element, index),
            childrenPatches: [],
          };
    }

    const oldChild = restOldChildren[indexInOldNode];

    if (child.type === "text" && oldChild.type === "text") {
      indexInOldNode++;
      return {
        // TODO ?? maybe add types to this shit no need to map them everywhere
        key: undefined,
        elementPatch:
          child.text === oldChild.text
            ? undefined
            : TextPatch.create(child.text),
        childrenPatches: [],
      };
    }

    if (
      child.type === "element" &&
      oldChild.type === "element" &&
      child.element.key === oldChild.element.key &&
      // TODO Custom Components add logic here
      child.element.tag !== oldChild.element.tag
    ) {
      indexInOldNode++;
      return getNodePatches(child.element, oldChild.element);
    }

    return {
      key: child.element.key,
      elementPatch: CreatePatch.create(child.element, index),
      childrenPatches: [],
    };
  });

  return [...removedPatches, ...newTreePatches];
}

/**
 * @typedef {
 *  key: string,
 *  elementPatch: BasePatch,
 *  childrenPatches: NodePatch[]
 * } NodePatch
 *
 * Diff function to compare two VDOM trees and generate patches.
 * Inspiration: https://medium.com/@ruchivora16/react-how-react-works-under-the-hood-9b621ee69fb5
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {NodePatch}
 */
function getNodePatches(oldNode, newNode) {
  // Key/Tag check and patch generation
  // Mostly for the root node
  if (
    oldNode.key !== newNode.key ||
    // TODO Custom Components add logic here
    oldNode.tag !== newNode.tag
  ) {
    return {
      elementPatch: ReplacePatch.create(oldNode, newNode),
      childrenPatches: [],
    };
  }

  // TODO Add shallowEqual for memoised components
  // if (shallowEqual(oldNode.props, newNode.props)) {

  const propsPatch = PropsPatch.create(
    newNode.key,
    oldNode.props,
    newNode.props
  );

  return {
    key: oldNode.key,
    elementPatch: propsPatch,
    childrenPatches: getChildrenPatches(oldNode, newNode),
  };
}

// TODO Move
function getElementFromKey(root, id) {
  return root.querySelector(`[id="${id}"]`);
}

/**
 * Apply patches to the Real DOM.
 * @param {DOMElement} parent
 * @param {BasePatch[]} patches TODO wrong type
 */
function patch(root, patch) {
  const { elementPatch, childrenPatches } = patch;

  const domElement =
    elementPatch?.apply(root) ?? getElementFromKey(root, patch.key);

  if (childrenPatches?.length) {
    childrenPatches.forEach((childPatch) => {
      patch(domElement, childPatch);
    });
  }
}

/**
 *
 * @param {VirtualTreeNode} oldTree
 * @param {VirtualTreeNode} newTree
 * @param {DOMElement} root
 */
export function patchDiff(oldTree, newTree, root) {
  const patches = getPatches(oldTree, newTree);
  patch(root, patches);
}
