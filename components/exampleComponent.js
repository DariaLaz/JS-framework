import BaseComponent from "./baseComponent.js";
import { createElement } from "./virtualDom.js";

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
    return createElement(
      "div",
      { class: "example-component" },
      createElement("h1", null, this.props.greeting),
      createElement("p", null, this.state.message),
      this.state.showButton
        ? createElement(
            "button",
            { onClick: this.toggleButton },
            "Toggle Button"
          )
        : createElement("h1", null, "Button is hidden")
    );
  }
}

export default ExampleComponent;
