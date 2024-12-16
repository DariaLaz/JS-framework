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
