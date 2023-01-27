/**
 * Create on 13.09.2022
 *
 * @author WhiteMaks
 */

import Mesh                 from "./Mesh";
import Vector3              from "../../math/Vector3";
import ShaderProgram        from "../ShaderProgram";
import Transformation       from "../../math/Transformation";
import GraphicsObject       from "./GraphicsObject";

/**
 * Класс для работы с графической моделью
 */
class GraphicsModel extends GraphicsObject {
    /**
     * Объект для работы с полигональной сеткой
     * @protected
     */
    protected mesh: Mesh;

    /**
     * Конструктор для создания объекта графической модели
     * @param id идентификатор графической модели
     * @param shaderProgram объект шейдерной программы уже умеющий прикрепленные шейдеры
     * @param mesh объект полигональной сетки
     */
    public constructor(id: number, shaderProgram: ShaderProgram, mesh: Mesh) {
        super(
            id,
            shaderProgram,
            new Vector3(
                0,
                0,
                0
            ),
            new Vector3(
                0,
                0,
                0
            ),
            1
        );

        this.mesh = mesh;
    }

    public override init(): void {
        this.shaderProgram.bindVertexArrayObject(this.vao);

        this.vboArray.push(
            this.shaderProgram.attachStaticDataFloat32InArrayBuffer(
                0,
                3,
                false,
                0,
                0,
                this.mesh.getPositions()
            )
        );

        this.vboArray.push(
            this.shaderProgram.attachStaticDataFloat32InArrayBuffer(
                1,
                2,
                false,
                0,
                0,
                this.mesh.getTextureCoordinates()
            )
        );

        this.vboArray.push(
            this.shaderProgram.attachStaticDataFloat32InArrayBuffer(
                2,
                3,
                false,
                0,
                0,
                this.mesh.getNormals()
            )
        );

        this.vboArray.push(
            this.shaderProgram.attachStaticDataUint16InElementArrayBuffer(this.mesh.getIndices())
        );

        this.shaderProgram.unbindArrayBuffer();
        this.shaderProgram.unbindVertexArrayObject();
    }

    public override render(): void {
        const worldMatrix = Transformation.getWorldMatrix(
            this.position,
            this.rotation,
            this.scale,
            this.scale,
            this.scale
        );

        this.shaderProgram.attachMatrix4UniformDataFloat32(
            "worldMatrix",
            worldMatrix
        );

        this.shaderProgram.drawTriangleElementsWithVAO(
            this.vao,
            this.mesh.getVertexCount(),
            0
        );
    }

    public override update(): void {

    }
}

export default GraphicsModel;