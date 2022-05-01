export function createStore(reducer, preloadedState) {
    let currentObserver = null;
    function observable(state) {
        Object.keys(state).forEach((key) => {
            let _value = state[key];
            const observers = new Set();
            Object.defineProperty(state, key, {
                get() {
                    if (currentObserver)
                        observers.add(currentObserver);
                    return _value;
                },
                set(value) {
                    if (JSON.stringify(value) === JSON.stringify(_value))
                        return;
                    _value = value;
                    observers.forEach((fn) => fn());
                },
            });
        });
        return state;
    }
    function subscribe(fn) {
        currentObserver = fn;
        fn();
        currentObserver = null;
    }
    const state = observable(preloadedState);
    const frozenState = {};
    Object.keys(state).forEach((key) => {
        Object.defineProperty(frozenState, key, {
            get() {
                return state[key];
            },
        });
    });
    function dispatch(action) {
        const nextState = reducer(state, action);
        const keys = Object.keys(state);
        for (const key of keys) {
            state[key] = nextState[key];
        }
    }
    function getState() {
        return frozenState;
    }
    return { dispatch, subscribe, getState };
}
