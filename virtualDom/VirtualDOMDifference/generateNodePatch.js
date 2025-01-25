import { PropsPatch } from "./Patches/PropsPatch";
import { TextPatch } from "./Patches/TextPatch";
import { CreatePatch } from "./Patches/CreatePatch";
import { RemovePatch } from "./Patches/RemovePatch";
import { ReplacePatch } from "./Patches/ReplacePatch";
import { BasePatch } from "./Patches/BasePatch";
import { VirtualTreeNode } from "../virtualDom/VirtualTreeNode";
import { NodePatch } from "./Patches/NodePatch";

/**
 * @param {VirtualTreeNode} child
 * @returns {{type: string, text: string} | {type: string, element: VirtualTreeNode}}
 */
function addTypeToElement(child) {
  return typeof child === "string"
    ? { type: "text", text: child }
    : { type: "element", element: child };
}

/**
 *
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {{removedPatches: NodePatch[], restOldChildren: ({type: string, text: string} | {type: string, element: VirtualTreeNode})[]}}
 */
function getRemovedNodes(oldNode, newNode) {
  const oldChildren = oldNode.children.map(addTypeToElement);
  const newChildren = newNode.children.map(addTypeToElement);

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
      return NodePatch.create({
        elementPatch: TextPatch.create(undefined),
      });
    }

    return NodePatch.create({
      elementPatch: RemovePatch.create(child.element.key),
    });
  });

  const restOldChildren = oldChildren.filter(
    (child) => !removed.includes(child)
  );

  return { removedPatches, restOldChildren };
}

/**
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {NodePatch[]}
 */
function getChildrenPatches(oldNode, newNode) {
  const { removedPatches, restOldChildren } = getRemovedNodes(oldNode, newNode);

  const newChildren = newNode.children.map(addTypeToElement);

  let indexInOldNode = 0;
  const newTreePatches = newChildren.children.forEach((child, index) => {
    if (indexInOldNode > restOldChildren.length) {
      return NodePatch.create({
        elementPatch:
          child.type === "text"
            ? TextPatch.create(child.text)
            : CreatePatch.create(child.element, index),
      });
    }

    const oldChild = restOldChildren[indexInOldNode];

    if (child.type === "text" && oldChild.type === "text") {
      indexInOldNode++;
      return NodePatch.create({
        // TODO ?? maybe add types to this shit no need to map them everywhere
        elementPatch:
          child.text !== oldChild.text
            ? TextPatch.create(child.text)
            : undefined,
      });
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

    return NodePatch.create({
      elementPatch: CreatePatch.create(child.element, index),
    });
  });

  return [...removedPatches, ...newTreePatches];
}

/**
 * Diff function to compare two VDOM trees and generate patches.
 * Inspiration: https://medium.com/@ruchivora16/react-how-react-works-under-the-hood-9b621ee69fb5
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {NodePatch}
 */
export function generateNodePatch(oldNode, newNode) {
  // Key/Tag check and patch generation
  // Mostly for the root node
  if (
    oldNode.key !== newNode.key ||
    // TODO Custom Components add logic here
    oldNode.tag !== newNode.tag
  ) {
    return NodePatch.create({
      elementPatch: ReplacePatch.create(oldNode.key, newNode),
    });
  }

  // TODO Add shallowEqual for memoised components
  // if (shallowEqual(oldNode.props, newNode.props)) {

  const propsPatch = PropsPatch.create(
    newNode.key,
    oldNode.props,
    newNode.props
  );

  return NodePatch.create({
    key: oldNode.key,
    elementPatch: propsPatch,
    childrenPatches: getChildrenPatches(oldNode, newNode),
  });
}
