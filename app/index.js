import ExampleComponent from "../components/exampleComponent.js";
import useEffect  from "../hooks/useEffect.js";

const helloComponent = new ExampleComponent({
  greeting: "Hello, World!",
  message: "Welcome",
  buttonColor: "red",
});

const helloComponent1 = new ExampleComponent({
  greeting: "sedefs",
  message: "esdafc",
  buttonColor: "red",
});
helloComponent.attachTo(document.body);
helloComponent1.attachTo(document.body);

useEffect(() => {
  console.log("Effect called");
}, [helloComponent]);

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
