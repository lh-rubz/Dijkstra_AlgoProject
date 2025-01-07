import { Edge } from "./Edge";
export class LinkedListNode {
    private edge: Edge;
    private next: LinkedListNode | null;

    constructor(edge: Edge) {
        this.edge = edge;
        this.next = null;
    }

    public getEdge(): Edge {
        return this.edge;
    }

    public getNext(): LinkedListNode | null {
        return this.next;
    }

    public setNext(next: LinkedListNode | null): void {
        this.next = next;
    }

 
}

export class LinkedList {
    private first: LinkedListNode | null;
    private size: number;

    constructor() {
        this.first = null;
        this.size = 0;
    }

    public getFirstNode(): LinkedListNode | null {
      
        return this.first;
    }

    public setFirstNode(n: LinkedListNode): LinkedListNode | null {
        this.first = n;
        return this.first;
    }

    public addFirst(edge: Edge): void {
        const temp = new LinkedListNode(edge);

        if (this.first === null) {
            this.first = temp;
        } else {
            temp.setNext(this.first);
            this.first = temp;
        }

        this.size++;
    }

    public addLast(edge: Edge): void {
        const temp = new LinkedListNode(edge);
    
        if (this.first === null) {
            // If the list is empty, set the first node to temp
            this.first = temp;
        } else {
            let curr: LinkedListNode | null = this.first; 
            while (curr !== null && curr.getNext() !== null) {
                curr = curr.getNext(); 
            }
            if (curr !== null) {
                curr.setNext(temp); 
            }
        }
    
        this.size++;
    }
    

    public deleteFirst(): boolean {
        if (this.first === null) return false;

        const temp = this.first;
        this.first = this.first.getNext();
        temp.setNext(null);

        this.size--;
        return true;
    }

    public deleteLast(): boolean {
        if (this.first === null) return false;

        let current = this.first;
        if (current.getNext() === null) {
            this.first = null;
        } else {
            while (current.getNext()!.getNext() !== null) {
                current = current.getNext()!;
            }
            current.setNext(null);
        }

        this.size--;
        return true;
    }

    public get(name: string): Edge | null {
        const node = this.getNode(name);
        return node ? node.getEdge() : null;
    }

    public getNode(name: string): LinkedListNode | null {
        let curr = this.first;

        while (curr !== null) {
            if (curr.getEdge().getDestination().getCountry().getCountryName() === name) {
                return curr;
            }
            curr = curr.getNext();
        }
        return null;
    }

    public getFirst(): Edge | null {
        return this.first ? this.first.getEdge() : null;
    }

    public getLast(): Edge | null {
        if (this.first === null) return null;

        let curr = this.first;
        while (curr.getNext() !== null) {
            curr = curr.getNext()!;
        }

        return curr.getEdge();
    }

    public printList(): void {
        let current = this.first;
        while (current !== null) {
            console.log(current.toString());
            current = current.getNext();
        }
    }

    public isEmpty(): boolean {
        return this.first === null;
    }

    public getSize(): number {
        return this.size;
    }

    public addAll(list: LinkedList): void {
        if (list === null || list.isEmpty()) {
            return;
        }

        let current = list.getFirstNode();
        while (current !== null) {
            this.addLast(current.getEdge());
            current = current.getNext();
        }
    }

    public getNodeByIndex(index: number): LinkedListNode {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        let current = this.first;
        for (let i = 0; i < index; i++) {
            current = current?.getNext() || null;
        }
        if (current === null) {
            throw new Error("Node not found");
        }
        return current;
    }
}
