import { Component } from '../Component.js';
import { IBaseProps } from '../types/index.js';

class Header extends Component {
  constructor({ $target }: IBaseProps) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'sidebar-header';
    this.render();
  }

  template() {
    return `
      <div>This is Header.</div>
    `;
  }
}
export { Header };
