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
    CHILDREN: 'CHILDREN'
};

function diff(oldTree, newTree) {
    const patches = {};

    function dfs(oldTree, newTree, index) {
        if (!oldTree && !newTree) {
            return [];
        }
        if (!oldTree && newTree) {
            return [{ type: PatchType['ADD'], index, content: newTree }];
        }

        const currentPatch = [];

        console.log(oldTree, newTree);
        
        if (newTree === undefined) {
            currentPatch.push({ type: PatchType["REMOVE"], index });
        }
        else if (oldTree.tag !== newTree.tag) {
            currentPatch.push({ type: PatchType['REPLACE'], index, content: newTree });
        }
        else if (typeof oldTree === 'string') {
            currentPatch.push({ type: PatchType['TEXT'], index, content: newTree });
        }
        else {
            const propsDiff = diffProps(oldTree.props, newTree.props);
            if (propsDiff && Object.keys(propsDiff).length > 0) {
                currentPatch.push({ type: PatchType['PROPS'], content: propsDiff });
            }
            
            for (let i = 0; i < oldTree.children.length || i < newTree.children.length; i++) {
                const childDiff = dfs(oldTree.children[i], newTree.children[i], i);
                if (childDiff && childDiff.length > 0) {
                    currentPatch.push({ type: PatchType['CHILDREN'], content: childDiff });
                }
            }
        }

        if (currentPatch.length > 0) {
            patches[index] = currentPatch;
        }

        return currentPatch;
    }

    dfs(oldTree, newTree, 0);

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

function patch(parent, patches, index = 0) {
    if (!parent || !patches) {
        return;
    }

    const element = parent.childNodes[index];

    const currentPatches = patches[index];

    if (currentPatches) {
        currentPatches.forEach(p => {
            switch (p.type) {
                case PatchType["REMOVE"]:
                    parent.removeChild(element);
                    break;
                case PatchType['REPLACE']:
                    parent.replaceChild(renderElement(p.content), element);
                    break;
                case PatchType['PROPS']:
                    for (const key in p.content) {
                        element.setAttribute(key, p.content[key]);
                    }
                    break;
                case PatchType['CHILDREN']:
                    patch(element, p.content, ++index);
                    break;
                case PatchType['TEXT']:
                    element.textContent = p.content;
                    break;
                case PatchType['ADD']:
                    parent.appendChild(renderElement(p.content));
                    break;
                default:
                    break;
            }
        });
    }
}


export { createElement, diff, patch, renderElement };