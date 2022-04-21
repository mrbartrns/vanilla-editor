import { Queue } from './Queue.js';
import {
  store,
  SET_DOCUMENT_TREE,
  SET_CURRENT_DOCUMENT,
  SET_TOGGLE_CONTROLLER,
} from '../core/store.js';
import storage from './storage.js';
import { TOGGLE_INFO } from '../constants.js';

class DocumentTree {
  /**
   * find target that id === document.id and return
   * 메모리 값은 변하지 않기 때문에 노드를 찾고 바로 조작이 가능하다.
   */
  bfs(initialData, id) {
    const q = new Queue();
    initialData.forEach((document) => q.enqueue(document));
    while (!q.isEmpty()) {
      const document = q.dequeue();
      if (document.id === id) return document;
      document.documents.forEach((child) => q.enqueue(child));
    }
    return null;
  }

  setToggleOption(document, parent, toggleSet) {
    const dfs = (document, parent) => {
      const ret = {
        ...document,
        documents: [],
        toggled: toggleSet.has(document.id) ? true : false,
        parent,
      };
      for (const child of document.documents) {
        ret.documents.push(dfs(child, document.id));
      }
      return ret;
    };
    const treeWithToggleOptions = dfs(document, parent);
    return treeWithToggleOptions;
  }

  deleteSubTree(document, deletedId) {
    if (document.id === deletedId) return null;
    const ret = {
      ...document,
      documents: [],
    };
    for (const child of document.documents) {
      const result = this.deleteSubTree(child, deletedId);
      if (result) ret.documents.push(result);
    }
    return ret;
  }

  _toggleTree(id) {
    const nextDocumentTree = JSON.parse(
      JSON.stringify(store.getState().documentTree)
    ); // deep copy

    const target = this.bfs(nextDocumentTree, id);
    if (target) target.toggled = !target.toggled;

    store.dispatch({ type: SET_DOCUMENT_TREE, payload: nextDocumentTree });

    return target ? target.toggled : false;
  }

  /**
   * Document Tree에 Document를 추가하는 메소드
   */
  _addToTree(parentId, response) {
    const nextState = JSON.parse(JSON.stringify(store.getState().documentTree));

    // add new document on document tree
    const newDocument = {
      id: response.id,
      parent: parentId,
      title: '',
      documents: [],
      toggled: false,
    };

    // case if root or not
    if (parentId === null) {
      store.dispatch({
        type: SET_DOCUMENT_TREE,
        payload: [...nextState, newDocument],
      });
    } else {
      const target = this.bfs(nextState, parentId);
      if (target) {
        target.toggled = true;
        target.documents.push(newDocument);
      }

      store.dispatch({ type: SET_DOCUMENT_TREE, payload: nextState });
    }
    return newDocument;
  }

  _deleteFromTree(id) {
    const currentDocumentTree = JSON.parse(
      JSON.stringify(store.getState().documentTree)
    );

    // find that I want to delete
    const target = this.bfs(currentDocumentTree, id);
    if (!target) return;

    // create nextDocumentTree
    const nextDocumentTree = currentDocumentTree
      .map((document) => this.deleteSubTree(document, id))
      .filter((document) => document);

    /**
     * add remove target's documents into root
     * set child documents' parent as null
     */
    for (const child of target.documents) {
      child.parent = null;
      nextDocumentTree.push(child);
    }

    store.dispatch({ type: SET_DOCUMENT_TREE, payload: nextDocumentTree });
  }

  _onEdit(editorState) {
    store.dispatch({ type: SET_CURRENT_DOCUMENT, payload: editorState });

    const { id, title } = editorState;

    // sidebar update with title
    const nextDocumentTree = JSON.parse(
      JSON.stringify(store.getState().documentTree)
    ); // deep copy

    const target = this.bfs(nextDocumentTree, id);
    if (target) target.title = title;

    store.dispatch({ type: SET_DOCUMENT_TREE, payload: nextDocumentTree });
  }

  _addToToggleSet(id) {
    const ret = [...Array.from(store.getState().toggleController), id];

    store.dispatch({
      type: SET_TOGGLE_CONTROLLER,
      payload: ret,
    });
  }

  _deleteFromToggleSet(id) {
    const set = new Set(Array.from(store.getState().toggleController));
    set.delete(id);

    store.dispatch({ type: SET_TOGGLE_CONTROLLER, payload: Array.from(set) });
  }

  _saveToggleInfo() {
    const nextToggleInfo = store.getState().toggleController;
    storage.setItem(TOGGLE_INFO, nextToggleInfo);
  }
}
export default new DocumentTree();
