import { createStore } from './createStore.js';
import { Action } from './types/actions.js';
import { Document, DocumentContentApi } from '../apis/types/apis.js';

export const SET_DOCUMENT_TREE = 'SET_DOCUMENT_TREE' as const;
export const SET_CURRENT_DOCUMENT = 'SET_CURRENT_DOCUMENT' as const;
export const SET_TOGGLE_CONTROLLER = 'SET_TOGGLE_CONTROLLER' as const;

interface IStore {
  documentTree: Document[];
  currentDocument: DocumentContentApi | undefined;
  toggleController: number[];
}

const initialState: IStore = {
  documentTree: [],
  currentDocument: undefined,
  toggleController: [],
};

interface StoreAction extends Action {
  payload: any;
}

const reducer: (
  state: typeof initialState,
  action: StoreAction
) => typeof initialState = (
  state: typeof initialState,
  action: StoreAction
) => {
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
