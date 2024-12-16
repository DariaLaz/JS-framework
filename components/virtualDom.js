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

function renderElement(domElement) {
    if (typeof domElement === 'string') {
        // Text node rather than an HTML element
        return document.createTextNode(domElement);
    }

    const element = document.createElement(domElement.tag);

    if (domElement.props) {
        Object.keys(domElement.props).forEach(key => {
            if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), domElement.props[key]);
            } else {
                element.setAttribute(key, domElement.props[key]);
            }
        });
    }

    if (domElement.children) {
        domElement.children.forEach(child => {
            element.appendChild(renderElement(child));
        });
    }

    return element;
}

const PatchType = {
    REMOVE: 'REMOVE',
    REPLACE: 'REPLACE',
    PROPS: 'PROPS',
    CHILDREN: 'CHILDREN',
    ADD: 'ADD',
    TEXT: 'TEXT'
};

function diff(oldTree, newTree) {
    const patches = {};
    let index = 0;

    function dfs(oldNode, newNode, index) {
        const currentPatch = [];

        if (!oldNode && newNode) {
            currentPatch.push({ type: PatchType.ADD, index, content: newNode });
        } else if (oldNode && !newNode) {
            currentPatch.push({ type: PatchType.REMOVE, index });
        } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
            if (oldNode !== newNode) {
                currentPatch.push({ type: PatchType.TEXT, index: index, content: newNode });
            }
        } else if (oldNode.tag !== newNode.tag) {
            currentPatch.push({ type: PatchType.REPLACE, index, content: newNode });
        } else {
            const propsDiff = diffProps(oldNode.props, newNode.props);
            if (Object.keys(propsDiff).length > 0) {
                currentPatch.push({ type: PatchType.PROPS, content: propsDiff });
            }

            const maxLength = Math.max(oldNode.children.length, newNode.children.length);
            for (let i = 0; i < maxLength; i++) {
                dfs(oldNode.children[i], newNode.children[i], ++index);
            }
        }

        if (currentPatch.length > 0) {
            patches[index] = currentPatch;
        }

        return index;
    }
    index = 0
    for (let i = 0; i < Math.max(oldTree?.children.length, newTree?.children.length); i++) {
        index = dfs(oldTree?.children[index], newTree?.children[index], index);
    }   
    return patches;
}

const diffProps = (oldProps, newProps) => {
    const diffs = {};

    for (const key in { ...oldProps, ...newProps }) {
        if (oldProps[key] !== newProps[key]) {
            diffs[key] = newProps[key];
        }
    }

    return diffs;
}

function patch(parent, patches, index = 0, patchesIndex = 0) {
   
    if (!parent || !patches) {
        return;
    }

    const element = parent.childNodes[index];
    const currentPatches = patches[patchesIndex];

    if (currentPatches) {
        currentPatches.forEach(p => {
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
