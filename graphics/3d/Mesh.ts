/**
 * Create on 28.08.2022
 *
 * @author WhiteMaks
 */

/**
 * Класс для работы с полигональной сеткой
 */
class Mesh {
    /**
     * Массив позиций вершин
     * @private
     */
    private readonly positions: number[];
    /**
     * Массив координат для текстур
     * @private
     */
    private readonly textureCoordinates: number[];
    /**
     * Массив нормалей к поверхностям
     * @private
     */
    private readonly normals: number[];
    /**
     * Массив индексов построения примитива
     * @private
     */
    private readonly indices: number[];
    /**
     * Количество вершин в полигональной сетки
     * @private
     */
    private readonly vertexCount: number;
    
    /**
     * Конструктор для создания объекта полигонально сетки
     * @param positions массив позиций вершин формата (x, y, z)
     * @param textureCoordinates массив координат для текстур формата (x, y)
     * @param normals массив нормалей к поверхностям
     * @param indices массив индексов построения примитива
     * @param vertexCount количество вершин
     */
    public constructor(positions: number[], textureCoordinates: number[], normals: number[], indices: number[], vertexCount: number) {
        this.positions = positions;
        this.textureCoordinates = textureCoordinates;
        this.normals = normals;
        this.indices = indices;
        this.vertexCount = vertexCount;
    }

    /**
     * Получение количества вершин
     */
    public getVertexCount(): number {
        return this.vertexCount;
    }

    /**
     * Получение позиций вершин
     */
    public getPositions(): number[] {
        return this.positions;
    }

    /**
     * Получение координат текстур
     */
    public getTextureCoordinates(): number[] {
        return this.textureCoordinates;
    }

    /**
     * Получение нормалей к поверхностям
     */
    public getNormals(): number[] {
        return this.normals;
    }

    /**
     * Получение индексов вершин
     */
    public getIndices(): number[] {
        return this.indices;
    }

}

export default Mesh;