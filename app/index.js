import ExampleComponent from '../components/exampleComponent.js';

const helloComponent = new ExampleComponent({ greeting: 'Hello, World!' });
helloComponent.setState({ message: 'Welcome' });
helloComponent.attachTo(document.body);