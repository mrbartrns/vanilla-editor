import { Component } from './Component.js';
import { IBaseProps } from './types/index.js';

/**
 * Breadcrumb의 역할
 * Breadcrumb은 현재 위치에서부터 부모 노드를 타고 거슬러 올라가면서 탐색을 한다.
 */
class Breadcrumb extends Component {
  constructor({ $target }: IBaseProps) {
    super({ $target, elementType: 'header' });
    this.$element.className = 'breadcrumb';
  }

  template(): string {
    return ``;
  }
}

export { Breadcrumb };
