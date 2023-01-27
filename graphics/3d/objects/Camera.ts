/**
 * Create on 01.09.2022
 *
 * @author WhiteMaks
 */

import Key                  from "../../../controls/enums/Key";
import Mouse                from "../../../controls/Mouse";
import Vector3              from "../../../math/Vector3";
import Keyboard             from "../../../controls/Keyboard";
import Transformation       from "../../../math/Transformation";

/**
 * Класс для работы с камерой
 */
class Camera {
    /**
     * Позиция камеры
     * @private
     */
    private readonly position: Vector3;
    /**
     * Поворот камеры
     * @private
     */
    private readonly rotation: Vector3;

    /**
     * Область просмотра (в радианах)
     * @private
     */
    private readonly fieldOfView: number;
    /**
     * расстояние до ближайшей плоскости отсечения
     * @private
     */
    private readonly nearClippingPlane: number;
    /**
     * расстояние до дальней плоскости отсечения
     * @private
     */
    private readonly farClippingPlane: number;

    /**
     * Скорость камеры
     * @private
     */
    private speed: number;
    /**
     * Чувствительность мышки
     * @private
     */
    private sensitivity: number;

    private newPosition: Vector3;
    private newRotation: Vector3;

    /**
     * Конструктор для создания объекта камеры
     * @param fieldOfView область просмотра FOV (в градусах)
     * @param nearClippingPlane расстояние до ближайшей плоскости отсечения
     * @param farClippingPlane расстояние до дальней плоскости отсечения
     */
    public constructor(fieldOfView: number, nearClippingPlane: number, farClippingPlane: number) {
        this.position = new Vector3(
            0,
            0,
            0
        );
        this.rotation = new Vector3(
            0,
            0,
            0
        );
        this.newPosition = new Vector3(
            0,
            0,
            0
        );
        this.newRotation = new Vector3(
            0,
            0,
            0
        );
        this.speed = 0.001;
        this.sensitivity = 0.1;
        this.fieldOfView = Transformation.degreesToRadians(fieldOfView); //сохранение области просмотра
        this.nearClippingPlane = nearClippingPlane; //сохранение ближайшей плоскости отсечения
        this.farClippingPlane = farClippingPlane; //сохранение дальней плоскости отсечения
    }

    /**
     * Обработка пользовательского ввода для обновления настроек камеры
     */
    public input(keyboard: Keyboard, mouse: Mouse): void {
        this.keyboardInput(keyboard);
        this.mouseInput(mouse);
    }

    /**
     * Редер камеры
     */
    public render(): void {
        this.move(
            this.newPosition.getX() * this.speed,
            this.newPosition.getY() * this.speed,
            this.newPosition.getZ() * this.speed
        );

        this.rotate(
            this.newRotation.getX() * this.sensitivity,
            this.newRotation.getY() * this.sensitivity,
            0
        );
    }

    /**
     * Логика ввода с клавиатуры
     * @param keyboard объект клавиатуры
     * @private
     */
    private keyboardInput(keyboard: Keyboard): void {
        this.newPosition = new Vector3(
            0,
            0,
            0
        );

        if (keyboard.keyIsPressed(Key.W)) {
            this.newPosition.setZ(-1);
        } else if (keyboard.keyIsPressed(Key.S)) {
            this.newPosition.setZ(1);
        }

        if (keyboard.keyIsPressed(Key.A)) {
            this.newPosition.setX(-1);
        } else if (keyboard.keyIsPressed(Key.D)) {
            this.newPosition.setX(1);
        }

        if (keyboard.keyIsPressed(Key.SPACE)) {
            this.newPosition.setY(1);
        } else if (keyboard.keyIsPressed(Key.LEFT_SHIFT)) {
            this.newPosition.setY(-1);
        }
    }

    /**
     * Логика ввода мышки
     * @param mouse объект мылки
     * @private
     */
    private mouseInput(mouse: Mouse): void {
        this.newRotation = new Vector3(
            0,
            0,
            0
        );

        if (mouse.isRightKeyIsPressed()) {
            const mouseDirection = mouse.getPositionDirection();

            this.newRotation.setX(mouseDirection.getX());
            this.newRotation.setY(mouseDirection.getY());
        }
    }

    /**
     * Получение позиции
     */
    public getPosition(): Vector3 {
        return this.position;
    }

    /**
     * Установка позиции камеры
     * @param x позиция камеры по оси X
     * @param y позиция камеры по оси Y
     * @param z позиция камеры по оси Z
     */
    public setPosition(x: number, y: number, z: number): void {
        this.position.setX(x);
        this.position.setY(y);
        this.position.setZ(z);
    }

    /**
     * Переместить камеру на заданные координаты
     * @param x координата X
     * @param y координата Y
     * @param z координата Z
     */
    public move(x: number, y: number, z: number): void {
        if (z !== 0) {
            this.position.setX(
                this.position.getX() + Math.sin(Transformation.degreesToRadians(this.rotation.getY())) * -1.0 * z
            );
            this.position.setZ(
                this.position.getZ() + Math.cos(Transformation.degreesToRadians(this.rotation.getY())) * z
            );
        }

        if (x !== 0) {
            this.position.setX(
                this.position.getX() + Math.sin(Transformation.degreesToRadians(this.rotation.getY() - 90)) * -1.0 * x
            );
            this.position.setZ(
                this.position.getZ() + Math.cos(Transformation.degreesToRadians(this.rotation.getY() - 90)) * x
            );
        }

        this.position.setY(this.position.getY() + y);
    }

    /**
     * Получение поворота
     */
    public getRotation(): Vector3 {
        return this.rotation;
    }

    /**
     * Установить поворот камеры
     * @param x поворот по оси X
     * @param y поворот по оси Y
     * @param z поворот по оси Z
     */
    public setRotation(x: number, y: number, z: number): void {
        this.rotation.setX(x);
        this.rotation.setY(y);
        this.rotation.setZ(z);
    }

    /**
     * Повернуть камеру на заданные координаты
     * @param x поворот по оси X
     * @param y поворот по оси Y
     * @param z поворот по оси Z
     */
    public rotate(x: number, y: number, z: number): void {
        this.rotation.setX(this.rotation.getX() + x);
        this.rotation.setY(this.rotation.getY() + y);
        this.rotation.setZ(this.rotation.getZ() + z);
    }

    /**
     * Получение матрицы проекции соответствующую настройкам камеры
     * @param aspectRatio отношение длины к высоте экрана
     */
    public getProjectionMatrix(aspectRatio: number): number[] {
        return Transformation.getProjectionMatrix(
            aspectRatio,
            this.fieldOfView,
            this.nearClippingPlane,
            this.farClippingPlane
        );
    }

    /**
     * Получение матрицы просмотра соответствующую настройкам камеры
     */
    public getViewMatrix(): number[] {
        return Transformation.getViewMatrix(
            this.position,
            this.rotation
        );
    }
}

export default Camera;