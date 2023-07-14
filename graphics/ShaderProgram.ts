/**
 * Create on 27.08.2022
 *
 * @author WhiteMaks
 */
import WebGL from "./WebGL";
import Shader from "./support/Shader";
import Vector3 from "../math/Vector3";
import Vector4 from "../math/Vector4";
import VertexShader from "./support/VertexShader";
import FragmentShader from "./support/FragmentShader";
import GraphicsObject from "./3d/GraphicsObject";
import Material from "./3d/Material";
import PointLight from "./3d/objects/PointLight";
import Camera from "./3d/objects/Camera";
import DirectionLight from "./3d/objects/DirectionLight";
import Attenuation from "../physics/Attenuation";

/**
 * Класс для работы с шейдерной программой
 */
class ShaderProgram {
	/**
	 * Идентификатор для шейдерной программы
	 * @private
	 */
	private readonly id: number;
	/**
	 * Объект для работы с WebGL
	 * @private
	 */
	private readonly webGL: WebGL;
	/**
	 * Объект для работы с программой
	 * @private
	 */
	private readonly program: WebGLProgram;
	/**
	 * Объект для работы с вершинным шейдером
	 * @private
	 */
	private readonly vertexShader: Shader;
	/**
	 * Объект для работы с фрагментным шейдером
	 * @private
	 */
	private readonly fragmentShader: Shader;

	/**
	 * Массив графических объектов
	 * @private
	 */
	private graphicsObjects: GraphicsObject[];

	/**
	 * Объект пространственного света
	 * @private
	 */
	private ambientLight: Vector3;
	/**
	 * Объект точечного источника света
	 * @private
	 */
	private pointLight: PointLight;
	/**
	 * Объект направленного источника света
	 * @private
	 */
	private directionLight: DirectionLight;

	/**
	 * Конструктор для создания объекта шейдерной программы
	 * @param id идентификатор для шейдерной программы
	 * @param webGL объект для работы с WebGL
	 */
	public constructor(webGL: WebGL, id: number) {
		this.id = id; //сохранение идентификатора
		this.webGL = webGL; //сохранение объекта WebGL

		//инициализация объекта программы
		this.program = this.webGL.createProgram();
		//инициализация объекта для работы с вершинным шейдером
		this.vertexShader = new VertexShader(this.webGL);
		//инициализация объекта для работы с фрагментным шейдером
		this.fragmentShader = new FragmentShader(this.webGL);

		this.graphicsObjects = [];

		this.ambientLight = new Vector3(
			0.0,
			0.0,
			0.0
		);

		this.pointLight = new PointLight(
			new Vector3(0, 0, 0),
			new Vector3(0, 0, 0),
			new Attenuation(0, 0, 0)
		);

		this.directionLight = new DirectionLight(
			new Vector3(0, 0, 0),
			new Vector3(0, 0, 0)
		);
	}

	public createVertexArrayObject(): WebGLVertexArrayObject {
		return this.webGL.createVertexArrayObject();
	}

	/**
	 * Визуализация треугольников из элементов VAO
	 * @param vao
	 * @param count количество треугольников для визуализации
	 * @param offset смещение
	 */
	public drawTriangleElementsWithVAO(vao: WebGLVertexArrayObject, count: number, offset: number): void {
		this.bindVertexArrayObject(vao);

		this.drawTriangleElements(
			count,
			offset
		);

		this.unbindVertexArrayObject();
	}

	/**
	 * Визуализация треугольников
	 * @param count количество треугольников для визуализации
	 * @param offset смещение
	 */
	public drawTriangleElements(count: number, offset: number): void {
		this.webGL.drawTriangleElement(
			count,
			offset
		);
	}

	/**
	 * Визуализация линий из элементов VAO
	 * @param vao
	 * @param count количество треугольников для визуализации
	 * @param offset смещение
	 */
	public drawLineElements(vao: WebGLVertexArrayObject, count: number, offset: number): void {
		this.bindVertexArrayObject(vao);

		this.webGL.drawLineElements(
			count,
			offset
		);

		this.unbindVertexArrayObject();
	}

	/**
	 * Связывание VAO с массивом имен. Вызвать до момента добавления новых элементов в VBO Array
	 * @param vao
	 */
	public bindVertexArrayObject(vao: WebGLVertexArrayObject): void {
		this.webGL.bindVertexArrayObject(vao);
	}

