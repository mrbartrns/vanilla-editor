class Component {
  state;
  $element;
  constructor({ $target, elementType }) {
    this.$element = document.createElement(elementType);
    $target?.appendChild(this.$element);
  }

  setState(nextState) {
    this.state = nextState;
    this.renderTemplate();
  }

  renderTemplate() {
    this.$element.innerHTML = this.render();
  }

  render() {
    return ``;
  }
}
export { Component };
