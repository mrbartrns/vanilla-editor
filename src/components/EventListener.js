import {
  TOGGLE_EVENT,
  ADD_TO_TREE_EVENT,
  DELETE_FROM_TREE_EVENT,
  CLICK_DOCUMENT_EVENT,
  EDIT_DOCUMENT_EVENT,
  CLICK_OUTSIDE_MODAL_EVENT,
  EDITOR_AUTOSAVE_EVENT,
} from '../constants.js';
import tree from '../utils/DocumentTree.js';
import { fetchAdd, fetchDelete, fetchUpdate } from '../utils/request.js';
import { onRouteChange } from '../utils/router.js';

class EventListener {
  constructor() {
    window.addEventListener(TOGGLE_EVENT, (e) => {
      const { id } = e.detail;
      const toggleResult = tree._toggleTree(id);
      if (toggleResult) {
        tree._addToToggleSet(id);
      } else {
        tree._deleteFromToggleSet(id);
      }
      tree._saveToggleInfo();
    });

    window.addEventListener(ADD_TO_TREE_EVENT, async (e) => {
      const { id } = e.detail;
      const response = await fetchAdd(id);
      const nextDocument = tree._addToTree(id, response);

      // change route
      onRouteChange(
        `/${nextDocument.parent ? `documents` : `modal`}/${nextDocument.id}`
      );
    });

    window.addEventListener(DELETE_FROM_TREE_EVENT, (e) => {
      const { id } = e.detail;
      tree._deleteFromTree(id);

      // request deleteAPI
      fetchDelete(id);
      tree._deleteFromToggleSet(id);
      tree._saveToggleInfo();

      // if target id was what I saw, go to root page
      const { pathname } = location;
      if (pathname.indexOf('/documents/') === 0) {
        const [, , currentId] = pathname.split('/');
        if (Number(currentId) === id) {
          onRouteChange('/');
        }
      }
    });

    window.addEventListener(CLICK_DOCUMENT_EVENT, (e) => {
      const { id } = e.detail;

      onRouteChange(`/documents/${id}`);
    });

    window.addEventListener(EDITOR_AUTOSAVE_EVENT, (e) => {
      const { editorState } = e.detail;
      const { id, title, content } = editorState;
      fetchUpdate(id, JSON.stringify({ title, content }));
    });

    window.addEventListener(EDIT_DOCUMENT_EVENT, (e) => {
      const { editorState } = e.detail;
      tree._onEdit(editorState);
    });

    window.addEventListener(CLICK_OUTSIDE_MODAL_EVENT, () => {
      history.back();
    });
  }
}

export { EventListener };
