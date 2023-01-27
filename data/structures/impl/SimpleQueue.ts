/**
 * Create on 27.08.2022
 *
 * @author WhiteMaks
 */
import Queue from "../Queue";

/**
 * Класс реализации самой простой очереди
 */
class SimpleQueue<T> implements Queue<T> {
    private readonly array: T[];

    public constructor() {
        this.array = [];
    }

    public peek(): T {
        return this.array[0];
    }

    public poll(): T {
        let result = this.array.shift();
        if (!result) {
            throw new Error("Нет элементов в очереди");
        }
        return result;
    }

    public push(element: T): void {
        this.array.push(element);
    }

    public size(): number {
        return this.array.length;
    }

    public flush(): void {
        //пока в очереди есть записи, берем первый из очереди
        while (this.size() !== 0) {
            this.poll();
        }
    }

}

export default SimpleQueue;