import { observable } from './observer.js';

const createStore = (reducer) => {
  const state = observable(reducer());

  const fronzenState = {};
  Object.keys(state).forEach((key) => {
    Object.defineProperty(fronzenState, key, {
      get: () => state[key],
    });
  });

  const dispatch = (action) => {
    const newState = reducer(state, action);

    for (const [key, value] of Object.entries(newState)) {
      // if (!state[key]) -> undefined 못잡아냄
      state[key] = value;
    }
  };

  const getState = () => fronzenState;
  return { dispatch, getState };
};

export { createStore };
