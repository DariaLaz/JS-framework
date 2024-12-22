import { PatchType } from "./PatchType";

export class TextPatch {
  type = PatchType.TEXT;

  constructor(newText) {
    this.newText = newText;
  }

  /**
   *
   * @param {string} oldText
   * @param {string} newText
   * @returns {TextPatch | undefined}
   */
  static create(oldText, newText) {
    if (oldText === newText) {
      return;
    }

    return new TextPatch(newText);
  }

  /**
   *
   * @param {HTMLElement} node
   */
  apply(node) {
    node.textContent = this.newText;
  }
}
