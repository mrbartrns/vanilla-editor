import { CLICK_OUTSIDE_MODAL_EVENT } from '../constants.js';
import Component from './Component.js';
import Editor from './Editor.js';
import { IBaseProps } from './types/index.js';

class Modal extends Component {
  constructor({ $target }: IBaseProps) {
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
    this.$element.addEventListener('click', (e: any) => {
      if (e.target.classList.contains('modal')) {
        dispatchEvent(new CustomEvent(CLICK_OUTSIDE_MODAL_EVENT));
      }
    });
  }
}
export default Modal;
