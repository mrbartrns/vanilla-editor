import { Queue } from './Queue.js';
import {
  getState,
  dispatch,
  SET_DOCUMENT_TREE,
  SET_CURRENT_DOCUMENT,
  SET_TOGGLE_CONTROLLER,
} from '../core/store.js';
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

  createDocumentTree(document: RootDocumentApi, parent: number | null) {
    const ret: Document = {
      ...document,
      documents: [],
      parent,
    };
    for (const child of document.documents) {
      ret.documents.push(this.createDocumentTree(child, document.id));
    }
    return ret;
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

  /**
   * Document Tree에 Document를 추가하는 메소드
   * TODO: 얘도 분리하기
   */
  addToTree(parentId: number | null, response: CreateDocumentResponse) {
    const nextState: Document[] = JSON.parse(
      JSON.stringify(getState().documentTree)
    );

    // add new document on document tree
    const newDocument: Document = {
      id: response.id,
      parent: parentId,
      title: '',
      documents: [],
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
        const toggleInfo = getState().toggleController;
        const toggleSet = new Set(toggleInfo);
        toggleSet.add(target.id);
        dispatch({
          type: SET_TOGGLE_CONTROLLER,
          payload: Array.from(toggleSet),
        });
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

    // TODO: nextDocumentTree 반환 및 dispatch 분리
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
}
export default new DocumentTree();
