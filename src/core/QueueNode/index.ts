export interface QNode<T> {
  data: T;
  next: QNode<T> | null;
}

class QueueNode<T> implements QNode<T> {
  data: T;

  next: QNode<T> | null;

  constructor(value: T) {
    this.data = value;
    this.next = null;
  }
}

export default QueueNode;
