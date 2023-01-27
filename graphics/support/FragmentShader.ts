/**
 * Create on 27.08.2022
 *
 * @author WhiteMaks
 */

import WebGL        from "../WebGL";
import Shader       from "./Shader";

/**
 * Класс для работы с фрагментным шейдером
 */
class FragmentShader extends Shader {

    /**
     * Конструктор для создания объекта фрагментного шейдера
     * @param webGL объект для работы с WebGL
     */
    public constructor(webGL: WebGL) {
        super(
            webGL,
            webGL.createFragmentShader()
        );
    }

    /**
     * Компиляция вершинного шейдера
     * @param shaderCode исходный код для фрагментного шейдера
     */
    public override compile(shaderCode: string): void {
        super.compileWithError(
            shaderCode,
            "Компиляция фрагментного шейдера завершилась ошибкой"
        );
    }
}


export default FragmentShader;