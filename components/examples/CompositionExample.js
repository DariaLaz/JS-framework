import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class ExampleChild extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return createElement({
      tag: "div",
      props: {
        style:
          "border: 1px solid #ccc; padding: 12px; margin: 8px 0; border-radius: 4px; background: " +
          (this.props.background || "#f9f9f9"),
      },
      children: [
        createElement({
          tag: "h4",
          props: { style: "margin: 0 0 4px 0" },
          children: [this.props.title || "Untitled Child"],
        }),
        createElement({
          tag: "p",
          props: { style: "margin: 0" },
          children: [this.props.description || "No description provided."],
        }),
      ],
    });
  }
}

class CompositionExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      childCount: 2,
    };
  }

  addChild = () => {
    this.setState({ childCount: this.state.childCount + 1 });
  };

  removeChild = () => {
    if (this.state.childCount > 0) {
      this.setState({ childCount: this.state.childCount - 1 });
    }
  };

  render() {
    const colors = ["#e8f5e9", "#e3f2fd", "#fff3e0", "#fce4ec", "#f3e5f5", "#e0f7fa"];

    return createElement({
      tag: "div",
      props: { class: "example-section" },
      children: [
        createElement({
          tag: "h2",
          props: null,
          children: ["Component Composition & Props"],
        }),

        createElement({
          tag: "div",
          props: { class: "example-subsection" },
          children: [
            createElement({
              tag: "h3",
              props: null,
              children: ["Static Children with Different Props"],
            }),
            createElement({
              tag: ExampleChild,
              props: {
                title: "Child A",
                description: "I received a green background via props.",
                background: "#e8f5e9",
              },
              children: [],
            }),
            createElement({
              tag: ExampleChild,
              props: {
                title: "Child B",
                description: "I received a blue background via props.",
                background: "#e3f2fd",
              },
              children: [],
            }),
          ],
        }),

        createElement({
          tag: "div",
          props: { class: "example-subsection" },
          children: [
            createElement({
              tag: "h3",
              props: null,
              children: ["Dynamic Children (" + this.state.childCount + ")"],
            }),
            createElement({
              tag: "div",
              props: { class: "button-group" },
              children: [
                createElement({
                  tag: "button",
                  props: { click: this.addChild },
                  children: ["Add Child"],
                }),
                createElement({
                  tag: "button",
                  props: { click: this.removeChild },
                  children: ["Remove Child"],
                }),
              ],
            }),
            ...Array.from({ length: this.state.childCount }, (_, i) =>
              createElement({
                key: "dynamic-child-" + i,
                tag: ExampleChild,
                props: {
                  title: "Dynamic Child #" + (i + 1),
                  description: "I was created dynamically with key-based reconciliation.",
                  background: colors[i % colors.length],
                },
                children: [],
              }),
            ),
          ],
        }),
      ],
    });
  }
}

export default CompositionExample;
