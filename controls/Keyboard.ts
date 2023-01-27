/**
 * Create on 27.08.2022
 *
 * @author WhiteMaks
 */

import Key                  from "./enums/Key";
import Queue                from "../data/structures/Queue";
import SimpleQueue          from "../data/structures/impl/SimpleQueue";
import KeyboardEvent        from "./events/KeyboardEvent";
import KeyboardEventType    from "./enums/KeyboardEventType";

/**
 * Класс для работы с событиями клавиатуры
 */
class Keyboard {
    /**
     * Размер буфера хранения событий клавиатуры
     * @private
     */
    private static readonly bufferSize: number = 16;

    /**
     * Буфер для хранения событий клавиатуры
     * @private
     */
    private readonly keyBuffer: Queue<KeyboardEvent>;
    /**
     * Буфер для хранения введенных символов с клавиатуры
     * @private
     */
    private readonly charBuffer: Queue<string>;

    /**
     * Статус для всех кнопок. Ключ - это название кнопки, значение - это статус нажатия, где true - кнопка нажата, false - не нажата
     * @private
     */
    private readonly keyStates: Map<string, boolean>;

    /**
     * Конструктор для создания объекта клавиатуры
     */
    public constructor() {
        //инициализация буфера хранения событий клавиатуры
        this.keyBuffer = new SimpleQueue();
        //инициализация буфера хранения введенных символов
        this.charBuffer = new SimpleQueue();

        //инициализация статуса кнопок
        this.keyStates = new Map<string, boolean>();
    }

    /**
     * Проверка нажата ли данная кнопка на клавиатуре
     * @param key кнопка для проверки
     */
    public keyIsPressed(key: Key): boolean {
        let result = this.keyStates.get(key);
        //если в Map не храниться записи по данному ключу, то сохраняем новую запись с параметром false и возвращаем false
        if (!result) {
            this.keyStates.set(key, false);
            return false;
        }
        return result;
    }

    /**
     * Получение из буфера событие от клавиатуры
     */
    public readKey(): KeyboardEvent {
        //если в буфере есть записи, то возвращается первая из очереди
        if (this.keyBuffer.size() > 0) {
            return this.keyBuffer.poll();
        }
        return new KeyboardEvent(KeyboardEventType.INVALID, ""); //инициализация пустого события
    }

    /**
     * Проверка есть ли записи в буфере событий клавиатуры
     */
    public keyIsEmpty(): boolean {
        return this.keyBuffer.size() === 0;
    }

    /**
     * Получение из буфера введенный символ
     */
    public readChar(): string {
        //если в буфере есть записи, то возвращается первый их очереди
        if (this.charBuffer.size() > 0) {
            return this.charBuffer.poll();
        }
        return ""; //инициализация пустого символа
    }

    /**
     * Проверка есть ли записи в буфере введенных символов
     */
    public charIsEmpty(): boolean {
        return this.charBuffer.size() === 0;
    }

    /**
     * Отчистка буфера событий клавиатуры
     */
    public flushKey(): void {
        this.keyBuffer.flush();
    }

    /**
     * Отчистка буфера введенных символов
     */
    public flushChar(): void {
        this.charBuffer.flush();
    }

    /**
     * Отчистка буферов
     */
    public flush(): void {
        this.flushKey();
        this.flushChar();
    }

    /**
     * Сохранение события нажатия по кнопке на клавиатуре
     * @param keycode название кнопки
     */
    public onKeyPressed(keycode: string): void {
        this.keyStates.set(keycode, true);
        this.keyBuffer.push(new KeyboardEvent(KeyboardEventType.PRESS, keycode));

        this.trimBuffer(this.keyBuffer);
    }

    /**
     * Сохранение события отжатия по кнопке на клавиатуре
     * @param keycode название кнопки
     */
    public onKeyReleased(keycode: string): void {
        this.keyStates.set(keycode, false);
        this.keyBuffer.push(new KeyboardEvent(KeyboardEventType.RELEASE, keycode));

        this.trimBuffer(this.keyBuffer);
    }

    /**
     * Сохранение события ввода символа
     * @param char введенный символ
     */
    public onChar(char: string): void {
        this.charBuffer.push(char);

        this.trimBuffer(this.charBuffer);
    }

    /**
     * Удаление устаревших записей в выбранном буфере
     * @param buffer выбранный буфер
     * @private
     */
    private trimBuffer(buffer: Queue<any>): void {
        //пока в буфере больше записей, чем в значении bufferSize, берем первый из очереди
        while (buffer.size() > Keyboard.bufferSize) {
            buffer.poll();
        }
    }
}

export default Keyboard;