/**
 * Create on 28.08.2022
 *
 * @author WhiteMaks
 */

import Vector3 from "./Vector3";

/**
 * Класс для работы с трансформациями
 */
class Transformation {
    /**
     * Массив содержащий единичную матрицу
     * @private
     */
    private static readonly IDENTITY_MATRIX: number[] = [
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        0,  0,  0,  1
    ];

    /**
     * Получение мировой матрицы
     * @param translationVector вектор перемещения
     * @param rotationVector вектор поворота
     * @param scaleX масштабирование по оси X
     * @param scaleY масштабирование по оси Y
     * @param scaleZ масштабирование по оси Z
     */
    public static getWorldMatrix(translationVector: Vector3, rotationVector: Vector3, scaleX: number, scaleY: number, scaleZ: number): number[] {
        const translationMatrix = this.getTranslationMatrix(this.IDENTITY_MATRIX, translationVector);
        const rotationXMatrix = this.getRotationXMatrix(translationMatrix, Transformation.degreesToRadians(rotationVector.getX()));
        const rotationXYMatrix = this.getRotationYMatrix(rotationXMatrix, Transformation.degreesToRadians(rotationVector.getY()));
        const rotationXYZMatrix = this.getRotationZMatrix(rotationXYMatrix, Transformation.degreesToRadians(rotationVector.getZ()));
        return this.getScale(rotationXYZMatrix, scaleX, scaleY, scaleX);
    }

    /**
     * Получение матрицы проекции
     * @param aspectRatio отношение между шириной и высотой экрана
     * @param fieldOfView угол поля зрения (в радианах)
     * @param zNear расстояние до ближней плоскости
     * @param zFar расстояние до дальней плоскости
     */
    public static getProjectionMatrix(aspectRatio: number, fieldOfView: number, zNear: number, zFar: number): number[] {
        const f = 1 / Math.tan(fieldOfView / 2);
        const nf = 1 / (zNear - zFar);

        return [
            f / aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (zFar + zNear) * nf, -1,
            0, 0, 2 * zFar * zNear * nf, 0
        ];
    }

    /**
     * Получение матрицы ортогональной проекции
     * @param left левая граница усеченного конуса
     * @param right правая граница усеченного конуса
     * @param bottom нижняя граница усеченного конуса
     * @param top верхняя граница усеченного конуса
     */
    public static getOrthogonalProjectionMatrix(left: number, right: number, bottom: number, top: number): number[] {
        const leftMinusRight = 1 / (left - right);
        const bottomMinusTop = 1 / (bottom - top);

        return [
            (-2) * leftMinusRight, 0, 0, 0,
            0, (-2) * bottomMinusTop, 0, 0,
            0, 0, -1, 0,
            (left + right) * leftMinusRight, (top + bottom) * bottomMinusTop, 0, 1
        ];
    }

    /**
     * Получение матрицы просмотра
     * @param position позиция с которой необходимо получить матрицу
     * @param rotation поворот по которому необходимо получить матрицу
     */
    public static getViewMatrix(position: Vector3, rotation: Vector3): number[] {
        const rotationXMatrix = this.getRotationMatrix(this.IDENTITY_MATRIX, Transformation.degreesToRadians(rotation.getX()), new Vector3(1, 0, 0));
        const rotationXYMatrix = this.getRotationMatrix(rotationXMatrix, Transformation.degreesToRadians(rotation.getY()), new Vector3(0, 1, 0));
        return this.getTranslationMatrix(rotationXYMatrix, new Vector3(-position.getX(), -position.getY(), -position.getZ()));
    }

    /**
     * Перевод градусов в радианы
     * @param angle значение угла в градусах
     */
    public static degreesToRadians(angle: number): number {
        return angle * (Math.PI / 180);
    }

    /**
     * Получение матрицы перемещения
     * @param matrix матрица, которую необходимо преобразовать
     * @param translationVector вектор перемещения
     * @private
     */
    private static getTranslationMatrix(matrix: number[], translationVector: Vector3): number[] {
        return [
            matrix[0],  matrix[1],  matrix[2],  matrix[3],
            matrix[4],  matrix[5],  matrix[6],  matrix[7],
            matrix[8],  matrix[9],  matrix[10], matrix[11],
            matrix[0] * translationVector.getX() + matrix[4] * translationVector.getY() + matrix[8] * translationVector.getZ() + matrix[12],    matrix[1] * translationVector.getX() + matrix[5] * translationVector.getY() + matrix[9] * translationVector.getZ() + matrix[13],    matrix[2] * translationVector.getX() + matrix[6] * translationVector.getY() + matrix[10] * translationVector.getZ() + matrix[14],  matrix[3] * translationVector.getX() + matrix[7] * translationVector.getY() + matrix[11] * translationVector.getZ() + matrix[15]
        ];
    }

    /**
     * Получение матрицы поворота по оси X
     * @param matrix матрица, которую необходимо преобразовать
     * @param angleX угол по оси X (в радианах) на который необходимо повернуть
     * @private
     */
    private static getRotationXMatrix(matrix: number[], angleX: number): number[] {
        const sinAngle = Math.sin(angleX);
        const cosAngle = Math.cos(angleX);

        return [
            matrix[0],  matrix[1],  matrix[2],  matrix[3],
            matrix[4] * cosAngle + matrix[8] * sinAngle,    matrix[5] * cosAngle + matrix[9] * sinAngle,    matrix[6] * cosAngle + matrix[10] * sinAngle,   matrix[7] * cosAngle + matrix[11] * sinAngle,
            matrix[8] * cosAngle - matrix[4] * sinAngle,    matrix[9] * cosAngle - matrix[5] * sinAngle,    matrix[10] * cosAngle - matrix[6] * sinAngle,   matrix[11] * cosAngle - matrix[7] * sinAngle,
            matrix[12], matrix[13], matrix[14], matrix[15]
        ];
    }

