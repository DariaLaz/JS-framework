import { createElement } from "../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "./baseComponent.js";

export class ExampleComponent1 extends BaseComponent {
  render() {
    return createElement({
      tag: "div",
      props: { class: "example-component" },
      children: [
        createElement({
          tag: "h1",
          props: null,
          children: [this.props.greeting],
        }),
        createElement({
          tag: "p",
          props: null,
          children: [this.props.message],
        }),
        ...this.props.children,
      ],
    });
  }
}
