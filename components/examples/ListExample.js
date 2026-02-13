import { createElement } from "../../virtualDom/virtualDom/VirtualDOMElement.js";
import BaseComponent from "../baseComponent.js";

class ListExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: ["Apple", "Banana", "Cherry"],
      nextId: 3,
    };
  }

  addItem = () => {
    const fruits = ["Mango", "Peach", "Grape", "Kiwi", "Lemon", "Pear", "Plum", "Fig"];
    const fruit = fruits[this.state.nextId % fruits.length];
    this.setState({
      items: [...this.state.items, fruit],
      nextId: this.state.nextId + 1,
    });
  };

  removeFirst = () => {
    if (this.state.items.length === 0) return;
    this.setState({
      items: this.state.items.slice(1),
    });
  };

  removeLast = () => {
    if (this.state.items.length === 0) return;
    this.setState({
      items: this.state.items.slice(0, -1),
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
          children: ["Dynamic Lists with Keys"],
        }),
        createElement({
          tag: "p",
          props: null,
          children: ["Items: " + this.state.items.length],
        }),
        createElement({
          tag: "div",
          props: { class: "button-group" },
          children: [
            createElement({
              tag: "button",
              props: { click: this.addItem },
              children: ["Add Item"],
            }),
            createElement({
              tag: "button",
              props: { click: this.removeFirst },
              children: ["Remove First"],
            }),
            createElement({
              tag: "button",
              props: { click: this.removeLast },
              children: ["Remove Last"],
            }),
          ],
        }),
        createElement({
          tag: "ul",
          props: { class: "example-list" },
          children: this.state.items.map((item, index) =>
            createElement({
              key: "item-" + index,
              tag: "li",
              props: null,
              children: [item],
            }),
          ),
        }),
      ],
    });
  }
}

export default ListExample;
