/**
 * Create on 28.08.2022
 *
 * @author WhiteMaks
 */

/**
 * Класс для работы с позицией мышки
 */
class MousePosition {
    /**
     * Позиция мышки по оси X
     * @private
     */
    private readonly x: number;
    /**
     * Позиция мышки по оси Y
     * @private
     */
    private readonly y: number;

    /**
     * Конструктор для создания объекта позиции мышки
     * @param x координата X позиции мышки
     * @param y координата Y позиции мышки
     */
    public constructor(x: number, y: number) {
        this.x = x; //сохранение координаты X
        this.y = y; //сохранение координаты Y
    }

    /**
     * Получение значения координаты X
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Получение значения координаты Y
     */
    public getY(): number {
        return this.y;
    }
}

export default MousePosition;