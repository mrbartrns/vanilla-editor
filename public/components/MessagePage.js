import { Component } from './Component.js';
class MessagePage extends Component {
    text;
    constructor({ $target, text }) {
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
