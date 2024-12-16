import BaseComponent from './baseComponent.js';
import { createElement } from './virtualDom.js';

class ExampleComponent extends BaseComponent {
    render() {
        return (
            createElement('div', null,
                createElement('h1', null, this.props.greeting),
                createElement('p', null, this.state.message))
            
        );
    }
}

export default ExampleComponent;