import { Component } from '../Component.js';
import { Header } from './Header.js';
import { Body } from './Body.js';
import { Footer } from './Footer.js';
import { DOCUMENT_LIST_CLASSNAME, ADD_CLASSNAME, DELETE_CLASSNAME, TOGGLE_CLASSNAME, ROOT_ADD_CLASSNAME, TOGGLE_EVENT, ADD_TO_TREE_EVENT, DELETE_FROM_TREE_EVENT, CLICK_DOCUMENT_EVENT, } from '../../constants.js';
class Sidebar extends Component {
    $sidebar;
    $header;
    $body;
    $footer;
    constructor({ $target }) {
        super({ $target, elementType: 'div' });
        this.$element.className = 'sidebar-wrapper';
        this.$sidebar = document.createElement('div');
        this.$sidebar.className = 'sidebar';
        this.$element.appendChild(this.$sidebar);
        this.$header = new Header({ $target: this.$sidebar });
        this.$body = new Body({ $target: this.$sidebar });
        this.$footer = new Footer({ $target: this.$sidebar });
        this.setEvent();
    }
    /**
     * renderTree 함수는 주어진 initialData에 따라 렌더링만 할 뿐,
     * 다른 작업은 수행하지 않는다.
     */
    setEvent() {
        // TODO: class 여러개 하여 나누기
        this.$element.addEventListener('click', (e) => {
            const $document = e.target.closest(`.${DOCUMENT_LIST_CLASSNAME}`);
            if (!$document)
                return;
            if ($document.classList.contains(ROOT_ADD_CLASSNAME)) {
                // onAdd(null);
                dispatchEvent(new CustomEvent(ADD_TO_TREE_EVENT, { detail: { id: null } }));
                return;
            }
            const id = Number($document.dataset.id);
            if (e.target.classList.contains(ADD_CLASSNAME)) {
                dispatchEvent(new CustomEvent(ADD_TO_TREE_EVENT, { detail: { id: id } }));
            }
            else if (e.target.classList.contains(TOGGLE_CLASSNAME)) {
                dispatchEvent(new CustomEvent(TOGGLE_EVENT, { detail: { id: id } }));
            }
            else if (e.target.classList.contains(DELETE_CLASSNAME)) {
                dispatchEvent(new CustomEvent(DELETE_FROM_TREE_EVENT, { detail: { id: id } }));
            }
            else if (id > -1) {
                dispatchEvent(new CustomEvent(CLICK_DOCUMENT_EVENT, { detail: { id: id } }));
            }
        });
    }
}
export { Sidebar };
