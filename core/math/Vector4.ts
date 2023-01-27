/**
 * Create on 04.09.2022
 *
 * @author WhiteMaks
 */

import Vector3 from "./Vector3";

/**
 * Класс для работы с векторами
 */
class Vector4 extends Vector3 {
    /**
     * Компонента W вектора
     * @private
     */
    private w: number;

    /**
     * Конструктор для создания нового вектора
     * @param x компонента вектора X
     * @param y компонента вектора Y
     * @param z компонента вектора Z
     * @param w компонента вектора W
     */
    public constructor(x: number, y: number, z: number, w: number) {
        super(x, y, z);

        this.w = w;
    }

    /**
     * Получение значения компоненты W
     */
    public getW(): number {
        return this.w;
    }

    /**
     * Установка значения компоненты вектора W
     * @param w новое значение компонента W для вектора
     */
    public setW(w: number): void {
        this.w = w;
    }

    /**
     * Умножение вектора на матрицу
     * @param matrix матрица для умножения
     */
    public multiplyMatrix(matrix: number[]): Vector4 {
        return new Vector4(
            matrix[0] * this.getX() + matrix[4] * this.getY() + matrix[8] * this.getZ() + matrix[12] * this.getW(),
            matrix[1] * this.getX() + matrix[5] * this.getY() + matrix[9] * this.getZ() + matrix[13] * this.getW(),
            matrix[2] * this.getX() + matrix[6] * this.getY() + matrix[10] * this.getZ() + matrix[14] * this.getW(),
            matrix[3] * this.getX() + matrix[7] * this.getY() + matrix[11] * this.getZ() + matrix[15] * this.getW()
        );
    }
}

export default Vector4;