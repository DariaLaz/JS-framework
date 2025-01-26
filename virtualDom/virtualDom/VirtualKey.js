export class VirtualKey {
  static CHILD_SECRET_KEY = Symbol("CHILD_SECRET_KEY");
  static ROOT_SECRET_KEY = Symbol("ROOT_SECRET_KEY");
  /**
   * @param {string | undefined} key
   *
   */
  constructor(key) {
    this.key = key;
  }
}

/**
 * @param {{parentKey:string, index: number| undefined} | undefined} parentData
 * @returns {string}
 */
export function generateVirtualKey(parentData, key) {
  if (!parentData) {
    return VirtualKey.ROOT_SECRET_KEY.toString();
  }

  if (!key) {
    // TODO this with the symbol is almost cool needs improving. Maybe create an object for the key?
    return `${parentData.parentKey}.${VirtualKey.CHILD_SECRET_KEY.toString()}.${
      parentData.index
    }`;
  }

  return new VirtualKey(`${parentData.parentKey}.${key}`);
}
