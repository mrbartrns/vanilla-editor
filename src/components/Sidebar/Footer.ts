import Component from '../Component.js';
import { IBaseProps } from '../types/index.js';

class Footer extends Component {
  constructor({ $target }: IBaseProps) {
    super({ $target, elementType: 'div' });
    this.$element.className = 'sidebar-footer';
    this.render();
  }

  template() {
    return `
      <div>This is Footer.</div>
    `;
  }
}
export default Footer;
