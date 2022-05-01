import { createStore } from './createStore.js';
export const SET_DOCUMENT_TREE = 'SET_DOCUMENT_TREE';
export const SET_CURRENT_DOCUMENT = 'SET_CURRENT_DOCUMENT';
export const SET_TOGGLE_CONTROLLER = 'SET_TOGGLE_CONTROLLER';
const initialState = {
    documentTree: [],
    currentDocument: undefined,
    toggleController: [],
};
const reducer = (state, action) => {
    switch (action.type) {
        case SET_DOCUMENT_TREE:
            return { ...state, documentTree: action.payload };
        case SET_CURRENT_DOCUMENT:
            return { ...state, currentDocument: action.payload };
        case SET_TOGGLE_CONTROLLER:
            return { ...state, toggleController: action.payload };
        default:
            return state;
    }
};
const { getState, subscribe, dispatch } = createStore(reducer, initialState);
export { getState, dispatch, subscribe };