	/**
	 * Отвязывание объекта буфера от атрибутов вершин
	 */
	public unbindArrayBuffer(): void {
		this.webGL.unbindArrayBuffer();
	}

	/**
	 * Отвязывание VAO от массива имен. Вызывать после того как все VBO прикреплены к VAO
	 */
	public unbindVertexArrayObject(): void {
		this.webGL.unbindVertexArrayObject();
	}

	/**
	 * Выключение массива атрибутов вершин по указанному индексу
	 * @param index индекс для выключения
	 */
	public disableVertexAttribArray(index: number): void {
		this.webGL.disableVertexAttribArray(index);
	}

	/**
	 * Удаление буферов
	 * @param buffers массив буферов для удаления
	 */
	public deleteBuffers(buffers: WebGLBuffer[]): void {
		for (const buffer of buffers) {
			this.webGL.deleteBuffer(buffer);
		}
	}

	/**
	 * Удаление VAO
	 * @param vao
	 */
	public deleteVertexArrayObject(vao: WebGLVertexArrayObject): void {
		this.webGL.deleteVertexArrayObject(vao);
	}

	/**
	 * Прикрепление статических данных формата float 32 в массив вершинных буферов
	 * @param index индекс на котором будет расположен массив данных. В вершенный шейдер будет записан в переменную layout (location = index)
	 * @param size количество компонентов на компонент (если в массиве на одну точку приходиться координаты x, y, z, то size должен быть равен 3)
	 * @param normalized нужна ли нормализация данных
	 * @param stride шаг от одного атрибута к другом (если все идет по порядку (x1, y1, z1, x2, y2, z2, ...), то stride должен быть равен 0)
	 * @param offset смещение первого компонента
	 * @param data данные для прикрепления
	 */
	public attachStaticDataFloat32InArrayBuffer(index: number, size: number, normalized: boolean, stride: number, offset: number, data: number[]): WebGLBuffer {
		const result = this.webGL.createBuffer();

		this.webGL.bindArrayBuffer(result);
		this.webGL.arrayBufferStaticDataFloat32(data);
		this.webGL.enableVertexAttribArray(index);

		this.webGL.vertexAttribPointerFloat(
			index,
			size,
			normalized,
			stride,
			offset
		);

		return result;
	}

	/**
	 * Прикрепление статических данных формата uint 16 в массив элементов вершинных буферов
	 * @param data данные для прикрепления
	 */
	public attachStaticDataUint16InElementArrayBuffer(data: number[]): WebGLBuffer {
		const result = this.webGL.createBuffer();

		this.webGL.bindElementArrayBuffer(result);
		this.webGL.elementArrayBufferStaticDataUint16(data);

		return result;
	}

	/**
	 * Создание вершинного шейдера, а так же его компиляция
	 * @param shaderCode исходный код вершинного шейдера
	 */
	public createVertexShader(shaderCode: string): void {
		this.vertexShader.compile(shaderCode); //компиляция вершинного шейдера
	}

	/**
	 * Создание фрагментного шейдера, а так же его компиляция
	 * @param shaderCode исходный код фрагментного шейдера
	 */
	public createFragmentShader(shaderCode: string): void {
		this.fragmentShader.compile(shaderCode); //компиляция фрагментного шейдера
	}

	/**
	 * Прикрепление вершинного и фрагментного шейдера к программе
	 */
	public attachShaders(): void {
		this.webGL.attachShadersToProgram(
			this.program,
			[this.vertexShader.getContext(), this.fragmentShader.getContext()]
		);
	}

	/**
	 * Установка шейдерной программы как часть текущего состояния рендеринга
	 */
	public bind(): void {
		this.webGL.useProgram(this.program); //использование программы
	}

	/**
	 * Удаление шейдерной программы из текущего состояния рендеринга
	 */
	public unbind(): void {
		this.webGL.removeProgram(); //удаление программы
	}

