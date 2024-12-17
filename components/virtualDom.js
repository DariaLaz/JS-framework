class DOMElement {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props || {};
    this.children = children || [];
  }
}

function createElement(tag, props, ...children) {
  return new DOMElement(tag, props, children);
}

function renderElement(domElement) {
  if (typeof domElement === "string") {
    // Text node rather than an HTML element
    return document.createTextNode(domElement);
  }

  const element = document.createElement(domElement.tag);

  if (domElement.props) {
    Object.keys(domElement.props).forEach((key) => {
      if (key.startsWith("on")) {
        element.addEventListener(
          key.slice(2).toLowerCase(),
          domElement.props[key]
        );
      } else {
        element.setAttribute(key, domElement.props[key]);
      }
    });
  }

  if (domElement.children) {
    domElement.children.forEach((child) => {
      element.appendChild(renderElement(child));
    });
  }

  return element;
}

const PatchType = {
  REMOVE: "REMOVE",
  REPLACE: "REPLACE",
  PROPS: "PROPS",
  CHILDREN: "CHILDREN",
  ADD: "ADD",
  TEXT: "TEXT",
};

// Diff function to compare two VDOM trees and generate patches.
function diff(oldTree, newTree) {
  const patches = {};
  let patchIndex = 1;

  // Depth-first traversal to compare nodes and generate patches.
  function dfs(oldNode, newNode, index) {
    const currentPatches = [];

    if (!oldNode && newNode) {
      currentPatches.push({ type: PatchType.ADD, content: newNode });
    } else if (oldNode && !newNode) {
      currentPatches.push({ type: PatchType.REMOVE });
    } else if (typeof oldNode === "string" && typeof newNode === "string") {
      if (oldNode !== newNode) {
        // Text content changed
        currentPatches.push({ type: PatchType.TEXT, content: newNode });
      }
    } else if (oldNode.tag !== newNode.tag) {
      // Different tags, replace the node
      currentPatches.push({ type: PatchType.REPLACE, content: newNode });
    } else {
      // Same tag, check for props and children
      const propsDiff = diffProps(oldNode.props, newNode.props);
      if (Object.keys(propsDiff).length > 0) {
        currentPatches.push({ type: PatchType.PROPS, content: propsDiff });
      }

      const maxChildrenLength = Math.max(
        oldNode.children.length,
        newNode.children.length
      );
      for (let i = 0; i < maxChildrenLength; i++) {
        patchIndex += 1;
        dfs(oldNode.children[i], newNode.children[i], patchIndex);
      }
    }

    if (currentPatches.length > 0) {
      patches[index] = currentPatches;
    }
  }

  dfs(oldTree, newTree, patchIndex);
  return patches;
}

// Compare props of two elements and return the differences.
const diffProps = (oldProps, newProps) => {
  const diffs = {};

  for (const key in { ...oldProps, ...newProps }) {
    if (oldProps[key] !== newProps[key]) {
      diffs[key] = newProps[key];
    }
  }

  return diffs;
};

// Apply patches to the Real DOM.
function patch(parent, patches) {
  let currentIndex = 0;

  console.log("----Patches:", patches, "Parent:", parent);

  // Depth-first traversal to apply patches.
  function dfs(node) {
    console.log("Node:", node, "Current Index:", currentIndex);
    const currentPatches = patches[currentIndex];

    if (currentPatches) {
      currentPatches.forEach((patch) => {
        switch (patch.type) {
          case PatchType.REMOVE:
            node.parentNode.removeChild(node);
            break;
          case PatchType.REPLACE:
            node.parentNode.replaceChild(renderElement(patch.content), node);
            break;
          case PatchType.PROPS:
            for (const key in patch.content) {
              if (patch.content[key] === null) {
                node.removeAttribute(key);
              } else {
                node.setAttribute(key, patch.content[key]);
              }
            }
            break;
          case PatchType.TEXT:
            node.textContent = patch.content;
            break;
          case PatchType.ADD:
            node.appendChild(renderElement(patch.content));
            break;
          default:
            break;
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

export { createElement, diff, patch, renderElement };
