/**
 * Create on 27.08.2022
 *
 * @author WhiteMaks
 */

import WebGL        from "../WebGL";

/**
 * Абстрактный класс для работы с шейдером
 */
abstract class Shader {
    /**
     * Объект для работы с WebGL
     * @private
     */
    private readonly webGL: WebGL;
    /**
     * Объект для хранения информации о шейдере
     * @private
     */
    private readonly shader: WebGLShader;

    /**
     * Конструктор для создания объекта фрагментного шейдера
     * @param webGL объект для работы с WebGL
     * @param shader объект для хранения информации о шейдере
     */
    protected constructor(webGL: WebGL, shader: WebGLShader) {
        this.webGL = webGL;
        this.shader = shader;
    }

    /**
     * Компиляция шейдера
     */
    protected compileWithError(shaderCode: string, errorMessage: string): void {
        //установка исходного кода для шейдера и его компиляция
        this.webGL.setShaderSource(
            this.shader,
            shaderCode,
            errorMessage
        );
    }

    /**
     * Получить информацию о шейдере
     */
    public getContext(): WebGLShader {
        return this.shader;
    }

    public abstract compile(shaderCode: string): void;

}

export default Shader;