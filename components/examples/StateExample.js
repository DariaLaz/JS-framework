import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class StateExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      label: "Counter",
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  decrement = () => {
    this.setState({ count: this.state.count - 1 });
  };

  reset = () => {
    this.setState({ count: 0 });
  };

  changeLabel = () => {
    this.setState({
      label: this.state.label === "Counter" ? "Score" : "Counter",
    });
  };

  render() {
    return createElement({
      tag: "div",
      props: { class: "example-section" },
      children: [
        createElement({
          tag: "h2",
          props: null,
          children: ["State Management"],
        }),
        createElement({
          tag: "p",
          props: { class: "example-value" },
          children: [this.state.label + ": " + this.state.count],
        }),
        createElement({
          tag: "div",
          props: { class: "button-group" },
          children: [
            createElement({
              tag: "button",
              props: { click: this.decrement },
              children: ["- Decrement"],
            }),
            createElement({
              tag: "button",
              props: { click: this.reset },
              children: ["Reset"],
            }),
            createElement({
              tag: "button",
              props: { click: this.increment },
              children: ["+ Increment"],
            }),
            createElement({
              tag: "button",
              props: { click: this.changeLabel },
              children: ['Toggle Label ("' + this.state.label + '")'],
            }),
          ],
        }),
      ],
    });
  }
}

export default StateExample;
