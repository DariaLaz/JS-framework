import { arrayDiff } from "../../../utils/arrayDiff";
import { selectElement } from "../../../utils/selectElement";
import { isDOMEvent } from "../../constants/EventListeners";

export class PropsPatch {
  constructor(
    id,
    toBeAddedAttributes,
    toBeAddedEventListeners,
    toBeRemovedAttributes,
    toBeRemovedEventListeners
  ) {
    this.toBeAddedAttributes = toBeAddedAttributes;
    this.toBeAddedEventListeners = toBeAddedEventListeners;
    this.toBeRemovedAttributes = toBeRemovedAttributes;
    this.toBeRemovedEventListeners = toBeRemovedEventListeners;
    this.id = id;
  }

  /**
   * @param {string} id
   * @param {Record<string,any>} oldProps
   * @param {Record<string,any>} newProps
   * @returns {PropsPatch | undefined}
   */
  static create(id, oldProps, newProps) {
    this.id = id;

    const { added, same, removed } = arrayDiff(
      Object.keys(oldProps),
      Object.keys(newProps)
    );

    const changed = same.filter((key) => oldProps[key] !== newProps[key]);

    if (added.length === 0 && changed.length === 0 && removed.length === 0) {
      return;
    }

    const toBeAdded = [...added, ...changed];

    const changedEvents = changed.filter((key) => isDOMEvent(key));
    const toBeRemoved = [...removed, ...changedEvents];

    const toBeAddedAttributes = toBeAdded
      .filter((key) => !isDOMEvent(key))
      .map((key) => ({
        key,
        value: newProps[key],
      }));
    const toBeAddedEventListeners = toBeAdded
      .filter((key) => isDOMEvent(key))
      .map((key) => ({
        key,
        value: newProps[key],
      }));

    const toBeRemovedAttributes = toBeRemoved.filter((key) => !isDOMEvent(key));
    const toBeRemovedEventListeners = toBeRemoved
      .filter((key) => isDOMEvent(key))
      .map((key) => ({
        key,
        value: oldProps[key],
      }));

    return new PropsPatch(
      id,
      toBeAddedAttributes,
      toBeAddedEventListeners,
      toBeRemovedAttributes,
      toBeRemovedEventListeners
    );
  }

  /**
   * Apply the patch to the real DOM node.
   * @param {HTMLElement} node
   * @returns {HTMLElement}
   */
  apply(root) {
    const node = selectElement(root, this.id);

    for (const { key } of this.toBeRemovedAttributes) {
      node.removeAttribute(key);
    }

    for (const { key, value } of this.toBeRemovedEventListeners) {
      node.removeEventListener(key, value);
    }

    for (const { key, value } of this.toBeAddedAttributes) {
      node.setAttribute(key, value);
    }

    for (const { key, value } of this.toBeAddedEventListeners) {
      node.addEventListener(key, value);
    }

    return node;
  }
}
