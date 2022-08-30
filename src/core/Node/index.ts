export interface QueueNode<T> {
  data: T;
  next: QueueNode<T> | null;
}

class Node<T> implements QueueNode<T> {
  data: T;

  next: QueueNode<T> | null;

  constructor(value: T) {
    this.data = value;
    this.next = null;
  }
}

export default Node;
