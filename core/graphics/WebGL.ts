/**
 * Create on 26.08.2022
 *
 * @author WhiteMaks
 */

/**
 * Класс обертка над стандартными методами WebGL
 */
class WebGL {
    /**
     * Контекст для работы с WebGL
     * @private
     */
    private readonly context: WebGL2RenderingContext;

    /**
     * Название компании которой принадлежит браузер
     * @private
     */
    private readonly vendor: string;
    /**
     * Название видеокарты на которой происходит рендеринг
     * @private
     */
    private readonly renderer: string;

    /**
     * Конструктор создания объекта WebGL
     * @param context выбранный контекст для работы с WebGL
     */
    public constructor(context: WebGL2RenderingContext) {
        this.context = context; //сохранение контекста

        this.clearColor(
            0,
            0,
            0
        );

        const debugInfo = this.context.getExtension('WEBGL_debug_renderer_info');

        if (debugInfo) {
            this.vendor = this.context.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            this.renderer = this.context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } else {
            this.vendor = "HIDDEN";
            this.renderer = "HIDDEN";
        }
    }

    /**
     * Включение тесты глубины
     */
    public enableDepthTest(): void {
        this.context.enable(this.context.DEPTH_TEST);
    }

    /**
     * Включение прозрачности
     */
    public enableBlend(): void {
        this.context.enable(this.context.BLEND);

        this.context.blendFunc(
            this.context.SRC_ALPHA,
            this.context.ONE_MINUS_SRC_ALPHA
        );
    }

    /**
     * Заливка экрана выбранным цветом
     * @param red значение красного цвета
     * @param green значение зеленого цвета
     * @param blue значение синего цвета
     */
    public clearColor(red: number, green: number, blue: number): void {
        this.clearColorWithAlpha(
            red,
            green,
            blue,
            1.0
        )
    }

    /**
     * Заливка экрана выбранным цветом с прозрачностью
     * @param red значение красного цвета
     * @param green значение зеленого цвета
     * @param blue значение синего цвета
     * @param alpha значение прозрачности цвета
     */
    public clearColorWithAlpha(red: number, green: number, blue: number, alpha: number): void {
        this.context.clearColor(
            red,
            green,
            blue,
            alpha
        );
    }

    /**
     * Отчистка буфера цвета
     */
    public clearColorBuffer(): void {
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }

    /**
     * Отчистка буфера глубины
     */
    public clearDepthBuffer(): void {
        this.context.clear(this.context.DEPTH_BUFFER_BIT);
    }

    /**
     * Установка новой области просмотра
     * @param x значение x левого нижнего угла
     * @param y значение y левого нижнего угла
     * @param width значение ширины окна
     * @param height значение высоты окна
     */
    public setViewport(x: number, y: number, width: number, height: number): void {
        this.context.viewport(
            0,
            0,
            width,
            height
        );
    }

    /**
     * Создание объекта для хранения вершинного шейдера
     */
    public createVertexShader(): WebGLShader {
        let result = this.context.createShader(this.context.VERTEX_SHADER);
        //если возникла ошибка во время создания шейдера, то Exception
        if (!result) {
            throw new Error("Ошибка создания вершинного шейдера");
        }
        return result;
    }

    /**
     * Создание объекта для хранения фрагментного шейдера
     */
    public createFragmentShader(): WebGLShader {
        let result = this.context.createShader(this.context.FRAGMENT_SHADER);
        //если возникла ошибка во время создания шейдера, то Exception
        if (!result) {
            throw new Error("Ошибка создания фрагментного шейдера");
        }
        return result;
    }

