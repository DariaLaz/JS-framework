import { createVirtualElement } from "../virtualDom/VirtualDOMElement.js";
import BaseComponent from "./baseComponent.js";

class ExampleComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message || "Default Message",
      showButton: true,
      buttonColor: "red",
    };
  }

  toggleButton = () => {
    this.setState({ showButton: !this.state.showButton });
  };

  changeButtonColor = () => {
    if (this.state.buttonColor === "blue") {
      this.setState({ buttonColor: "red" });
      return;
    }

    this.setState({ buttonColor: "blue" });
  };

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
          children: [this.state.message],
        }),

        this.state.showButton
          ? createVirtualElement({
              tag: "button",
              props: { click: this.toggleButton },
              children: ["Toggle Button"],
            })
          : createVirtualElement({
              tag: "h1",
              props: null,
              children: ["Button is hidden"],
            }),

        // TODO: remove this and click on the button below and the code crashes
        createVirtualElement({
          tag: "br",
          props: null,
          children: null,
        }),

        createVirtualElement({
          tag: "button",
          props: {
            style: `color: ${this.state.buttonColor}`,
            click:
              this.state.buttonColor === "red"
                ? this.changeButtonColor
                : undefined,
          },
          children: ["Change color"],
        }),
      ],
    });
  }
}

export default ExampleComponent;

// TODO there is a bug where you can click on the hidden button
// TODO there is a bug where you can not click on the text of the button
