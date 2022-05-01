class Node {
    data;
    next;
    constructor(value) {
        this.data = value;
        this.next = null;
    }
}
class Queue {
    head;
    tail;
    size;
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    enqueue(value) {
        const newNode = new Node(value);
        if (!this.head || !this.tail) {
            this.head = newNode;
            this.tail = newNode;
        }
        else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size += 1;
    }
    dequeue() {
        if (!this.head)
            return null;
        const removed = this.head;
        this.head = this.head.next;
        // 모든 요소가 제거되었다면, queue를 초기화한다.
        if (!this.head) {
            this.tail = null;
        }
        this.size--;
        return removed.data;
    }
    peek() {
        if (!this.head)
            return null;
        return this.head.data;
    }
    getSize() {
        return this.size;
    }
    isEmpty() {
        return !this.head;
    }
}
export { Queue };
