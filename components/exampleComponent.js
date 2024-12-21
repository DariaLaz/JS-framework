import { createVirtualElement } from "../virtualDom/VirtualDOMElement.js";
import BaseComponent from "./baseComponent.js";

class ExampleComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message || "Default Message",
      showButton: true,
    };
  }

  toggleButton = () => {
    this.setState({ showButton: !this.state.showButton });
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
              props: { onClick: this.toggleButton },
              children: ["Toggle Button"],
            })
          : createVirtualElement({
              tag: "h1",
              props: null,
              children: ["Button is hidden"],
            }),
      ],
    });
  }
}

export default ExampleComponent;
