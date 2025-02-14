// TODO: nz dali taka tr da e ama maj maj

import hookManager from "./hookManager";

class State {
  constructor() {
    this.state = null;

    hookManager.addHook(this);
  }

  setState(newState) {
    this.state = newState;
  }
}

export function useState(initialState) {
  const state = new State();
  state.setState(initialState);
  return [state.state, state.setState.bind(state)];
}
