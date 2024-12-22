const Events = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keypress",
  "keyup",
  "contextmenu",
  "focus",
  "blur",
  "change",
  "select",
  "submit",
  "reset",
  "resize",
  "scroll",
];

export function isDOMEvent(key) {
  return Events.includes(key);
}
