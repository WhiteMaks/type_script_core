/**
 * Create on 11.09.2022
 *
 * @author WhiteMaks
 */

import WebGL                from "./WebGL";
import Mouse                from "../controls/Mouse";
import Keyboard             from "../controls/Keyboard";
import GraphicsElement      from "./GraphicsElement";

/**
 * Интерфейс для работы с графической логикой
 */
interface GraphicsLogic {

    /**
     * Инициализация графической логики
     */
    init(webGL: WebGL): void;

    /**
     * Обработка логики связанной с пользовательской логикой
     * @param keyboard
     * @param mouse
     */
    input(keyboard: Keyboard, mouse: Mouse): void;

    /**
     * Обработка логики обновления кадра
     * @param timestamp времени с момента старта цикла
     */
    update(timestamp: number): void;

    /**
     * Обработка логики отрисовки кадра
     * @param graphicsElement графический элемент
     */
    render(graphicsElement: GraphicsElement): void;
}

export default GraphicsLogic;