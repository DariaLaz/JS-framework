import { PropsPatch } from "./Patches/PropsPatch";
import { TextPatch } from "./Patches/TextPatch";
import { CreatePatch } from "./Patches/CreatePatch";
import { RemovePatch } from "./Patches/RemovePatch";
import { ReplacePatch } from "./Patches/ReplacePatch";
import { VirtualTreeNode } from "../virtualDom/VirtualTreeNode";
import { NodePatch } from "./Patches/NodePatch";
import { TEXT_TAG } from "../../utils/toDomEventName";
import { CHILD_SECRET_KEY } from "../virtualDom/VirtualDOMElement";

/**
 * @param {VirtualTreeNode} child
 * @returns {{type: string, text: string} | {type: string, element: VirtualTreeNode}}
 */
function addTypeToElement(child) {
  if (child == null || child === false || child === true) return null;

  if (child.tag === TEXT_TAG) {
    return {
      type: "text",
      key: child.key,
      text: child.props?.nodeValue ?? "",
      element: child,
    };
  }

  return { type: "element", key: child.key, element: child };
}

function normalizeChildren(arr) {
  return (arr ?? [])
    .flat(Infinity)
    .filter((c) => c !== null && c !== undefined && c !== false && c !== true);
}

function getRemovableKey(node) {
  if (!node) {
    return undefined;
  }

  if (typeof node.tag === "function") {
    return `${node.key}.${CHILD_SECRET_KEY}.0`;
  }

  return node.key;
}

/**
 *
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {{removedPatches: NodePatch[], restOldChildren: ({type: string, text: string} | {type: string, element: VirtualTreeNode})[]}}
 */
function getRemovedNodes(oldNode, newNode) {
  const oldChildren = normalizeChildren(oldNode.children)
    .map(addTypeToElement)
    .filter(Boolean);

  const newChildren = normalizeChildren(newNode.children)
    .map(addTypeToElement)
    .filter(Boolean);

  const removed = oldChildren.filter(
    (child) =>
      !newChildren.find((newChild) => {
        if (!child || !newChild) return false;
        if (child.type !== newChild.type) return false;

        if (child.type === "text") {
          return child.key === newChild.key;
        }

        return (
          child.element.key === newChild.element.key &&
          child.element.tag === newChild.element.tag
        );
      }),
  );

  const removedPatches = removed.map((child) => {
    if (child.type === "text") {
      return NodePatch.create({
        elementPatch: RemovePatch.create(child.key),
      });
    }

    return NodePatch.create({
      elementPatch: RemovePatch.create(getRemovableKey(child.element)),
    });
  });

  const restOldChildren = oldChildren.filter(
    (child) => !removed.includes(child),
  );

  return { removedPatches, restOldChildren };
}

/**
 * @param {VirtualTreeNode} oldNode
 * @param {VirtualTreeNode} newNode
 * @returns {NodePatch[]}
 */
function getChildrenPatches(oldNode, newNode) {
  const { removedPatches } = getRemovedNodes(oldNode, newNode);

  const oldChildren = normalizeChildren(oldNode.children)
    .map(addTypeToElement)
    .filter(Boolean);

  const newChildren = normalizeChildren(newNode.children)
    .map(addTypeToElement)
    .filter(Boolean);

  const oldByKey = new Map();
  for (const c of oldChildren) {
    const k = c.type === "text" ? c.key : c.element.key;
    oldByKey.set(k, c);
  }

  const newTreePatches = newChildren.map((c, index) => {
    const k = c.type === "text" ? c.key : c.element.key;
    const oldChild = oldByKey.get(k);

    if (!oldChild) {
      const nodeToCreate = c.element;
      return NodePatch.create({
        elementPatch: CreatePatch.create(oldNode.key, nodeToCreate, index),
      });
    }

    const oldElem = oldChild.element;
    const newElem = c.element;
    return generateNodePatch(oldElem, newElem);
  });

  return [...removedPatches, ...newTreePatches].filter(Boolean);
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
  if (oldNode == null && newNode == null) {
    return null;
  }

  if (oldNode == null && newNode != null) {
    return null;
  }

  if (oldNode != null && newNode == null) {
    return NodePatch.create({
      elementPatch: RemovePatch.create(oldNode.key),
    });
  }
  if (oldNode.key !== newNode.key || oldNode.tag !== newNode.tag) {
    return NodePatch.create({
      elementPatch: ReplacePatch.create(oldNode.key, newNode),
    });
  }

  const propsPatch = PropsPatch.create(
    newNode.key,
    oldNode.props,
    newNode.props,
  );

  const childrenPatches = getChildrenPatches(oldNode, newNode);
  if (!propsPatch && !childrenPatches.length) {
    return;
  }

  return NodePatch.create({
    key: oldNode.key,
    elementPatch: propsPatch,
    childrenPatches,
  });
}
