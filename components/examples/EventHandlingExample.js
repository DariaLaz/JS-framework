import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class EventHandlingExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      log: [],
      clickCount: 0,
    };
  }

  addLog = (message) => {
    const maxEntries = 8;
    const newLog = [...this.state.log, message].slice(-maxEntries);
    this.setState({ log: newLog });
  };

  handleClick = () => {
    const count = this.state.clickCount + 1;
    this.setState({ clickCount: count });
    this.addLog("click (#" + count + ")");
  };

  handleDblClick = () => {
    this.addLog("dblclick - Double clicked!");
  };

  handleMouseOver = () => {
    this.addLog("mouseover - Mouse entered the hover zone");
  };

  handleMouseOut = () => {
    this.addLog("mouseout - Mouse left the hover zone");
  };

  handleKeyDown = (e) => {
    this.addLog("keydown - Key: " + e.key);
  };

  handleFocus = () => {
    this.addLog("focus - Input focused");
  };

  handleBlur = () => {
    this.addLog("blur - Input blurred");
  };

  clearLog = () => {
    this.setState({ log: [], clickCount: 0 });
  };

  render() {
    return createElement({
      tag: "div",
      props: { class: "example-section" },
      children: [
        createElement({
          tag: "h2",
          props: null,
          children: ["Event Handling"],
        }),

        createElement({
          tag: "div",
          props: { class: "button-group" },
          children: [
            createElement({
              tag: "button",
              props: { click: this.handleClick, dblclick: this.handleDblClick },
              children: ["Click Me (or Double-Click)"],
            }),
            createElement({
              tag: "button",
              props: { click: this.clearLog },
              children: ["Clear Log"],
            }),
          ],
        }),

        createElement({
          tag: "div",
          props: {
            class: "example-hover-zone",
            style: "padding: 12px; margin: 8px 0; border: 2px dashed #888; text-align: center",
            mouseover: this.handleMouseOver,
            mouseout: this.handleMouseOut,
          },
          children: ["Hover over this area"],
        }),

        createElement({
          tag: "div",
          props: { style: "margin: 8px 0" },
          children: [
            createElement({
              tag: "span",
              props: null,
              children: ["Type here: "],
            }),
            createElement({
              tag: "input",
              props: {
                type: "text",
                style: "padding: 4px 8px",
                keydown: this.handleKeyDown,
                focus: this.handleFocus,
                blur: this.handleBlur,
              },
              children: [],
            }),
          ],
        }),

        createElement({
          tag: "div",
          props: { class: "example-log" },
          children: [
            createElement({
              tag: "h3",
              props: null,
              children: ["Event Log"],
            }),
            ...this.state.log.map((entry, i) =>
              createElement({
                key: "log-" + i,
                tag: "p",
                props: { class: "log-entry", style: "margin: 2px 0; font-family: monospace; font-size: 13px" },
                children: [entry],
              }),
            ),
            this.state.log.length === 0
              ? createElement({
                  tag: "p",
                  props: { style: "color: #888; font-style: italic" },
                  children: ["No events yet. Interact with the controls above."],
                })
              : null,
          ],
        }),
      ],
    });
  }
}

export default EventHandlingExample;
