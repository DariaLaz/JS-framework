import { html, render as litRender } from 'lit-html';

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
        this._litRender();
    }

    _litRender() {
        litRender(this.render(), this.root);
    }

    attachTo(container) {
        container.appendChild(this.root);
        this._litRender();
    }
}

export default BaseComponent;