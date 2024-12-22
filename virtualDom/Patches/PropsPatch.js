import { arrayDiff } from "../../utils/arrayDiff";
import { isDOMEvent } from "../constants/EventListeners";
import { PatchType } from "./PatchType";

export class PropsPatch {
  type = PatchType.PROPS;
  constructor(
    toBeAddedAttributes,
    toBeAddedEventListeners,
    toBeRemovedAttributes,
    toBeRemovedEventListeners
  ) {
    this.toBeAddedAttributes = toBeAddedAttributes;
    this.toBeAddedEventListeners = toBeAddedEventListeners;
    this.toBeRemovedAttributes = toBeRemovedAttributes;
    this.toBeRemovedEventListeners = toBeRemovedEventListeners;
  }

  /**
   *
   * @param {Record<string,any>} oldProps
   * @param {Record<string,any>} newProps
   * @returns PropsPatch
   */
  static create(oldProps, newProps) {
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
      toBeAddedAttributes,
      toBeAddedEventListeners,
      toBeRemovedAttributes,
      toBeRemovedEventListeners
    );
  }

  /**
   * Apply the patch to the real DOM node.
   * @param {HTMLElement} node
   */
  apply(node) {
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
  }
}
