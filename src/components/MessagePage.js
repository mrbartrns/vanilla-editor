import { Component } from './Component.js';

class MessagePage extends Component {
  constructor({ $target, text }) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'message-page';
    this.text = text;
    this.renderTemplate();
  }

  render() {
    return `
      <div class="message-info">
        ${this.text}
      </div>
    `;
  }
}

export { MessagePage };
