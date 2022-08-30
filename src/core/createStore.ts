import { Reducer } from './types/reducers.js';
import { Action, AnyAction } from './types/actions.js';
import { StoreObject, CurrentObserver } from './types/stores.js';

export default function createStore<
  S extends StoreObject,
  A extends Action = AnyAction,
>(reducer: Reducer<S, A>, preloadedState: S) {
  let currentObserver: null | CurrentObserver = null;

  function observable(state: S): S {
    Object.keys(state).forEach((key) => {
      let currentValue = state[key];
      const observers = new Set<CurrentObserver>();
      Object.defineProperty(state, key, {
        get() {
          if (currentObserver) observers.add(currentObserver);
          return currentValue;
        },
        set(value) {
          if (JSON.stringify(value) === JSON.stringify(currentValue)) return;
          currentValue = value;
          observers.forEach((fn) => fn());
        },
      });
    });
    return state;
  }

  function subscribe(fn: CurrentObserver) {
    currentObserver = fn;
    fn();
    currentObserver = null;
  }

  const state = observable(preloadedState);

  const frozenState = {} as S;
  Object.keys(state).forEach((key) => {
    Object.defineProperty(frozenState, key, {
      get() {
        return state[key];
      },
    });
  });

  function dispatch(action: A) {
    const nextState = reducer(state, action);
    const keys: (keyof S)[] = Object.keys(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      state[key] = nextState[key];
    }
  }

  function getState() {
    return frozenState;
  }

  return { dispatch, subscribe, getState };
}
