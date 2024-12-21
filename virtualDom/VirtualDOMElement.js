export class VirtualDOMElement {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props || {};
    this.children = children || [];
  }
}

/**
 *
 * @param {{tag: string, props: Record<string, any>, children:VirtualDOMElement[] }} param0
 * @returns {VirtualDOMElement}
 */
export function createVirtualElement({ tag, props, children }) {
  return new VirtualDOMElement(tag, props, children);
}
