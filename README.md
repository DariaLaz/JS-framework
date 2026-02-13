# JS-framework

A frontend framework, implementing essential features for building dynamic user interfaces.

## Features

- **Component-Based Architecture:** Create reusable and modular UI components.
- **Property Passing:** Dynamically pass data between components.
- **State Management:** Utilize custom hooks like `useState` for efficient state handling.
- **Side Effects Handling:** Manage side effects with the `useEffect` hook.
- **Performance Optimization:**
  - Optimize re-rendering to affect only necessary components.
  - Implement `useMemo` and `useCallback` hooks for memoization.
- **Context API:**
  - Provide and consume context values across the component tree.
  - Handle multiple identical contexts gracefully.

## Virtual DOM

_The main idea of a virtual DOM tree is to create an in-memory representation of the real DOM, which allows for efficient updates and rendering. By using a virtual DOM, changes to the UI can be computed and applied in a more optimized manner. When the state of an application changes, a new virtual DOM tree is created and compared to the previous one to identify the differences (or patches). These patches are then applied to the real DOM in a single, efficient update, minimizing direct DOM manipulations and improving performance._

Several components work together to create, render, and update a virtual DOM, which can then be used to efficiently update the real DOM based on changes in the virtual DOM.

The main atom here is `DOMElement` -> Represents a virtual DOM element with a tag, props, and children (other `DOMelement`s).

Fuctionalities:

- `createElement` -> Creates a new `DOMElement` instance.
- `renderElement` ->
  - Converts a DOMElement instance into a real DOM element.
  - Handles text nodes and HTML elements.
  - Sets attributes and event listeners on the created element.
  - Recursively renders and appends child elements.

```
NOTE: Patch - set of changes that need to be applied to the real DOM to make it match the updated virtual DOM
```

PatchType Object: Defines different types of patches (e.g., REMOVE, REPLACE, PROPS, CHILDREN, ADD, TEXT) used to update the real DOM.

- `diff` -> Compares two virtual DOM trees (oldTree and newTree) and generates a set of patches.
  - Uses a depth-first traversal to compare nodes.
  - `diffProps` -> Compares the properties of two DOMElement instances and returns the differences between the old and new properties.
- `patch` -> Applies the generated patches to the real DOM.
  - Uses a depth-first traversal to apply patches to the corresponding real DOM nodes.
  - Handles different patch types (e.g., REMOVE, REPLACE, PROPS, TEXT, ADD).

## Components

#### BaseComponent for Virtual DOM Management

_This class serves as a base for creating components that can efficiently update the DOM by minimizing direct manipulations and leveraging virtual DOM diffing and patching._

The `BaseComponent` class is designed to manage the lifecycle and state of components using a virtual DOM approach.

- `Constructor` -> Initializes the component with `props`, an empty `state`, a root `div` element, and a placeholder for the old virtual DOM tree.
- `Render` -> Meant to be implemented by subclasses to return a virtual DOM representation of the component.
- `setState` -> Merges new state with the existing state and triggers a re-render of the component.
- `update` -> Generates a new virtual DOM tree, finds the differences with the old tree, and applies the necessary patches to the real DOM.
- `attachTo` -> Renders the component and attaches it to a specified container in the real DOM.
