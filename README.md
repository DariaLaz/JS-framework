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

## TODO

- [ ] **Create Components**
  - Develop reusable UI components for the application.
  
- [ ] **Pass Properties to Components**
  - Implement property passing to allow dynamic data flow between components.
  
- [ ] **Implement DOM Tree Update Function**
  - Create a function responsible for updating the DOM tree based on state changes.
  
- [ ] **Maintain State Between Renders**
  - Use references to preserve component state across multiple render cycles.
  
- [ ] **Develop `useState` Hook for State Management**
  - Implement a custom `useState` hook to manage component state effectively.
  
- [ ] **Implement `useEffect` Hook**
  - Create a `useEffect` hook that executes after the render function is called, handling side effects.
  
- [ ] **Optimize Re-rendering**
  - Ensure that only the component invoking the update and its child components are re-rendered to improve performance.
  
- [ ] **Add Memoization for Pure Components**
  - Utilize memoization techniques to make components pure, preventing unnecessary re-renders.
  
- [ ] **Implement `useMemo` Hook**
  - Develop a `useMemo` hook to memoize expensive computations within components.
  
- [ ] **Implement `useCallback` Hook**
  - Create a `useCallback` hook to memoize callback functions, enhancing performance by avoiding unnecessary re-creations.
  
- [ ] **Develop Context API**
  - **Create a Provider:**
    - Implement a Provider component to supply context values at a specific level in the component tree.
  - **Access Context in Child Components:**
    - Enable child components to consume context values seamlessly.
  - **Handle Multiple Identical Contexts:**
    - Ensure that when multiple identical contexts exist, the innermost context is utilized by child components.
   
# Documentation




## Virtual DOM
_The main idea of a virtual DOM tree is to create an in-memory representation of the real DOM, which allows for efficient updates and rendering. By using a virtual DOM, changes to the UI can be computed and applied in a more optimized manner. When the state of an application changes, a new virtual DOM tree is created and compared to the previous one to identify the differences (or patches). These patches are then applied to the real DOM in a single, efficient update, minimizing direct DOM manipulations and improving performance._

Several components work together to create, render, and update a virtual DOM, which can then be used to efficiently update the real DOM based on changes in the virtual DOM.

The main atom here is  `DOMElement` -> Represents a virtual DOM element with a tag, props, and children (other `DOMelement`s).

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



