import { createElement } from "../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "./baseComponent.js";

export class ExampleComponent1 extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message || "Default Message",
      showButton: true,
      buttonColor: props.buttonColor,
    };
  }

  toggleButton = () => {
    this.setState({ showButton: !this.state.showButton });
  };

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
        ...Array(this.state.showButton ? 2 : 1)
          .keys()
          .map((i) =>
            createElement({
              key: i,
              tag: "p",
              props: null,
              children: ["This is a second child component " + i],
            })
          ),
        createElement({
          tag: "p",
          props: null,
          children: [this.state.message],
        }),

        !this.state.showButton
          ? createElement({
              tag: "button",
              props: { click: this.toggleButton },
              children: ["Show Button"],
            })
          : null,

        this.state.showButton
          ? createElement({
              tag: "button",
              props: { click: this.toggleButton },
              children: ["Hide Button"],
            })
          : createElement({
              tag: "h1",
              props: null,
              children: ["Button is hidden"],
            }),

        createElement({
          tag: "button",
          props: {
            style: `color: ${this.state.buttonColor}`,
            click: () => {
              this.setState({
                buttonColor: this.state.buttonColor === "blue" ? "red" : "blue",
              });
            },
          },
          children: ["Change color"],
        }),
      ],
    });
  }
}
