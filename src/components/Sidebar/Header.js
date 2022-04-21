import { Component } from '../Component.js';
class Header extends Component {
  constructor({ $target }) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'sidebar-header';
    this.renderTemplate();
  }
  render() {
    return `
      <div>This is Header</div>
    `;
  }
}
export { Header };
