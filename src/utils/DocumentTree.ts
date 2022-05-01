import { Queue } from './Queue.js';
import {
  getState,
  dispatch,
  SET_DOCUMENT_TREE,
  SET_CURRENT_DOCUMENT,
  SET_TOGGLE_CONTROLLER,
} from '../core/store.js';
import storage from './storage.js';
import { TOGGLE_INFO } from '../constants.js';

import {
  CreateDocumentResponse,
  Document,
  DocumentContentApi,
  RootDocumentApi,
} from '../apis/types/apis.js';

class DocumentTree {
  /**
   * find target that id === document.id and return
   * 메모리 값은 변하지 않기 때문에 노드를 찾고 바로 조작이 가능하다.
   */
  bfs(initialData: Document[], id: number | string) {
    const q = new Queue<Document>();
    initialData.forEach((document) => q.enqueue(document));
    while (!q.isEmpty()) {
      const document = q.dequeue() as Document;
      if (document.id === id) return document;
      document.documents.forEach((child) => q.enqueue(child));
    }
    return null;
  }

  createDocumentTree(
    document: RootDocumentApi,
    parent: number | null,
    toggleSet: Set<number>
  ) {
    const dfs = (document: RootDocumentApi, parent: number | null) => {
      const ret: Document = {
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

  deleteSubTree(document: Document, deletedId: string | number) {
    if (document.id === deletedId) return null;
    const ret: Document = {
      ...document,
      documents: [],
    };
    for (const child of document.documents) {
      const result = this.deleteSubTree(child, deletedId);
      if (result) ret.documents.push(result);
    }
    return ret;
  }

  _toggleTree(id: string | number) {
    const nextDocumentTree = JSON.parse(
      JSON.stringify(getState().documentTree)
    ); // deep copy

    const target = this.bfs(nextDocumentTree, id);
    if (target) target.toggled = !target.toggled;

    dispatch({ type: SET_DOCUMENT_TREE, payload: nextDocumentTree });

    return target ? target.toggled : false;
  }

  /**
   * Document Tree에 Document를 추가하는 메소드
   */
  _addToTree(parentId: number | null, response: CreateDocumentResponse) {
    const nextState = JSON.parse(JSON.stringify(getState().documentTree));

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
      dispatch({
        type: SET_DOCUMENT_TREE,
        payload: [...nextState, newDocument],
      });
    } else {
      const target = this.bfs(nextState, parentId);
      if (target) {
        target.toggled = true;
        target.documents.push(newDocument);
      }

      dispatch({ type: SET_DOCUMENT_TREE, payload: nextState });
    }
    return newDocument;
  }

  _deleteFromTree(id: number) {
    const currentDocumentTree: Document[] = JSON.parse(
      JSON.stringify(getState().documentTree)
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

    dispatch({ type: SET_DOCUMENT_TREE, payload: nextDocumentTree });
  }

  _onEdit(editorState: DocumentContentApi) {
    dispatch({ type: SET_CURRENT_DOCUMENT, payload: editorState });

    const { id, title } = editorState;

    // sidebar update with title
    const nextDocumentTree = JSON.parse(
      JSON.stringify(getState().documentTree)
    ); // deep copy

    const target = this.bfs(nextDocumentTree, id);
    if (target) target.title = title;

    dispatch({ type: SET_DOCUMENT_TREE, payload: nextDocumentTree });
  }

  _addToToggleSet(id: number) {
    const ret = [...getState().toggleController, id];

    dispatch({
      type: SET_TOGGLE_CONTROLLER,
      payload: ret,
    });
  }

  _deleteFromToggleSet(id: number) {
    const set = new Set(Array.from(getState().toggleController));
    set.delete(id);

    dispatch({ type: SET_TOGGLE_CONTROLLER, payload: Array.from(set) });
  }

  _saveToggleInfo() {
    const nextToggleInfo = getState().toggleController;
    storage.setItem(TOGGLE_INFO, nextToggleInfo);
  }
}
export default new DocumentTree();
