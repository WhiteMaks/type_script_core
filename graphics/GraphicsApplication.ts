/**
 * Create on 11.09.2022
 *
 * @author WhiteMaks
 */

import Vector3              from "../math/Vector3";
import GraphicsLogic        from "./GraphicsLogic";
import GraphicsElement      from "./GraphicsElement";
import WebGL from "./WebGL";

/**
 * Класс графического приложения
 */
class GraphicsApplication {
    /**
     * Объект для работы с графическим элементом
     * @private
     */
    private readonly graphicElement: GraphicsElement;
    /**
     * Объект для работы с логикой графического приложения
     * @private
     */
    private readonly logic: GraphicsLogic;

    /**
     * Идентификатор фрейма анимации
     * @private
     */
    private frame: number;

    /**
     * Конструктор для создания объекта графического приложения
     */
    public constructor(parentElement: HTMLElement, logic: GraphicsLogic) {
        this.logic = logic; //сохранение логики приложения

        this.graphicElement = new GraphicsElement(
            parentElement
        );

        this.frame = 0;
    }

    /**
     * Запуск графического приложения
     */
    public start(): void {
        this.init();

        this.startNewFrame();
    }

    /**
     * Установка нового цвета для пространства
     * @param color вектор с указанием цвета rgb соответствующие xyz
     */
    public setSpaceColor(color: Vector3): void {
        this.graphicElement.setSpaceColor(
            color.getX(),
            color.getY(),
            color.getZ()
        )
    }

    /**
     * Инициализация графического приложения внутри родительского вэб элемента
     * @private
     */
    private init(): void {
        this.graphicElement.init();

        this.logic.init(
            this.graphicElement.getWebGL()
        );
    }

    /**
     * Отправить запрос на отрисовку нового кадра
     * @private
     */
    private startNewFrame(): void {
        if (this.graphicElement.shouldBeClose()) {
            window.cancelAnimationFrame(this.frame);
            return;
        }
        this.frame = window.requestAnimationFrame(
            (timestamp: number) => this.loop(timestamp)
        );
    }

    /**
     * Цикл рендеринга
     * @param timestamp времени с момента старта цикла
     * @private
     */
    private loop(timestamp: number): void {
        this.input();
        this.update(timestamp);
        this.render();
        this.endFrame();
        this.startNewFrame();
    }

    /**
     * Обработка ввода
     * @private
     */
    private input(): void {
        this.logic.input(
            this.graphicElement.getKeyboard(),
            this.graphicElement.getMouse()
        );
    }

    /**
     * Обновление кадра
     * @param timestamp времени с момента старта цикла
     * @private
     */
    private update(timestamp: number): void {
        this.graphicElement.update();
        this.logic.update(timestamp);
    }

    /**
     * Отрисовка кадра
     * @private
     */
    private render(): void {
        this.graphicElement.render();
        this.logic.render(this.graphicElement);
    }

    /**
     * Завершить отрисовку кадра
     * @private
     */
    private endFrame(): void {

    }

    /**
     * Получение объекта для работы с WebGL
     */
    public getWebGL(): WebGL {
        return this.graphicElement.getWebGL();
    }

}

export default GraphicsApplication;