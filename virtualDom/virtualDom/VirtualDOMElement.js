import { createVirtualTreeNode } from "./VirtualTreeNode";

// TODO: Create object for the key
const ROOT_SECRET_KEY = "ROOT_SECRET_KEY";
const CHILD_SECRET_KEY = "CHILD_SECRET_KEY";

export class VirtualDOMElement {
  /**
   * @param {string | undefined} key
   * @param {string | function} tag
   * @param {Record<string, any>} props
   * @param {VirtualDOMElement[]} children
   *
   */
  constructor(key, tag, props, children) {
    this.key = key;
    this.tag = tag;
    this.props = props || {};
    this.children = children || [];
  }

  /**
   * @param {{parentKey:string, index: number| undefined} | undefined} parentData
   * @returns {string}
   */
  generateKey(parentData) {
    if (!parentData) {
      return ROOT_SECRET_KEY;
    }

    if (!this.key) {
      return `${parentData.parentKey}.${CHILD_SECRET_KEY}.${parentData.index}`;
    }

    return `${parentData.parentKey}.${this.key}`;
  }

  /**
   * @param {string} key
   * @returns {VirtualDOMElement[]}
   */
  generateChildren(key) {
    let index = 0;

    return this.children
      .map((child) => {
        if (typeof child === "string") {
          return child;
        }

        if (typeof child === "function") {
          const componentInstance = new this.tag({
            ...this.props,
            children,
          });

          const virtualDomSubTree = componentInstance.render();

          return virtualDomSubTree.generateVirtualTree(parentData);
        }

        if (!child) {
          // Increment the index even if the child is null
          // because we want to guarantee that there will be a place for this one if it becomes an element.
          index++;
          return null;
        }

        if (child.key) {
          // If the child has a key, we don't need to increment the index.
          // This is done to ensure that the keys are the same for elements outside of arrays
          // where the elements are dynamic and we need to give them there own unique key.

          // TODO Add a warning for ^this^
          return child.generateVirtualTree({ parentKey: key });
        }

        const parentData = { parentKey: key, index };
        index++;

        return child.generateVirtualTree(parentData);
      })
      .filter(Boolean);
  }

  /**
   * @param {{parentKey:string, index: number} | undefined} parentData
   * @returns {VirtualDOMElement}
   */
  generateVirtualTree(parentData) {
    const key = this.generateKey(parentData);

    const children = this.generateChildren(key);

    return createVirtualTreeNode({
      key,
      // TODO Custom Components add logic here
      tag: this.tag,
      props: this.props,
      children,
    });
  }
}

/**
 *
 * @param {{key:string | undefined,  tag: string | function, props: Record<string, any>, children:VirtualDOMElement[] }} param0
 * @returns {VirtualDOMElement}
 */
export function createElement({ key, tag, props, children }) {
  return new VirtualDOMElement(key, tag, props, children);
}