    /**
     * Получение матрицы поворота по оси Y
     * @param matrix матрица, которую необходимо преобразовать
     * @param angleY угол по оси Y (в радианах) на который необходимо повернуть
     */
    private static getRotationYMatrix(matrix: number[], angleY: number): number[] {
        const sinAngle = Math.sin(angleY);
        const cosAngle = Math.cos(angleY);

        return [
            matrix[0] * cosAngle - matrix[8] * sinAngle,    matrix[1] * cosAngle - matrix[9] * sinAngle,    matrix[2] * cosAngle - matrix[10] * sinAngle,   matrix[3] * cosAngle - matrix[11] * sinAngle,
            matrix[4],   matrix[5],   matrix[6],   matrix[7],
            matrix[0] * sinAngle + matrix[8] * cosAngle,    matrix[1] * sinAngle + matrix[9] * cosAngle,    matrix[2] * sinAngle + matrix[10] * cosAngle,   matrix[3] * sinAngle + matrix[11] * cosAngle,
            matrix[12],  matrix[13],  matrix[14],  matrix[15]
        ];
    }

    /**
     * Получение матрицы поворота по оси Z
     * @param matrix матрица, которую необходимо преобразовать
     * @param angleZ угол по оси Z (в радианах) на который необходимо повернуть
     * @private
     */
    private static getRotationZMatrix(matrix: number[], angleZ: number): number[] {
        const sinAngle = Math.sin(angleZ);
        const cosAngle = Math.cos(angleZ);

        return [
            matrix[0] * cosAngle + matrix[4] * sinAngle,    matrix[1] * cosAngle + matrix[5] * sinAngle,    matrix[2] * cosAngle + matrix[6] * sinAngle,    matrix[3] * cosAngle + matrix[7] * sinAngle,
            matrix[4] * cosAngle - matrix[0] * sinAngle,    matrix[5] * cosAngle - matrix[1] * sinAngle,    matrix[6] * cosAngle - matrix[2] * sinAngle,    matrix[7] * cosAngle - matrix[3] * sinAngle,
            matrix[8],  matrix[9],  matrix[10], matrix[11],
            matrix[12], matrix[13], matrix[14], matrix[15]
        ];
    }

    /**
     * Получение матрицы масштабирования
     * @param matrix матрица, которую необходимо преобразовать
     * @param x масштабирование по оси X
     * @param y масштабирование по оси Y
     * @param z масштабирование по оси Z
     * @private
     */
    private static getScale(matrix: number[], x: number, y: number, z: number): number[] {
        return [
            matrix[0] * x,   matrix[1] * x,   matrix[2] * x,   matrix[3] * x,
            matrix[4] * y,   matrix[5] * y,   matrix[6] * y,   matrix[7] * y,
            matrix[8] * z,   matrix[9] * z,   matrix[10] * z,  matrix[11] * z,
            matrix[12],      matrix[13],      matrix[14],      matrix[15]
        ];
    }

    /**
     * Получение матрицы поворота по заданной оси вращения
     * @param matrix матрица, которую необходимо преобразовать
     * @param angle угол поворота (в радианах)
     * @param axis вектор оси вращения
     * @private
     */
    private static getRotationMatrix(matrix: number[], angle: number, axis: Vector3): number[] {
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);

        const oneMinusCosAngle = 1 - cosAngle;

        const normalizedVector = axis.getNormalization();

        const a = normalizedVector.getX() * normalizedVector.getX() * oneMinusCosAngle + cosAngle;
        const b = normalizedVector.getY() * normalizedVector.getX() * oneMinusCosAngle + normalizedVector.getZ() * sinAngle;
        const c = normalizedVector.getZ() * normalizedVector.getX() * oneMinusCosAngle - normalizedVector.getY() * sinAngle;
        const d = normalizedVector.getX() * normalizedVector.getY() * oneMinusCosAngle - normalizedVector.getZ() * sinAngle;
        const e = normalizedVector.getY() * normalizedVector.getY() * oneMinusCosAngle + cosAngle;
        const f = normalizedVector.getZ() * normalizedVector.getY() * oneMinusCosAngle + normalizedVector.getX() * sinAngle;
        const g = normalizedVector.getX() * normalizedVector.getZ() * oneMinusCosAngle + normalizedVector.getY() * sinAngle;
        const h = normalizedVector.getY() * normalizedVector.getZ() * oneMinusCosAngle - normalizedVector.getX() * sinAngle;
        const i = normalizedVector.getZ() * normalizedVector.getZ() * oneMinusCosAngle + cosAngle;

        return [
            matrix[0] * a + matrix[4] * b + matrix[8] * c, matrix[1] * a + matrix[5] * b + matrix[9] * c, matrix[2] * a + matrix[6] * b + matrix[10] * c, matrix[3] * a + matrix[7] * b + matrix[11] * c,
            matrix[0] * d + matrix[4] * e + matrix[8] * f, matrix[1] * d + matrix[5] * e + matrix[9] * f, matrix[2] * d + matrix[6] * e + matrix[10] * f, matrix[3] * d + matrix[7] * e + matrix[11] * f,
            matrix[0] * g + matrix[4] * h + matrix[8] * i, matrix[1] * g + matrix[5] * h + matrix[9] * i, matrix[2] * g + matrix[6] * h + matrix[10] * i, matrix[3] * g + matrix[7] * h + matrix[11] * i,
            matrix[12], matrix[13], matrix[14], matrix[15]
        ];
    }

}



export default Transformation;