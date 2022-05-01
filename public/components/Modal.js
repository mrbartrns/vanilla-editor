import { CLICK_OUTSIDE_MODAL_EVENT } from '../constants.js';
import { Component } from './Component.js';
import { Editor } from './Editor.js';
class Modal extends Component {
    constructor({ $target }) {
        super({ $target, elementType: 'div' });
        this.$element.className = 'modal';
        const $modalBody = document.createElement('div');
        $modalBody.className = 'modal-body';
        this.$element.appendChild($modalBody);
        new Editor({
            $target: $modalBody,
        });
        this.setEvent();
    }
    setEvent() {
        this.$element.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                dispatchEvent(new CustomEvent(CLICK_OUTSIDE_MODAL_EVENT));
            }
        });
    }
}
export { Modal };
