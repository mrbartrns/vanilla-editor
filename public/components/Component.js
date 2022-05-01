class Component {
    $element;
    state;
    constructor({ $target, elementType, }) {
        this.$element = document.createElement(elementType);
        $target?.appendChild(this.$element);
    }
    setState(nextState) {
        this.state = nextState;
        this.render();
    }
    render() {
        this.$element.innerHTML = this.template();
    }
    template() {
        return ``;
    }
    setEvent() { }
}
export { Component };
