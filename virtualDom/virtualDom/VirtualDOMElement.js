import { createVirtualTreeNode } from "./VirtualTreeNode";

const CHILD_SECRET_KEY = Symbol("CHILD_SECRET_KEY");

export class VirtualDOMElement {
  /**
   * @param {string | undefined} key
   * @param {string} tag
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
      return this.key ?? Math.random().toString(36).substring(7);
    }

    if (!this.key) {
      // TODO this with the symbol is almost cool needs improving. Maybe create an object for the key?
      return `${parentData.parentKey}.${CHILD_SECRET_KEY.toString()}.${
        parentData.index
      }`;
    }

    return `${parentData.parentKey}.${this.key}`;
  }

  /**
   * @param {string} key
   * @returns {VirtualDOMElement[]}
   */
  generateChildren(key) {
    let index = 0;

    return (
      this.children
        // If it is plain text, we don't need to build a virtual dom element for it.
        .filter((child) => typeof child !== "string")
        .map((child) => {
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
        .filter(Boolean)
    );
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
 * @param {{key:string | undefined,  tag: string, props: Record<string, any>, children:VirtualDOMElement[] }} param0
 * @returns {VirtualDOMElement}
 */
export function createElement({ key, tag, props, children }) {
  return new VirtualDOMElement(key, tag, props, children);
}
