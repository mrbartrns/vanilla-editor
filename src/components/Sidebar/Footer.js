import { Component } from '../Component.js';
class Footer extends Component {
  constructor({ $target }) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'sidebar-footer';
    this.renderTemplate();
  }
  render() {
    return `
      <div>This is Footer.</div>
    `;
  }
}
export { Footer };
