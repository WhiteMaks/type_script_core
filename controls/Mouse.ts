/**
 * Create on 28.08.2022
 *
 * @author WhiteMaks
 */

import Queue            from "../data/structures/Queue";
import Vector3          from "../math/Vector3";
import MouseEvent       from "./events/MouseEvent";
import SimpleQueue      from "../data/structures/impl/SimpleQueue";
import MousePosition    from "./support/MousePosition";
import MouseEventType   from "./enums/MouseEventType";

/**
 * Класс для работы с событиями мышки
 */
class Mouse {
    /**
     * Размер буфера хранения событий мышки
     * @private
     */
    private static readonly bufferSize: number = 16;

    /**
     * Буфер для хранения событий мышки
     * @private
     */
    private readonly buffer: Queue<MouseEvent>;

    /**
     * Вектор направления мышки
     * @private
     */
    private readonly positionDirection: Vector3;

    /**
     * Позиция мышки по оси X
     * @private
     */
    private positionX: number;
    /**
     * Позиция мышки по оси Y
     * @private
     */
    private positionY: number;

    /**
     * Предыдущая позиция X
     * @private
     */
    private previousPositionX: number;
    /**
     * Предыдущая позиция Y
     * @private
     */
    private previousPositionY: number;

    /**
     * Статус нажатия левой кнопки мышки
     * @private
     */
    private leftKeyIsPressed: boolean;
    /**
     * Статус нажатия правой кнопки мышки
     * @private
     */
    private rightKeyIsPressed: boolean;
    /**
     * Статус для идентификации того, что мышка находиться в фокусе графического элемента
     * @private
     */
    private inElement: boolean;

    /**
     * Конструктор для создания объекта мышки
     */
    public constructor() {
        //инициализация буфера хранения событий мышки
        this.buffer = new SimpleQueue();

        //инициализация вектора направления мышки
        this.positionDirection = new Vector3(0,0, 0);

        this.positionX = 0; //инициализация начального положения мышки по оси X
        this.positionY = 0; //инициализация начального положения мышки по оси Y

        this.previousPositionX = 0; //инициализация предыдущего положения мышки по оси X
        this.previousPositionY = 0; //инициализация предыдущего положения мышки по оси Y

        this.leftKeyIsPressed = false; //инициализация статуса нажатия левой кнопки мышки
        this.rightKeyIsPressed = false; //инициализация статуса нажатия правой кнопки мышки
        this.inElement = false; //инициализация статуса нахождения в графическом элементе
    }

    /**
     * Получение позиции мышки
     */
    public getPosition(): MousePosition {
        return new MousePosition(this.positionX, this.positionY);
    }

    /**
     * Получение статуса идентификатора нахождения в графическом элементе
     */
    public isInElement(): boolean {
        return this.inElement;
    }

    /**
     * Получение статуса нажатия левой кнопки мышки
     */
    public isLeftKeyIsPressed(): boolean {
        return this.leftKeyIsPressed;
    }

    /**
     * Получение статуса нажатия правой кнопки мышки
     */
    public isRightKeyIsPressed(): boolean {
        return this.rightKeyIsPressed;
    }

    /**
     * Получение из буфера событие от мышки
     */
    public read(): MouseEvent {
        //если в буфере есть записи, то возвращается первая из очереди
        if (this.buffer.size() > 0) {
            return this.buffer.poll();
        }
        return new MouseEvent(MouseEventType.INVALID, this);
    }

    /**
     * Отчистка буфера событий мышки
     */
    public flush(): void {
        this.buffer.flush();
    }

    /**
     * Сохранение события перемещения мышки
     * @param newPositionX новая координата мышки по оси X
     * @param newPositionY новая координата мышки по оси Y
     */
    public onMouseMove(newPositionX: number, newPositionY: number): void {
        this.positionX = newPositionX; //сохранение новой координаты по оси X
        this.positionY = newPositionY; //сохранение новой координаты по оси Y

        this.buffer.push(new MouseEvent(MouseEventType.MOVE, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события выхода мышки за пределы графического элемента
     */
    public onMouseLeave(): void {
        this.inElement = false; //переключения статуса

        this.buffer.push(new MouseEvent(MouseEventType.LEAVE, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события перемещения мышки внутрь графического элемента
     */
    public onMouseEnter(): void {
        this.inElement = true; //переключения статуса

        this.buffer.push(new MouseEvent(MouseEventType.ENTER, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события нажатия на левую кнопку мыши
     * @param positionX позиция нажатия кнопки мыши по оси X
     * @param positionY позиция нажатия кнопки мыши по оси Y
     */
    public onLeftKeyPressed(positionX: number, positionY: number): void {
        this.leftKeyIsPressed = true;

        this.buffer.push(new MouseEvent(MouseEventType.L_PRESS, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события отжатия левой кнопки мыши
     * @param positionX позиция отжатия кнопки мыши по оси X
     * @param positionY позиция отжатия кнопки мыши по оси Y
     */
    public onLeftKeyReleased(positionX: number, positionY: number): void {
        this.leftKeyIsPressed = false;

        this.buffer.push(new MouseEvent(MouseEventType.L_RELEASE, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события нажатия на правую кнопку мыши
     * @param positionX позиция нажатия кнопки мыши по оси X
     * @param positionY позиция нажатия кнопки мыши по оси Y
     */
    public onRightKeyPressed(positionX: number, positionY: number): void {
        this.rightKeyIsPressed = true;

        this.buffer.push(new MouseEvent(MouseEventType.R_PRESS, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события отжатия правой кнопки мыши
     * @param positionX позиция отжатия кнопки мыши по оси X
     * @param positionY позиция отжатия кнопки мыши по оси Y
     */
    public onRightKeyReleased(positionX: number, positionY: number): void {
        this.rightKeyIsPressed = false;

        this.buffer.push(new MouseEvent(MouseEventType.R_RELEASE, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события прокрутки барабанчика вверх
     * @param positionX позиция прокрутки мыши по оси X
     * @param positionY позиция прокрутки мыши по оси Y
     */
    public onWheelUp(positionX: number, positionY: number): void {
        this.buffer.push(new MouseEvent(MouseEventType.WHEEL_UP, this));

        this.trimBuffer();
    }

    /**
     * Сохранение события прокрутки барабанчика вниз
     * @param positionX позиция прокрутки мыши по оси X
     * @param positionY позиция прокрутки мыши по оси Y
     */
    public onWheelDown(positionX: number, positionY: number): void {
        this.buffer.push(new MouseEvent(MouseEventType.WHEEL_DOWN, this));

        this.trimBuffer();
    }

    /**
     * Удаление устаревших записей в буфере событий мышки
     * @private
     */
    private trimBuffer(): void {
        //пока в буфере больше записей, чем в значении bufferSize, берем первый из очереди
        while (this.buffer.size() > Mouse.bufferSize) {
            this.buffer.poll();
        }
    }

    /**
     * Обновление вектора направления мышки
     */
    public updatePositionDirection(): void {
        this.positionDirection.setX(0);
        this.positionDirection.setY(0);

        if (this.previousPositionX > 0 && this.previousPositionY > 0) {
            this.positionDirection.setX(this.positionY - this.previousPositionY);
            this.positionDirection.setY(this.positionX - this.previousPositionX);
        }

        this.previousPositionX = this.positionX;
        this.previousPositionY = this.positionY;
    }

    /**
     * Получение вектора направления мышки
     */
    public getPositionDirection(): Vector3 {
        return this.positionDirection;
    }

}

export default Mouse;