import { Component } from './Component.js';
import { IBaseProps } from './types/index.js';

interface IProps extends IBaseProps {
  text: string;
}

class MessagePage extends Component {
  text: string;
  constructor({ $target, text }: IProps) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'message-page';
    this.text = text;
    this.render();
  }

  template() {
    return `
      <div class="message-info">
        ${this.text}
      </div>
    `;
  }
}

export { MessagePage };
