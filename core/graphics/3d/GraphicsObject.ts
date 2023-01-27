/**
 * Create on 11.09.2022
 *
 * @author WhiteMaks
 */

import Vector3          from "../../math/Vector3";
import ShaderProgram    from "../ShaderProgram";

/**
 * Абстрактный класс графического объекта
 */
abstract class GraphicsObject {
    /**
     * Идентификатор графического объекта
     * @private
     */
    private readonly id: number;
    /**
     * Позиция графического объекта
     * @protected
     */
    protected readonly position: Vector3;
    /**
     * Поворот графического объекта
     * @protected
     */
    protected readonly rotation: Vector3;
    /**
     * Шейдерная программа
     * @protected
     */
    protected readonly shaderProgram: ShaderProgram;

    /**
     * Объект для работы с Vertex Array Object
     * @private
     */
    protected vao: WebGLVertexArrayObject;
    /**
     * Массив для работы с Vertex Buffer Object
     * @private
     */
    protected vboArray: WebGLBuffer[];

    /**
     * Увеличение графического объекта
     * @protected
     */
    protected scale: number;

    /**
     * Конструктор для создания нового графического объекта
     * @param id идентификатор графического объекта
     * @param shaderProgram шейдерная программа которая будет обслуживать данный графический объект
     * @param position позиция графического объекта
     * @param rotation поворот графического объекта
     * @param scale увеличение графического объекта
     * @protected
     */
    protected constructor(id: number, shaderProgram: ShaderProgram, position: Vector3, rotation: Vector3, scale: number) {
        this.shaderProgram = shaderProgram;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.id = id;

        this.vao = this.shaderProgram.createVertexArrayObject();
        this.vboArray = [];
    }

    /**
     * Инициализация графического объекта
     */
    public abstract init(): void;

    /**
     * Отрисовка графического объекта
     */
    public abstract render(): void;

    /**
     * Обновление графического объекта
     */
    public abstract update(): void;

    /**
     * Получение позиции графического объекта
     */
    public getPosition(): Vector3 {
        return this.position;
    }

    /**
     * Установка новой позиции для графического объекта
     * @param x компонента X для позиции графического объекта
     * @param y компонента Y для позиции графического объекта
     * @param z компонента Z для позиции графического объекта
     */
    public setPosition(x: number, y: number, z: number): void {
        this.position.setX(x);
        this.position.setY(y);
        this.position.setZ(z);
    }

    /**
     * Установка нового поворота для графического объекта
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
     * Получение поворота графического объекта
     */
    public getRotation(): Vector3 {
        return this.rotation;
    }

    /**
     * Установка нового значения увеличения для графического объекта
     * @param scale увеличение графического объекта
     */
    public setScale(scale: number): void {
        this.scale = scale;
    }

    /**
     * Получение увеличения для графического объекта
     */
    public getScale(): number {
        return this.scale;
    }

    /**
     * Отчистка буферов
     * @protected
     */
    protected cleanBuffers(): void {
        this.shaderProgram.disableVertexAttribArray(0);
        this.shaderProgram.unbindArrayBuffer();
        this.shaderProgram.deleteBuffers(this.vboArray);
        this.shaderProgram.unbindVertexArrayObject();
        this.shaderProgram.deleteVertexArrayObject(this.vao);

        this.vao = this.shaderProgram.createVertexArrayObject();
        this.vboArray = [];
    }

    /**
     * Получение идентификатора графического объекта
     */
    public getId(): number {
        return this.id;
    }
}

export default GraphicsObject;