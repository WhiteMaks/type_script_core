/**
 * Create on 27.08.2022
 *
 * @author WhiteMaks
 */

import WebGL        from "../WebGL";
import Shader       from "./Shader";

/**
 * Класс для работы с вершинным шейдером
 */
class VertexShader extends Shader {

    /**
     * Конструктор для создания объекта вершинного шейдера
     * @param webGL объект для работы с WebGL
     */
    public constructor(webGL: WebGL) {
        super(
            webGL,
            webGL.createVertexShader()
        );
    }

    /**
     * Компиляция вершинного шейдера
     * @param shaderCode исходный код для вершинного шейдера
     */
    public override compile(shaderCode: string): void {
        super.compileWithError(
            shaderCode,
            "Компиляция вершинного шейдера завершилась ошибкой"
        );
    }
}


export default VertexShader;