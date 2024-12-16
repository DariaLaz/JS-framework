import { html, render as litRender } from 'lit-html';
import { diff, patch, renderElement } from './virtualDom.js';

class BaseComponent {
    constructor(props) {
        this.props = props;
        this.state = {};
        this.root = document.createElement('div');
    }

    render() {
        return html``;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    update() {
        const newTree = this.render();
        const patches = diff(this.oldTree, newTree);
        patch(this.root, patches);
        this.oldTree = newTree;
    }

    attachTo(container) {
        this.oldTree = this.render();
        const element = renderElement(this.oldTree);
        this.root.appendChild(element);
        container.appendChild(this.root);
    }
}

export default BaseComponent;