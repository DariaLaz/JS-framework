export function selectElement(root, id) {
  if (!id) return null;

  return document.getElementById(String(id));
}
