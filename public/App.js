import { Component } from './components/Component.js';
import { init } from './utils/router.js';
import { Sidebar } from './components/Sidebar/Sidebar.js';
import { fetchDocumentTree, fetchContent } from './apis/request.js';
import { Editor } from './components/Editor.js';
import { Modal } from './components/Modal.js';
import tree from './utils/DocumentTree.js';
import storage from './utils/storage.js';
import { TOGGLE_INFO } from './constants.js';
import { getState, dispatch, SET_CURRENT_DOCUMENT, SET_DOCUMENT_TREE, SET_TOGGLE_CONTROLLER, } from './core/store.js';
import { EventListener } from './components/EventListener.js';
import { MessagePage } from './components/MessagePage.js';
class App extends Component {
    $sidebar;
    constructor({ $target }) {
        super({ $target, elementType: 'div' });
        this.$element.id = 'App';
        this.render();
        // router 변경 시 navbar 부분은 렌더링되면 안된다.
        this.$sidebar = new Sidebar({
            $target: this.$element,
        });
        new EventListener();
        const container = document.querySelector('.container');
        if (container)
            this.$element.appendChild(container);
        this.fetchInit();
        this.router();
        init(() => {
            this.router();
        });
        window.addEventListener('popstate', () => {
            this.router();
        });
    }
    template() {
        return `
      <div class="container">
        <div class="content">
        </div>
      </div>
    `;
    }
    async router() {
        const { pathname } = location;
        this.$sidebar.$body.render();
        // SET CURRENT SELECTED CLASS ON LIST BY PATHNAME
        const $content = document.querySelector('.content');
        if (!$content)
            throw Error('check class name of container.');
        $content.innerHTML = '';
        if (pathname === '/') {
            new MessagePage({
                $target: $content,
                text: '문서를 클릭하여 편집기를 열거나 새 문서를 만드세요.',
            });
        }
        else if (pathname.indexOf('/documents/') === 0) {
            const [, , id] = pathname.split('/');
            const response = await fetchContent(Number(id));
            dispatch({ type: SET_CURRENT_DOCUMENT, payload: response });
            new Editor({
                $target: $content,
            });
        }
        else if (pathname.indexOf('/modal/') === 0) {
            const [, , id] = pathname.split('/');
            const response = await fetchContent(Number(id));
            dispatch({ type: SET_CURRENT_DOCUMENT, payload: response });
            new Modal({
                $target: $content,
            });
        }
        else {
            new MessagePage({
                $target: $content,
                text: '문서가 이미 삭제되었거나 잘못된 접근입니다.',
            });
        }
    }
    async fetchInit() {
        const response = await fetchDocumentTree();
        const toggles = storage.getItem(TOGGLE_INFO, []);
        // TODO: validation
        dispatch({ type: SET_TOGGLE_CONTROLLER, payload: toggles });
        const data = response.map((document) => tree.setToggleOption(document, null, new Set(getState().toggleController)));
        dispatch({ type: SET_DOCUMENT_TREE, payload: data });
    }
}
export { App };
