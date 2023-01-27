/**
 * Create on 28.08.2022
 *
 * @author WhiteMaks
 */
import KeyboardEventType from "../enums/KeyboardEventType";

/**
 * Класс для описания событий клавиатуры
 */
class KeyboardEvent {
    /**
     * Тип события
     * @private
     */
    private readonly type: KeyboardEventType;

    /**
     * Код кнопки
     * @private
     */
    private readonly code: string;

    /**
     * Конструктор для создания события клавиатуры
     * @param type тип события
     * @param code код кнопки
     */
    public constructor(type: KeyboardEventType, code: string) {
        this.type = type; //сохранение типа события
        this.code = code; //сохранение кода кнопки
    }

    public isPress(): boolean {
        return this.type === KeyboardEventType.PRESS;
    }

    public isRelease(): boolean {
        return this.type === KeyboardEventType.RELEASE;
    }

    public isValid(): boolean {
        return this.type !== KeyboardEventType.INVALID;
    }

    public getCode(): string {
        return this.code;
    }

}

export default KeyboardEvent;