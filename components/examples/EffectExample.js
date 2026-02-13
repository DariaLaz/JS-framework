import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class EffectExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      renderCount: 0,
      message: "Hello",
      timerRunning: false,
      timerTicks: 0,
    };
    this.effectLog = [];
  }

  appendLog = (entry) => {
    const maxEntries = 10;
    this.effectLog = [...this.effectLog, entry].slice(-maxEntries);
  };

  triggerRender = () => {
    this.setState({ renderCount: this.state.renderCount + 1 });
  };

  changeMessage = () => {
    const messages = ["Hello", "World", "React", "Virtual DOM", "Effects"];
    const currentIndex = messages.indexOf(this.state.message);
    const nextIndex = (currentIndex + 1) % messages.length;
    this.setState({ message: messages[nextIndex] });
  };

  toggleTimer = () => {
    this.setState({ timerRunning: !this.state.timerRunning });
  };

  render() {
    this.useEffect(() => {
      this.appendLog(
        "Effect 1: Ran (every render) - render #" + this.state.renderCount,
      );
    });

    this.useEffect(() => {
      this.appendLog(
        'Effect 2: Message changed to "' + this.state.message + '"',
      );
    }, [this.state.message]);

    this.useEffect(() => {
      if (this.state.timerRunning) {
        this.appendLog("Effect 3: Timer started");

        const intervalId = setInterval(() => {
          this.setState({ timerTicks: this.state.timerTicks + 1 });
        }, 1000);

        return () => {
          clearInterval(intervalId);
          this.appendLog("Effect 3: Timer cleaned up (interval cleared)");
        };
      }
    }, [this.state.timerRunning]);

    return createElement({
      tag: "div",
      props: { class: "example-section" },
      children: [
        createElement({
          tag: "h2",
          props: null,
          children: ["useEffect & Cleanup"],
        }),

        createElement({
          tag: "div",
          props: { class: "example-subsection" },
          children: [
            createElement({
              tag: "h3",
              props: null,
              children: ["Effect on Every Render"],
            }),
            createElement({
              tag: "p",
              props: null,
              children: ["Render count: " + this.state.renderCount],
            }),
            createElement({
              tag: "button",
              props: { click: this.triggerRender },
              children: ["Trigger Re-render"],
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
              children: ["Effect with Dependencies"],
            }),
            createElement({
              tag: "p",
              props: null,
              children: ['Current message: "' + this.state.message + '"'],
            }),
            createElement({
              tag: "button",
              props: { click: this.changeMessage },
              children: ["Change Message"],
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
              children: ["Effect with Cleanup (Timer)"],
            }),
            createElement({
              tag: "p",
              props: null,
              children: [
                "Timer: " +
                  (this.state.timerRunning ? "Running" : "Stopped") +
                  " | Ticks: " +
                  this.state.timerTicks,
              ],
            }),
            createElement({
              tag: "button",
              props: { click: this.toggleTimer },
              children: [
                this.state.timerRunning ? "Stop Timer" : "Start Timer",
              ],
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
              children: ["Effect Log"],
            }),
            ...this.effectLog.map((entry, i) =>
              createElement({
                key: "elog-" + i,
                tag: "p",
                props: {
                  style:
                    "margin: 2px 0; font-family: monospace; font-size: 13px",
                },
                children: [entry],
              }),
            ),
            this.effectLog.length === 0
              ? createElement({
                  tag: "p",
                  props: { style: "color: #888; font-style: italic" },
                  children: ["No effects have run yet."],
                })
              : null,
          ],
        }),
      ],
    });
  }
}

export default EffectExample;
