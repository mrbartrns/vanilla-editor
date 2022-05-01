import {
  TOGGLE_EVENT,
  ADD_TO_TREE_EVENT,
  DELETE_FROM_TREE_EVENT,
  CLICK_DOCUMENT_EVENT,
  EDIT_DOCUMENT_EVENT,
  CLICK_OUTSIDE_MODAL_EVENT,
  EDITOR_AUTOSAVE_EVENT,
  TOGGLE_INFO,
} from '../constants.js';
import tree from '../utils/DocumentTree.js';
import { fetchAdd, fetchDelete, fetchUpdate } from '../apis/request.js';
import { onRouteChange } from '../utils/router.js';
import storage from '../utils/storage.js';
import { getState, dispatch, SET_TOGGLE_CONTROLLER } from '../core/store.js';

class EventListener {
  constructor() {
    window.addEventListener(TOGGLE_EVENT, (e: any) => {
      const { id } = e.detail;
      const toggleInfo = getState().toggleController;
      const toggleSet = new Set<number>([...toggleInfo]);
      if (toggleSet.has(id)) {
        toggleSet.delete(id);
      } else {
        toggleSet.add(id);
      }
      const nextToggleInfo = Array.from(toggleSet);
      dispatch({ type: SET_TOGGLE_CONTROLLER, payload: nextToggleInfo });
      storage.setItem(TOGGLE_INFO, nextToggleInfo);
    });

    window.addEventListener(ADD_TO_TREE_EVENT, async (e: any) => {
      const { id } = e.detail;
      const response = await fetchAdd(id);
      const nextDocument = tree.addToTree(id, response);

      // change route
      onRouteChange(
        `/${nextDocument.parent ? `documents` : `modal`}/${nextDocument.id}`
      );
    });

    window.addEventListener(DELETE_FROM_TREE_EVENT, (e: any) => {
      const { id } = e.detail;
      tree._deleteFromTree(id);

      // request deleteAPI
      fetchDelete(id);

      // delete id from toggleSet
      const toggleInfo = getState().toggleController;
      const toggleSet = new Set<number>([...toggleInfo]);
      toggleSet.delete(id);
      const nextToggleInfo = Array.from(toggleSet);
      dispatch({ type: SET_TOGGLE_CONTROLLER, payload: nextToggleInfo });

      // if target id was what I saw, go to root page
      const { pathname } = location;
      if (pathname.indexOf('/documents/') === 0) {
        const [, , currentId] = pathname.split('/');
        if (Number(currentId) === id) {
          onRouteChange('/');
        }
      }
    });

    window.addEventListener(CLICK_DOCUMENT_EVENT, (e: any) => {
      const { id } = e.detail;

      onRouteChange(`/documents/${id}`);
    });

    window.addEventListener(EDITOR_AUTOSAVE_EVENT, (e: any) => {
      const { editorState } = e.detail;
      const { id, title, content } = editorState;
      fetchUpdate(id, JSON.stringify({ title, content }));
    });

    window.addEventListener(EDIT_DOCUMENT_EVENT, (e: any) => {
      const { editorState } = e.detail;
      tree._onEdit(editorState);
    });

    window.addEventListener(CLICK_OUTSIDE_MODAL_EVENT, () => {
      history.back();
    });
  }
}

export { EventListener };
