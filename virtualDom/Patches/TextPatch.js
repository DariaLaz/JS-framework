import { PatchType } from "./PatchType";

export class TextPatch {
  type = PatchType.TEXT;

  constructor(newText) {
    this.newText = newText;
  }

  /**
   *
   * @param {string} newText
   * @returns {TextPatch}
   */
  static create(newText) {
    return new TextPatch(newText);
  }

  /**
   *
   * @param {HTMLElement} root
   */
  apply(root) {
    root.textContent = this.newText;

    return null;
  }
}
