import ExampleComponent from '../components/exampleComponent.js';

const helloComponent = new ExampleComponent({ greeting: 'Hello, World!' });
helloComponent.setState({ message: 'Welcome' });
helloComponent.attachTo(document.body);

setTimeout(() => {
    helloComponent.setState({ message: 'Goodbye' });
}, 1000);

setTimeout(() => {
    helloComponent.setState({ message: 'Hello again' });
}, 2000);