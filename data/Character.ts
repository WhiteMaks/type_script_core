/**
 * Create on 06.11.2022
 *
 * @author WhiteMaks
 */

/**
 * Класс для работы с символом
 */
class Character {
    /**
     * Код символа
     * @private
     */
    private readonly code: number;

    /**
     * Конструктор для создания нового символа
     * @param char предполагаемый символ
     */
    public constructor(char: string | number) {
        this.code = Character.parseToCode(char);
    }

    /**
     * Получение кода символа
     */
    public getCode(): number {
        return this.code;
    }

    /**
     * Получение символа
     */
    public getChar(): string {
        return String.fromCharCode(this.code);
    }

    /**
     * Преобразование предполагаемого символа в код символа
     * @param char предполагаемый символ
     * @private
     */
    private static parseToCode(char: string | number): number {
        if (typeof char === "string") {
            this.characterCheck(char);

            return char.charCodeAt(0);
        }

        return char;
    }

    /**
     * Проверка является ли полученная строка символом. Строка "a" является символом, а строка "as" символом не является
     * @param str строка для проверки
     * @private
     */
    private static characterCheck(str: string): void {
        if (str.length !== 1) {
            throw new Error("Данная строка [ " + str + " ] не является символом");
        }
    }
}

export default Character;