/**
 *
 * @param {any[]} oldArray
 * @param {any[]} newArray
 * @returns {{added: any[], same: any[], removed: any[]}}
 */
export function arrayDiff(oldArray, newArray) {
  const added = newArray.filter((item) => !oldArray.includes(item));
  const same = newArray.filter((item) => oldArray.includes(item));
  const removed = oldArray.filter((item) => !newArray.includes(item));

  return { added, same, removed };
}
