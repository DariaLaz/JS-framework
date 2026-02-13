import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class ConditionalExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      showContent: true,
      mode: "greeting",
    };
  }

  toggleContent = () => {
    this.setState({ showContent: !this.state.showContent });
  };

  toggleMode = () => {
    this.setState({
      mode: this.state.mode === "greeting" ? "farewell" : "greeting",
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
          children: ["Conditional Rendering"],
        }),

        createElement({
          tag: "div",
          props: { class: "example-subsection" },
          children: [
            createElement({
              tag: "h3",
              props: null,
              children: ["Toggle Visibility"],
            }),
            createElement({
              tag: "button",
              props: { click: this.toggleContent },
              children: [this.state.showContent ? "Hide Content" : "Show Content"],
            }),
            this.state.showContent
              ? createElement({
                  tag: "p",
                  props: { class: "example-highlight" },
                  children: ["This content is conditionally rendered!"],
                })
              : null,
          ],
        }),

        createElement({
          tag: "div",
          props: { class: "example-subsection" },
          children: [
            createElement({
              tag: "h3",
              props: null,
              children: ["Switch Between Elements"],
            }),
            createElement({
              tag: "button",
              props: { click: this.toggleMode },
              children: ["Switch Mode"],
            }),
            this.state.mode === "greeting"
              ? createElement({
                  tag: "p",
                  props: { style: "color: green" },
                  children: ["Hello! Welcome to the framework."],
                })
              : createElement({
                  tag: "p",
                  props: { style: "color: orange" },
                  children: ["Goodbye! See you next time."],
                }),
          ],
        }),
      ],
    });
  }
}

export default ConditionalExample;
