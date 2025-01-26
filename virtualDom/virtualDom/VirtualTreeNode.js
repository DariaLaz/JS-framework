export class VirtualTreeNode {
  /**
   * @param {VirtualKey | undefined} key
   * @param {string} tag
   * @param {Record<string, any>} props
   * @param {VirtualTreeNode[]} children
   *
   */
  constructor(key, tag, props, children) {
    this.key = key;
    this.tag = tag;
    this.props = props || {};
    this.children = children || [];
  }
}

/**
 *
 * @param {{key:VirtualKey,  tag: string, props: Record<string, any>, children:VirtualDOMElement[] }} param0
 * @returns {VirtualDOMElement}
 */
export function createVirtualTreeNode({ key, tag, props, children }) {
  return new VirtualTreeNode(key, tag, props, children);
}
