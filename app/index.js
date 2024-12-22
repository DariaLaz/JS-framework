import ExampleComponent from "../components/exampleComponent.js";

const helloComponent = new ExampleComponent({
  greeting: "Hello, World!",
  message: "Welcome",
});
helloComponent.attachTo(document.body);

// setTimeout(() => {
//   helloComponent.setState({ message: "Goodbye" });
// }, 1000);

// setTimeout(() => {
//   helloComponent.setState({ message: "Hello again" });
// }, 2000);

// setTimeout(() => {
//   helloComponent.setState({ showButton: false });
// }, 3000);

// setTimeout(() => {
//   helloComponent.setState({ showButton: true });
// }, 4000);

// setTimeout(() => {
//     helloComponent.detach();
// }, 5000);
