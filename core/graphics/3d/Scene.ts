/**
 * Create on 27.09.2022
 *
 * @author WhiteMaks
 */

import Camera               from "./objects/Camera";
import ShaderProgram        from "../ShaderProgram";
import Transformation       from "../../math/Transformation";
import GraphicsElement      from "../GraphicsElement";

/**
 * Класс для работы со сценой
 */
class Scene {
    /**
     * Объект для работы с камерой
     * @private
     */
    private readonly camera: Camera;

    /**
     * Массив шейдерных программ
     * @private
     */
    private shaderPrograms: ShaderProgram[];

    /**
     * Конструктор для создания нового объекта сцены
     */
    public constructor() {
        this.camera = new Camera(
            60,
            0.01,
            1000
        );

        // this.camera.setPosition(0.5, 0.5, -0.5);

        this.shaderPrograms = [];
    }

    /**
     * Инициализация сцены
     */
    public init(): void {

    }

    /**
     * Рендеринг сцены
     * @param graphicsElement объект графического элемента
     */
    public render(graphicsElement: GraphicsElement): void {
        this.camera.render();

        const orthogonalProjectionMatrix = Transformation.getOrthogonalProjectionMatrix(
            0,
            graphicsElement.getWidth(),
            graphicsElement.getHeight(),
            0
        );

        const projectionMatrix = this.camera.getProjectionMatrix(
            graphicsElement.getWidth() / graphicsElement.getHeight()
        );

        const viewMatrix = this.camera.getViewMatrix();

        for (const shaderProgram of this.shaderPrograms) {
            shaderProgram.render(
                orthogonalProjectionMatrix,
                projectionMatrix,
                viewMatrix
            );
        }
    }

    /**
     * Получение объекта камеры
     */
    public getCamera(): Camera {
        return this.camera;
    }

    /**
     * Сохранение новых шейдерных программ
     * @param shaderPrograms массив новых шейдерных программ
     */
    public setShaderPrograms(shaderPrograms: ShaderProgram[]): void {
        this.shaderPrograms = shaderPrograms;
    }

    /**
     * Поиск скомпилированной шейдерной программы по ее идентификатору
     * @param id идентификатор шейдерной программы
     */
    public findShaderProgramById(id: number): ShaderProgram | undefined {
        return this.shaderPrograms.find(
            shaderProgram => shaderProgram.getId() === id
        );
    }

    /**
     * Рендеринг графических объектов
     * @param projectionMatrix матрица проекции
     * @param viewMatrix матрица просмотра
     * @private
     */
    private renderGraphicsObjects(projectionMatrix: number[], viewMatrix: number[]): void {

    }

    /**
     * Рендеринг текстовых объектов
     * @param orthogonalProjectionMatrix матрица ортогональной проекции
     * @private
     */
    private renderTextObjects(orthogonalProjectionMatrix: number[]): void {

    }
}

export default Scene;