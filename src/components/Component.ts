class Component<T = {}> {
  $element: HTMLElement;
  state?: T;

  constructor({
    $target,
    elementType,
  }: {
    $target: HTMLElement | null;
    elementType: string;
  }) {
    this.$element = document.createElement(elementType);
    $target?.appendChild(this.$element);
  }

  setState(nextState: T) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$element.innerHTML = this.template();
  }

  template(): string {
    return ``;
  }

  setEvent() {}
}

export { Component };
