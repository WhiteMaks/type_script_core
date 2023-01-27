/**
 * Create on 11.09.2022
 *
 * @author WhiteMaks
 */

import WebGL        from "./WebGL";
import Mouse        from "../controls/Mouse";
import Vector3      from "../math/Vector3";
import Keyboard     from "../controls/Keyboard";

/**
 * Класс для создания нового графического элемента и взаимодействия с ним
 */
class GraphicsElement {

    /**
     * Canvas вэб элемент
     * @private
     */
    private readonly canvasElement: HTMLCanvasElement;
    /**
     * Родительский элемент (в который необходимо встроить canvas)
     * @private
     */
    private readonly parentElement: HTMLElement;

    /**
     * Объект для работы с WebGL
     * @private
     */
    private readonly webGL: WebGL;

    /**
     * Объект для работы с клавиатурой
     * @private
     */
    private readonly keyboard: Keyboard;
    /**
     * Объект для работы с мышкой
     * @private
     */
    private readonly mouse: Mouse;
    /**
     * Объект для хранения цвета пространства
     * @private
     */
    private readonly spaceColor: Vector3;

    /**
     * Конструктор для создания объекта графического элемента в родительском элементе
     * @param parentElement родительский элемент
     */
    public constructor(parentElement: HTMLElement) {
        this.parentElement = parentElement;

        this.keyboard = new Keyboard();
        this.mouse = new Mouse();

        this.spaceColor = new Vector3(
            0,
            0,
            0
        );

        this.canvasElement = document.createElement("canvas"); //создание вэб элемента canvas
        this.canvasElement.style.display = "block";
        this.canvasElement.style.width = "100%";
        this.canvasElement.style.height = "100%";
        //запрет на получение контекст меню при нажатии на правую кнопку мыши, так как права кнопка мыши может быть использована для вращения камерой
        this.canvasElement.oncontextmenu = function(event) {
            return false
        };

        const webGLContext = this.canvasElement.getContext("webgl2"); //получение контекста для работы с WebGL

        //если выбранный контекст не проинициализирован, значит либо его не существует, либо браузер не может с ним работать
        if (!webGLContext) {
            throw new Error("Невозможно проинициализировать WebGL. Данный браузер не поддерживает данный контекст [ webgl2 ]");
        }

        //инициализация объекта WebGL с выбранным контекстом
        this.webGL = new WebGL(
            webGLContext //выбранный контекст
        );
        this.webGL.enableDepthTest(); //включение проверки удаленности объектов
        this.webGL.enableBlend(); //включение прозрачности
    }

    /**
     * Проверка на то что графический элемент должен быть закрыт
     */
    public shouldBeClose(): boolean {
        return this.canvasElement.offsetParent == null;
    }

    /**
     * Инициализация графического элемента
     */
    public init(): void {
        this.embedToElement();
        this.addListenerResizeWindow();
        this.addKeyboardListener();
        this.addMouseListener();
    }

    /**
     * Отрисовка графического элемента
     */
    public render(): void {
        this.setClearColor(
            this.spaceColor.getX(),
            this.spaceColor.getY(),
            this.spaceColor.getZ()
        );

        this.webGL.clearColorBuffer();
        this.webGL.clearDepthBuffer();
    }

    /**
     * Встраивание графического элемента (canvas) в родительский элемент
     * @private
     */
    private embedToElement(): void {
        this.parentElement.append(this.canvasElement); //встраивание canvas элемента внутрь родительского

        this.resizeCanvasElement(); //заполнение canvas элемента под размер родительского
    }

    /**
     * Добавление слушателя на изменение окна браузера
     * @private
     */
    private addListenerResizeWindow(): void {
        window.addEventListener(
            "resize",
            () =>
                this.resizeCanvasElement()
        );
    }

    /**
     * Добавление слушателя на работу с клавиатурой
     * @private
     */
    private addKeyboardListener(): void {
        document.addEventListener(
            "keydown",
            (event) =>
                this.keyboard.onKeyPressed(event.code),
            false
        );

        document.addEventListener(
            "keyup",
            (event) =>
                this.keyboard.onKeyReleased(event.code),
            false
        );

        document.addEventListener(
            "keypress",
            (event) =>
                this.keyboard.onChar(event.key),
            false
        );
    }

    /**
     * Добавление слушателя на работы с мышкой
     * @private
     */
    private addMouseListener(): void {
        this.canvasElement.addEventListener(
            "mousedown",
            (event) => {
                if (event.button === 0) {
                    this.mouse.onLeftKeyPressed(
                        event.offsetX,
                        event.offsetY
                    );
                    return;
                }

                if (event.button === 2) {
                    this.mouse.onRightKeyPressed(
                        event.offsetX,
                        event.offsetY
                    );
                    return;
                }
            });

        this.canvasElement.addEventListener(
            "mouseup",
            (event) => {
                if (event.button === 0) {
                    this.mouse.onLeftKeyReleased(
                        event.offsetX,
                        event.offsetY
                    );
                    return;
                }

                if (event.button === 2) {
                    this.mouse.onRightKeyReleased(
                        event.offsetX,
                        event.offsetY
                    );
                    return;
                }
            });

        this.canvasElement.addEventListener(
            'mousemove',
            (event) =>
                this.mouse.onMouseMove(
                    event.offsetX,
                    event.offsetY
                )
        );

        this.canvasElement.addEventListener(
            'mouseenter',
            () =>
                this.mouse.onMouseEnter()
        );

        this.canvasElement.addEventListener(
            'mouseleave',
            () =>
                this.mouse.onMouseLeave()
        );
    }

    private setClearColor(red: number, green: number, blue: number) {
        this.webGL.clearColor(
            red,
            green,
            blue
        );
    }

    /**
     * Обновление области просмотра
     * @private
     */
    private updateViewport() {
        this.webGL.setViewport(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
        );
    }

    /**
     * Получение объекта WebGL
     */
    public getWebGL(): WebGL {
        return this.webGL;
    }

    /**
     * Получение объекта клавиатуры
     */
    public getKeyboard(): Keyboard {
        return this.keyboard;
    }

    /**
     * Получение объекта мышки
     */
    public getMouse(): Mouse {
        return this.mouse;
    }

    /**
     * Обновление размеров canvas элемента
     * @private
     */
    private resizeCanvasElement(): void {
        this.canvasElement.width = this.parentElement.offsetWidth; //задание длины для canvas элемента таким же как у родительского, таким образом canvas всегда будет занимать все пространство родительского элемента
        this.canvasElement.height = this.parentElement.offsetHeight; //задание высоты для canvas элемента таким же как у родительского, таким образом canvas всегда будет занимать все пространство родительского элемента

        this.updateViewport();
    }

    /**
     * Получение ширины графического элемента
     */
    public getWidth(): number {
        return this.canvasElement.width;
    }

    /**
     * Получение высоты графического элемента
     */
    public getHeight(): number {
        return this.canvasElement.height;
    }

    /**
     * Обновление графического элемента
     */
    public update(): void {
        this.mouse.updatePositionDirection();
    }

    /**
     * Установка нового цвета для пространства
     * @param red красные цвет
     * @param green зеленый цвет
     * @param blue синий цвет
     */
    public setSpaceColor(red: number, green: number, blue: number): void {
        this.spaceColor.setX(red);
        this.spaceColor.setY(green);
        this.spaceColor.setZ(blue);
    }
}

export default GraphicsElement;