/**
 * Create on 26.08.2022
 *
 * @author WhiteMaks
 */

/**
 * Служебный класс таймер предназначен для работы с временем в графическом плане
 */
class GraphicTimer {
    /**
     * Время в формате timestamp с момента последнего вызова
     * @private
     */
    private lastCalledTimestamp: number;
    /**
     * Количество отрисованных кадров
     * @private
     */
    private frameCount: number;

    /**
     * Конструктор создания объекта графического таймера
     */
    public constructor() {
        this.lastCalledTimestamp = Date.now();
        this.frameCount = 0;
    }

    /**
     * Получение количества отрисованных кадров в секунду
     */
    public getFps(): number {
        this.frameCount++; //прибавление к количеству отрисованных кадров 1

        //время прошедшее с момента последнего показа fps
        const delta = (Date.now() - this.lastCalledTimestamp) / 1_000;

        //если дельта становить больше 1 секунды, то можно показать в консоли сколько кадров удалось отрисовать за 1 секунду
        if (delta > 1) {
            this.lastCalledTimestamp = Date.now(); //обновление времени

            const fps = this.frameCount; //сохранение количества кадров

            this.frameCount = 0; //обнуление счетчика кадров

            return fps;
        }
        return -1;
    }
}

export default GraphicTimer;