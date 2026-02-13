import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";
import StateExample from "./StateExample.js";
import ConditionalExample from "./ConditionalExample.js";
import ListExample from "./ListExample.js";
import EventHandlingExample from "./EventHandlingExample.js";
import EffectExample from "./EffectExample.js";
import CompositionExample from "./CompositionExample.js";
import StyleExample from "./StyleExample.js";

class ExampleApp extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return createElement({
      tag: "div",
      props: {
        class: "example-app",
        style:
          "max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif",
      },
      children: [
        createElement({
          tag: "h1",
          props: {
            style: "border-bottom: 2px solid #333; padding-bottom: 8px",
          },
          children: ["Demo"],
        }),

        createElement({ tag: StateExample, props: {}, children: [] }),
        createElement({
          tag: "hr",
          props: {
            style: "margin: 24px 0; border: none; border-top: 1px solid #ddd",
          },
          children: [],
        }),

        createElement({ tag: ConditionalExample, props: {}, children: [] }),
        createElement({
          tag: "hr",
          props: {
            style: "margin: 24px 0; border: none; border-top: 1px solid #ddd",
          },
          children: [],
        }),

        createElement({ tag: ListExample, props: {}, children: [] }),
        createElement({
          tag: "hr",
          props: {
            style: "margin: 24px 0; border: none; border-top: 1px solid #ddd",
          },
          children: [],
        }),

        createElement({ tag: EventHandlingExample, props: {}, children: [] }),
        createElement({
          tag: "hr",
          props: {
            style: "margin: 24px 0; border: none; border-top: 1px solid #ddd",
          },
          children: [],
        }),

        createElement({ tag: EffectExample, props: {}, children: [] }),
        createElement({
          tag: "hr",
          props: {
            style: "margin: 24px 0; border: none; border-top: 1px solid #ddd",
          },
          children: [],
        }),

        createElement({ tag: CompositionExample, props: {}, children: [] }),
        createElement({
          tag: "hr",
          props: {
            style: "margin: 24px 0; border: none; border-top: 1px solid #ddd",
          },
          children: [],
        }),

        createElement({ tag: StyleExample, props: {}, children: [] }),
      ],
    });
  }
}

export default ExampleApp;