	/**
	 * Отрисовка графического шейдера с его графическими объектами
	 * @param camera объект для работы с камерой
	 * @param orthogonalProjectionMatrix матрица ортогональной проекции
	 * @param projectionMatrix матрица проекции
	 * @param viewMatrix матрица просмотра
	 */
	public render(camera: Camera, orthogonalProjectionMatrix: number[], projectionMatrix: number[], viewMatrix: number[]): void {
		this.bind();

		this.attachMatrix4UniformDataFloat32(
			"projectionMatrix",
			projectionMatrix
		);

		this.attachMatrix4UniformDataFloat32(
			"viewMatrix",
			viewMatrix
		);

		this.attachUniformVector3FData(
			"ambientLight",
			this.ambientLight
		);

		this.attachPointLightUniformData(
			"pointLight",
			this.pointLight
		);

		this.attachDirectionalLightUniformData(
			"directionLight",
			this.directionLight
		)

		this.attachCameraUniformData(
			"camera",
			camera
		)

		for (const graphicsModel of this.graphicsObjects) {
			graphicsModel.render();
		}

		this.unbind();
	}

	/**
	 * Прикрепление данных направленного источника света
	 * @param uniformName название униформы
	 * @param directionLight объект направленного света
	 */
	public attachDirectionalLightUniformData(uniformName: string, directionLight: DirectionLight): void {
	    this.attachUniformVector3FData(
	        uniformName + ".color",
		    directionLight.getColor()
	    );
	    this.attachUniformVector3FData(
	        uniformName + ".position",
		    directionLight.getPosition()
	    );

	    // this.attachUniformFData(
	    //     uniformName + ".intensity",
	    //     lightParameters.getIntensity()
	    // );
	}

	/**
	 * Прикрепление данных камеры в униформу
	 * @param uniformName название униформы
	 * @param camera объект камеры
	 */
	public attachCameraUniformData(uniformName: string, camera: Camera): void {
		this.attachUniformVector3FData(
			uniformName + ".position",
			camera.getPosition()
		);
	}

	/**
	 * Прикрепление данных точечного света в униформу
	 * @param uniformName название униформы
	 * @param pointLight объект точечного света
	 */
	public attachPointLightUniformData(uniformName: string, pointLight: PointLight): void {
	    // this.attachUniformVector4FData(
	    //     uniformName + ".ambient",
	    //     lightParameters.getAmbientColor()
	    // );
	    // this.attachUniformVector4FData(
	    //     uniformName + ".diffuse",
	    //     lightParameters.getDiffuseColor()
	    // );
	    // this.attachUniformVector4FData(
	    //     uniformName + ".specular",
	    //     lightParameters.getSpecularColor()
	    // );

	    this.attachUniformVector3FData(
	        uniformName + ".position",
		    pointLight.getPosition()
	    );
		this.attachUniformVector3FData(
			uniformName + ".color",
			pointLight.getColor()
		);
		this.attachUniformFData(
			uniformName + ".constant",
			pointLight.getAttenuation().getConstant()
		);
		this.attachUniformFData(
			uniformName + ".linear",
			pointLight.getAttenuation().getLinear()
		);
		this.attachUniformFData(
			uniformName + ".quadratic",
			pointLight.getAttenuation().getQuadratic()
		);

	    // this.attachUniformFData(
	    //     uniformName + ".intensity",
	    //     lightParameters.getIntensity()
	    // );
	    //
	    // const attenuation = lightParameters.getAttenuation();
	    // this.attachUniformFData(
	    //     uniformName + ".attenuation.constant",
	    //     attenuation.getConstant()
	    // );
	    // this.attachUniformFData(
	    //     uniformName + ".attenuation.linear",
	    //     attenuation.getLinear()
	    // );
	    // this.attachUniformFData(
	    //     uniformName + ".attenuation.exponent",
	    //     attenuation.getExponent()
	    // );
	}

	/**
	 * Прикрепление данных материала в униформу
	 * @param uniformName название униформы
	 * @param material материал
	 */
	public attachMaterialUniformData(uniformName: string, material: Material): void {
		this.attachUniformVector4FData(
			uniformName + ".diffuse",
			material.getDiffuseColor()
		);
		this.attachUniformVector4FData(
			uniformName + ".specular",
			material.getEmissionColor()
		);
		this.attachUniformFData(
			uniformName + ".shininess",
			material.getRefraction()
		);
	}