    /**
     * Установка исходного кода для шейдера
     * @param shader шейдер в котором необходимо установить исходный код
     * @param sourceCode исходный код для шейдера
     * @param errorMessage сообщение об ошибке в случае не успешной компиляции шейдера
     */
    public setShaderSource(shader: WebGLShader, sourceCode: string, errorMessage: string): void {
        this.context.shaderSource(
            shader,
            sourceCode
        );

        this.context.compileShader(shader);

        //если возникла ошибка при компиляции шейдера, то подсказка будет в консоли
        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            console.error(
                errorMessage,
                this.context.getShaderInfoLog(shader)
            );
        }
    }

    /**
     * Создание программы
     */
    public createProgram(): WebGLProgram {
        let result = this.context.createProgram();
        //если возникла ошибка во время создания программы, то Exception
        if (!result) {
            throw new Error("Ошибка создания программы");
        }
        return result;
    }

    /**
     * Прикрепление шейдеров к программе
     * @param program шейдерная программа
     * @param shaders массив шейдеров для прикрепления к программе
     */
    public attachShadersToProgram(program: WebGLProgram, shaders: WebGLShader[]): void {
        for (const shader of shaders) {
            this.context.attachShader(
                program,
                shader
            );
        }

        this.context.linkProgram(program);

        //если возникла ошибка при связывании шейдеров с программой, то подсказка будет в консоли
        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            console.error(
                "Ошибка связывания программы с шейдерами",
                this.context.getProgramInfoLog(program)
            );
        }

        for (const shader of shaders) {
            this.context.detachShader(
                program,
                shader
            );
        }
    }

    /**
     * Установка программы как часть текущего состояния рендеринга
     * @param program программа для использования
     */
    public useProgram(program: WebGLProgram): void {
        this.context.useProgram(program);
    }

    /**
     * Удаление программы из текущего состояния рендеринга
     */
    public removeProgram() {
        this.context.useProgram(null);
    }

    /**
     * Создание VAO
     */
    public createVertexArrayObject(): WebGLVertexArrayObject {
        let result = this.context.createVertexArray();
        //если возникла ошибка во время создания VAO, то Exception
        if (!result) {
            throw new Error("Ошибка создания VAO");
        }
        return result;
    }

    /**
     * Удаление VAO
     * @param vao
     */
    public deleteVertexArrayObject(vao: WebGLVertexArrayObject): void {
        this.context.deleteVertexArray(vao);
    }

    /**
     * Связывание VAO с массивом имен
     * @param vao
     */
    public bindVertexArrayObject(vao: WebGLVertexArrayObject): void {
        this.context.bindVertexArray(vao);
    }

    /**
     * Отвязывание VAO от массива имен
     */
    public unbindVertexArrayObject(): void {
        this.context.bindVertexArray(null);
    }

    /**
     * Создание текстуры
     */
    public createTexture(): WebGLTexture {
        const result = this.context.createTexture();
        //если возникла ошибка во время создания текстуры, то Exception
        if (!result) {
            throw new Error("Ошибка создания текстуры");
        }
        return result;
    }

    /**
     * Связывание текстуры к цели текстурирования
     * @param texture текстура для связывания
     */
    public bindTexture2D(texture: WebGLTexture): void {
        this.context.bindTexture(
            this.context.TEXTURE_2D,
            texture
        );
    }

    /**
     * Установка 2D изображение текстуры
     * @param level уровень детализации
     * @param texture изображение текстуры
     */
    public textureImage2DRGBAUnsignedByte(level: number, texture: HTMLImageElement): void {
        this.context.texImage2D(
            this.context.TEXTURE_2D,
            level,
            this.context.RGBA,
            this.context.RGBA,
            this.context.UNSIGNED_BYTE,
            texture
        );

        this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_MIN_FILTER,
            this.context.NEAREST
        );

        this.context.texParameteri(
            this.context.TEXTURE_2D,
            this.context.TEXTURE_MAG_FILTER,
            this.context.NEAREST
        );
    }

    /**
     * Генерация MIM карты для указанной цели текстурирования
     */
    public generateMipmap2D() {
        this.context.generateMipmap(this.context.TEXTURE_2D);
    }

    /**
     * Создание буфера
     */
    public createBuffer(): WebGLBuffer {
        const result = this.context.createBuffer();
        //если возникла ошибка во время создания буфера, то Exception
        if (!result) {
            throw new Error("Ошибка создания буфера");
        }
        return result;
    }

    /**
     * Удаление буфера
     * @param buffer буфер для удаления
     */
    public deleteBuffer(buffer: WebGLBuffer): void {
        this.context.deleteBuffer(buffer);
    }

    /**
     * Связывание объекта буфера с атрибутами вершин
     * @param vbo буфер который необходимо связать
     */
    public bindArrayBuffer(vbo: WebGLBuffer): void {
        this.context.bindBuffer(
            this.context.ARRAY_BUFFER,
            vbo
        );
    }

    /**
     * Отвязывание объекта буфера от атрибутов вершин
     */
    public unbindArrayBuffer(): void {
        this.context.bindBuffer(
            this.context.ARRAY_BUFFER,
            null
        );
    }

    /**
     * Связывание объекта буфера с элементами атрибутов вершин
     * @param vbo буфер который необходимо связать
     */
    public bindElementArrayBuffer(vbo: WebGLBuffer): void {
        this.context.bindBuffer(
            this.context.ELEMENT_ARRAY_BUFFER,
            vbo
        );
    }

    /**
     * Создание нового статического хранилища данных для буфера с атрибутами вершин
     * @param data массив данных
     */
    public arrayBufferStaticDataFloat32(data: number[]): void {
        this.context.bufferData(
            this.context.ARRAY_BUFFER,
            new Float32Array(data),
            this.context.STATIC_DRAW
        );
    }

    /**
     * Создание нового статического хранилища данных для буфера с элементами атрибутов вершин
     * @param data массив данных
     */
    public elementArrayBufferStaticDataUint16(data: number[]): void {
        this.context.bufferData(
            this.context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(data),
            this.context.STATIC_DRAW
        );
    }

    /**
     * Включение массива атрибутов вершин по указанному индексу
     * @param index индекс для включения
     */
    public enableVertexAttribArray(index: number): void {
        this.context.enableVertexAttribArray(index);
    }

    /**
     * Выключение массива атрибутов вершин по указанному индексу
     * @param index индекс для выключения
     */
    public disableVertexAttribArray(index: number): void {
        this.context.disableVertexAttribArray(index);
    }

    /**
     * Определение массива данных типа Float атрибутов вершин
     * @param index индекс на котором будет расположен массив данных
     * @param size количество компонентов на компонент (если в массиве на одну точку приходиться координаты x, y, z, то size должен быть равен 3)
     * @param normalized
     * @param stride шаг от одного атрибута к другом (если все идет по порядку (x1, y1, z1, x2, y2, z2, ...), то stride должен быть равен 0)
     * @param offset смещение первого компонента
     */
    public vertexAttribPointerFloat(index: number, size: number, normalized: boolean, stride: number, offset: number) {
        this.context.vertexAttribPointer(
            index,
            size,
            this.context.FLOAT,
            normalized,
            stride,
            offset
        );
    }

    /**
     * Визуализация треугольников из VAO
     * @param first начальный индекс
     * @param count количество треугольников для визуализации
     */
    public drawTriangleArrays(first: number, count: number): void {
        this.context.drawArrays(
            this.context.TRIANGLES,
            first,
            count
        );
    }

    /**
     * Визуализация треугольников из элементов VAO
     * @param count количество треугольников для визуализации
     * @param offset смещение
     */
    public drawTriangleElement(count: number, offset: number): void {
        this.context.drawElements(
            this.context.TRIANGLES,
            count,
            this.context.UNSIGNED_SHORT,
            offset
        );
    }

    /**
     * Визуализация линий из элементов VAO
     * @param count количество линий для визуализации
     * @param offset смещение
     */
    public drawLineElements(count: number, offset: number): void {
        this.context.drawElements(
            this.context.LINES,
            count,
            this.context.UNSIGNED_SHORT,
            offset
        );
    }

    /**
     * Получение местоположения униформы в программе
     * @param program программа
     * @param name имя униформы
     */
    public getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation {
        const result = this.context.getUniformLocation(
            program,
            name
        );

        //если возникла ошибка во время получение униформы, то Exception
        if (!result) {
            throw new Error("Ошибка получения униформы с именем [ " + name + " ]");
        }
        return result;
    }

    /**
     * Установка данных в униформу для текущего объекта программы
     * @param location положение униформы
     * @param transpose нужно ли транспонировать матрицу
     * @param data данные для установки в униформу
     */
    public uniformMatrix4fvFloat32(location: WebGLUniformLocation, transpose: boolean, data: number[]): void {
        this.context.uniformMatrix4fv(
            location,
            transpose,
            new Float32Array(data)
        );
    }

    /**
     * Установка данных в униформу для текущего объекта программы
     * @param location положение униформы
     * @param x компонента X
     * @param y компонента Y
     * @param z компонента Z
     */
    public uniformVertex3Float(location: WebGLUniformLocation, x: number, y: number, z: number): void {
        this.context.uniform3f(
            location,
            x,
            y,
            z
        );
    }

    /**
     * Установка данных в униформу для текущего объекта программы
     * @param location положение униформы
     * @param x компонента X
     * @param y компонента Y
     * @param z компонента Z
     * @param w компонента W
     */
    public uniformVertex4Float(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void {
        this.context.uniform4f(
            location,
            x,
            y,
            z,
            w
        );
    }

    /**
     * Установка данных на заданную позицию
     * @param location положение униформы
     * @param value позиция
     */
    public uniformI(location: WebGLUniformLocation, value: number): void {
        this.context.uniform1i(
            location,
            value
        );
    }

    /**
     * Установка данных на заданную позицию
     * @param location положение униформы
     * @param value позиция
     */
    public uniformF(location: WebGLUniformLocation, value: number): void {
        this.context.uniform1f(
            location,
            value
        );
    }

    /**
     * Использование текстурного регистра 0
     */
    public activeTexture0() {
        this.context.activeTexture(this.context.TEXTURE0);
    }

    /**
     * @deprecated Нельзя отдавать наружу контекст!!!
     */
    public getContext(): WebGL2RenderingContext {
        return this.context;
    }
}

export default WebGL;