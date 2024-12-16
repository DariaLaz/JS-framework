class DOMElement {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
}

function createElement(tag, props, ...children) {
  return new DOMElement(tag, props, children);
}

/**
 * Renders a virtual DOM element into a real DOM element.
 *
 * @param {Object} domElement - The virtual DOM element to render.
 * @returns {HTMLElement} element - The rendered HTML element.
 *
 * The virtual DOM element can be a string representing a text node or an object with the following structure:  { tag, props, children } where:
 * - tag is a string representing the HTML tag name.
 * - props is an object containing the element's attributes.
 * - children is an array of virtual DOM elements representing the element's children.
 */
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

/**
 * Computes the differences (patches) between two virtual DOM trees.
 *
 * @param {Object} oldTree - The old virtual DOM tree.
 * @param {Object} newTree - The new virtual DOM tree.
 * @returns {Object} patches - An object representing the differences between the old and new trees.
 *
 * The patches object contains keys representing node indices and values as arrays of patch objects.
 * Each patch object can have the following structure:
 * - { type: PatchType.ADD, index, content } for adding a new node.
 * - { type: PatchType.REMOVE, index } for removing an existing node.
 * - { type: PatchType.TEXT, index, content } for updating text content.
 * - { type: PatchType.REPLACE, index, content } for replacing a node.
 * - { type: PatchType.PROPS, content } for updating node properties.
 */
function diff(oldTree, newTree) {
  const patches = {};
  let index = 0;

  function dfs(oldNode, newNode, index) {
    const currentPatch = [];

    if (!oldNode && newNode) {
      currentPatch.push({ type: PatchType.ADD, index, content: newNode });
    } else if (oldNode && !newNode) {
      currentPatch.push({ type: PatchType.REMOVE, index });
    } else if (typeof oldNode === "string" && typeof newNode === "string") {
      if (oldNode !== newNode) {
        currentPatch.push({
          type: PatchType.TEXT,
          index: index,
          content: newNode,
        });
      }
    } else if (oldNode.tag !== newNode.tag) {
      currentPatch.push({ type: PatchType.REPLACE, index, content: newNode });
    } else {
      const propsDiff = diffProps(oldNode.props, newNode.props);
      if (Object.keys(propsDiff).length > 0) {
        currentPatch.push({ type: PatchType.PROPS, content: propsDiff });
      }

      const maxLength = Math.max(
        oldNode.children.length,
        newNode.children.length
      );
      for (let i = 0; i < maxLength; i++) {
        dfs(oldNode.children[i], newNode.children[i], ++index);
      }
    }

    if (currentPatch.length > 0) {
      patches[index] = currentPatch;
    }

    return index;
  }
  index = 0;
  for (
    let i = 0;
    i < Math.max(oldTree?.children.length, newTree?.children.length);
    i++
  ) {
    index = dfs(oldTree?.children[index], newTree?.children[index], index);
  }
  return patches;
}

/**
 * Computes the differences between two sets of properties.
 *
 * @param {Object} oldProps - The old set of properties.
 * @param {Object} newProps - The new set of properties.
 * @returns {Object} diffs - An object representing the differences between the old and new properties.
 */
const diffProps = (oldProps, newProps) => {
  const diffs = {};

  for (const key in { ...oldProps, ...newProps }) {
    if (oldProps[key] !== newProps[key]) {
      diffs[key] = newProps[key];
    }
  }

  return diffs;
};

/**
 * Applies a set of patches to a real DOM element. (The differences between two virtual DOM trees)
 *
 * @param {HTMLElement} parent - The parent element to apply the patches to.
 * @param {Object} patches - The patches to apply.
 * @param {number} index - The index of the current node.
 * @param {number} patchesIndex - The index of the current patch.
 *
 * The patches object is the result of the diff function and contains keys representing node indices and values as arrays of patch objects.
 * Each patch object can have the following structure:
 * - { type: PatchType.ADD, index, content } for adding a new node.
 * - { type: PatchType.REMOVE, index } for removing an existing node.
 * - { type: PatchType.TEXT, index, content } for updating text content.
 * - { type: PatchType.REPLACE, index, content } for replacing a node.
 * - { type: PatchType.PROPS, content } for updating node properties.
 *
 **/
function patch(parent, patches, index = 0, patchesIndex = 0) {
  if (!parent || !patches) {
    return;
  }

  const element = parent.childNodes[index];
  const currentPatches = patches[patchesIndex];

  if (currentPatches) {
    currentPatches.forEach((p) => {
      switch (p.type) {
        case PatchType.REMOVE:
          parent.removeChild(element);
          break;
        case PatchType.REPLACE:
          parent.replaceChild(renderElement(p.content), element);
          break;
        case PatchType.PROPS:
          for (const key in p.content) {
            element.setAttribute(key, p.content[key]);
          }
          break;
        case PatchType.TEXT:
          element.textContent = p.content;
          break;
        case PatchType.ADD:
          parent.appendChild(renderElement(p.content));
          break;
        default:
          break;
      }
    });
  }

  for (let i = 0; i < element?.childNodes.length; i++) {
    patch(element, patches, i, patchesIndex + i + 1);
  }
}

export { createElement, diff, patch, renderElement };