	/**
	 * Прикрепление данных к униформе
	 * @param uniformName название униформы
	 * @param data данные для прикрепления
	 */
	public attachUniformFData(uniformName: string, data: number): void {
		const location = this.webGL.getUniformLocation(
			this.program,
			uniformName
		);

		this.webGL.uniformF(
			location,
			data
		);
	}

	/**
	 * Прикрепление данных к униформе
	 * @param uniformName название униформы
	 * @param data данные для прикрепления
	 */
	public attachUniformIData(uniformName: string, data: number): void {
		const location = this.webGL.getUniformLocation(
			this.program,
			uniformName
		);

		this.webGL.uniformI(
			location,
			data
		);
	}

	/**
	 * Прикрепление данных к униформе
	 * @param uniformName название униформы
	 * @param data данные для прикрепления
	 */
	public attachUniformVector3FData(uniformName: string, data: Vector3): void {
		const location = this.webGL.getUniformLocation(
			this.program,
			uniformName
		);

		this.webGL.uniformVertex3Float(
			location,
			data.getX(),
			data.getY(),
			data.getZ()
		);
	}

	/**
	 * Прикрепление данных к униформе
	 * @param uniformName название униформы
	 * @param data данные для прикрепления
	 */
	public attachUniformVector4FData(uniformName: string, data: Vector4): void {
		const location = this.webGL.getUniformLocation(
			this.program,
			uniformName
		);

		this.webGL.uniformVertex4Float(
			location,
			data.getX(),
			data.getY(),
			data.getZ(),
			data.getW()
		);
	}

	/**
	 * Прикрепление данных формата Float32 в униформу для четырех размерной матрицы
	 * @param uniformName название униформы
	 * @param data данные для прикрепления
	 */
	public attachMatrix4UniformDataFloat32(uniformName: string, data: number[]): void {
		const location = this.webGL.getUniformLocation(
			this.program,
			uniformName
		);

		this.webGL.uniformMatrix4fvFloat32(
			location,
			false,
			data
		);
	}

	/**
	 * Прикрепление текстуры к униформе
	 */
	public attachTexture(uniformName: string): void {
		const location = this.webGL.getUniformLocation(
			this.program,
			uniformName
		);

		this.webGL.uniformI(
			location,
			0
		);
	}

	/**
	 * Сохранение новых графических объектов
	 * @param graphicsObjects массив новых графических объектов
	 */
	public setGraphicsObjects(graphicsObjects: GraphicsObject[]): void {
		this.graphicsObjects = graphicsObjects;
	}

	/**
	 * Сохранение нового пространственного света
	 * @param ambientLight новый пространственный свет
	 */
	public setAmbientLight(ambientLight: Vector3): void {
		this.ambientLight = ambientLight;
	}

	/**
	 * Сохранение новго источника точечного света
	 * @param pointLight новый источник точечного света
	 */
	public setPointLight(pointLight: PointLight): void {
		this.pointLight = pointLight;
	}

	/**
	 * Сохранение новго источника направленного света
	 * @param directionLight новый источник направленного света
	 */
	public setDirectionLight(directionLight: DirectionLight): void {
		this.directionLight = directionLight;
	}

	/**
	 * Получение идентификатора шейдерной программы
	 */
	public getId(): number {
		return this.id;
	}

	// /**
	//  * Прикрепление текстуры к текущему состоянию рендеринга
	//  */
	// public bindTexture() {
	//     this.webGL.activeTexture0();
	//     this.webGL.bindTexture2D(this.texture);
	// }

	// /**
	//  * Инициализация текстуры
	//  * @param texture изображение текстуры
	//  */
	// public initializationTexture(texture: HTMLImageElement | undefined) {
	//     if (texture) {
	//         this.webGL.bindTexture2D(this.texture);
	//
	//         this.webGL.textureImage2DRGBAUnsignedByte(
	//             0,
	//             texture
	//         );
	//
	//         this.webGL.generateMipmap2D();
	//         this.textureImage = texture;
	//     }
	// }

	// /**
	//  * Используется ли текстура
	//  */
	// private textureIsUsed(): boolean {
	//     return this.texture !== undefined;
	// }

	// /**
	//  * Получение изображения текстуры
	//  */
	// public getTexture(): HTMLImageElement | null {
	//     return this.textureImage;
	// }
}

export default ShaderProgram;