import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class StyleExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      color: "blue",
      fontSize: 16,
      bgDark: false,
    };
  }

  cycleColor = () => {
    const colors = ["blue", "red", "green", "purple", "orange", "teal"];
    const currentIndex = colors.indexOf(this.state.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    this.setState({ color: colors[nextIndex] });
  };

  increaseFontSize = () => {
    this.setState({ fontSize: Math.min(this.state.fontSize + 2, 40) });
  };

  decreaseFontSize = () => {
    this.setState({ fontSize: Math.max(this.state.fontSize - 2, 10) });
  };

  toggleBackground = () => {
    this.setState({ bgDark: !this.state.bgDark });
  };

  render() {
    const previewStyle =
      "color: " + this.state.color +
      "; font-size: " + this.state.fontSize + "px" +
      "; background: " + (this.state.bgDark ? "#333" : "#fff") +
      "; padding: 16px; border-radius: 4px; border: 1px solid #ccc; margin: 8px 0; transition: all 0.2s";

    return createElement({
      tag: "div",
      props: { class: "example-section" },
      children: [
        createElement({
          tag: "h2",
          props: null,
          children: ["Dynamic Styles"],
        }),

        createElement({
          tag: "div",
          props: { style: previewStyle },
          children: [
            "This text is styled dynamically! Color: " + this.state.color +
            ", Size: " + this.state.fontSize + "px",
          ],
        }),

        createElement({
          tag: "div",
          props: { class: "button-group" },
          children: [
            createElement({
              tag: "button",
              props: {
                style: "color: " + this.state.color,
                click: this.cycleColor,
              },
              children: ["Cycle Color (" + this.state.color + ")"],
            }),
          ],
        }),

        createElement({
          tag: "div",
          props: { class: "button-group" },
          children: [
            createElement({
              tag: "button",
              props: { click: this.decreaseFontSize },
              children: ["Decrease Font Size"],
            }),
            createElement({
              tag: "span",
              props: { style: "padding: 0 8px; line-height: 32px" },
              children: [this.state.fontSize + "px"],
            }),
            createElement({
              tag: "button",
              props: { click: this.increaseFontSize },
              children: ["Increase Font Size"],
            }),
          ],
        }),

        createElement({
          tag: "div",
          props: { class: "button-group" },
          children: [
            createElement({
              tag: "button",
              props: { click: this.toggleBackground },
              children: [this.state.bgDark ? "Light Background" : "Dark Background"],
            }),
          ],
        }),
      ],
    });
  }
}

export default StyleExample;
