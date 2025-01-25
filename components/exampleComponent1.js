import { createVirtualElement } from "../virtualDom/VirtualDOMElement.js";
import BaseComponent from "./baseComponent.js";

export class ExampleComponent1 extends BaseComponent {
  render() {
    return createVirtualElement({
      tag: "div",
      props: { class: "example-component" },
      children: [
        createVirtualElement({
          tag: "h1",
          props: null,
          children: [this.props.greeting],
        }),
        createVirtualElement({
          tag: "p",
          props: null,
          children: [this.props.message],
        }),
        ...this.props.children,
      ],
    });
  }
}
