import { createElement } from "../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "./baseComponent.js";
import { ExampleComponent1 } from "./exampleComponent1.js";

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
    return createElement({
      tag: "div",
      props: { class: "example-component" },
      children: [
        // createElement({
        //   tag: ExampleComponent1,
        //   props: {
        //     greeting: "Hello World",
        //     message: "This is a message from the parent component",
        //   },
        //   children: [
        //     createElement({
        //       tag: "p",
        //       props: null,
        //       children: ["This is a child component"],
        //     }),
        //   ],
        // }),
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
              children: ["This is a child component " + i],
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

        // TODO: remove this and click on the button below and the code crashes
        createElement({
          tag: "br",
          props: null,
          children: null,
        }),

        // TODO Daria this crashes when clicked
        createElement({
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
