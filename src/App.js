import { Component } from './components/Component.js';
import { init } from './utils/router.js';
import { Sidebar } from './components/Sidebar/Sidebar.js';
import { fetchDocumentTree, fetchContent } from './utils/request.js';
import { Editor } from './components/Editor.js';
import { Modal } from './components/Modal.js';
import tree from './utils/DocumentTree.js';
import storage from './utils/storage.js';
import { TOGGLE_INFO } from './constants.js';
import {
  store,
  SET_CURRENT_DOCUMENT,
  SET_DOCUMENT_TREE,
  SET_TOGGLE_CONTROLLER,
} from './core/store.js';
import { EventListener } from './components/EventListener.js';
import { MessagePage } from './components/MessagePage.js';

class App extends Component {
  state;
  $sidebar;
  $content;
  constructor({ $target }) {
    super({ $target, elementType: 'div' });
    this.$element.id = 'App';

    // router 변경 시 navbar 부분은 렌더링되면 안된다.
    this.$sidebar = new Sidebar({
      $target: this.$element,
    });

    new EventListener();

    // router가 동작하기 전에 div 등록
    const right = document.createElement('div');
    right.className = 'container';
    this.$element.appendChild(right);
    this.$content = document.createElement('div');
    this.$content.className = 'content';
    right.appendChild(this.$content);

    this.fetchInit();

    this.router();

    init(() => {
      this.router();
    });

    window.addEventListener('popstate', () => {
      this.router();
    });
  }

  async router() {
    const { pathname } = location;
    this.$sidebar.$body.renderTemplate();

    // SET CURRENT SELECTED CLASS ON LIST BY PATHNAME
    this.$content.innerHTML = '';
    if (pathname === '/') {
      new MessagePage({
        $target: this.$content,
        text: '문서를 클릭하여 편집기를 열거나 새 문서를 만드세요.',
      });
    } else if (
      pathname.indexOf('/documents/') === 0 &&
      pathname.split('/').length === 3
    ) {
      const [, , id] = pathname.split('/');
      const response = await fetchContent(Number(id));

      store.dispatch({ type: SET_CURRENT_DOCUMENT, payload: response });

      new Editor({
        $target: this.$content,
      });
    } else if (
      pathname.indexOf('/modal/') === 0 &&
      pathname.split('/').length === 3
    ) {
      const [, , id] = pathname.split('/');
      const response = await fetchContent(Number(id));

      store.dispatch({ type: SET_CURRENT_DOCUMENT, payload: response });

      new Modal({
        $target: this.$content,
        initialState: response,
      });
    } else {
      new MessagePage({
        $target: this.$content,
        text: '문서가 이미 삭제되었거나 잘못된 접근입니다.',
      });
    }
  }

  async fetchInit() {
    const response = await fetchDocumentTree();
    const toggles = storage.getItem(TOGGLE_INFO, []);

    // TODO: validation
    store.dispatch({ type: SET_TOGGLE_CONTROLLER, payload: toggles });

    const data = response.map((document) =>
      tree.setToggleOption(
        document,
        null,
        new Set(store.getState().toggleController)
      )
    );

    store.dispatch({ type: SET_DOCUMENT_TREE, payload: data });
  }
}
export { App };
