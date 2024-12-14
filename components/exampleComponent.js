import BaseComponent from './baseComponent.js';
import { html } from 'lit-html';

class ExampleComponent extends BaseComponent {
    render() {
        return html`
            <div>
                <h1>${this.props.greeting}</h1>
                <p>${this.state.message}</p>
            </div>
        `;
    }
}

export default ExampleComponent;