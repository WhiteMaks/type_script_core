/**
 * Create on 06/11/2022
 *
 * @author WhiteMaks
 */
import Character from "../data/Character";

class StringSupport {
    private readonly value: string;

    public constructor(value: string) {
        this.value = value;
    }

    public toSnakeCase(): string {
        let result = `${this.value}`;

        if (result.includes(" ")) {
            result = result.replaceAll(" ", "_");
        }

        return result.toLowerCase();
    }

    /**
     * Получение массива символов из строки
     */
    public toCharArray(): Character[] {
        const result: Character[] = [];

        for (let i = 0; i < this.value.length; i++) {
            result.push(new Character(this.value[i]));
        }

        return result;
    }

    /**
     * Форматирование строки*
     * @param baseStr строка для форматирования
     * @param args аргументы для вставки
     *
     * @example StringSupport.format("Hello my name is %s. And I like %s", "Maksim", "swim") -> "Hello my name is Maksim. And I like swim";
     */
    public static format(baseStr: string, ...args: string[]): string {
        let result = baseStr;

        for (const arg of args) {
            result = result.replace(
                "%s",
                arg
            );
        }

        return result;
    }
}

export default StringSupport;