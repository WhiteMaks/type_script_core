/**
 * Create on 31/10/2022
 *
 * @author WhiteMaks
 */
import Vector3 from "../math/Vector3";

abstract class Common {
    private static readonly AUTHORIZATION_TOKEN = "authorization_token";

    public static generateHeadersContentTypeJson(): Map<string, string> {
        const headers = new Map<string, string>();
        headers.set("Content-Type", "application/json;charset=UTF-8");
        headers.set("Authorization", this.getBearerToken());
        headers.set("Accept", "application/json");
        return headers;
    }

    public static generateHeadersContentTypeMultipartFormData(): Map<string, string> {
        const headers = new Map<string, string>();
        headers.set("Authorization", this.getBearerToken());
        headers.set("Accept", "application/json");
        return headers;
    }

    public static getBearerToken(): string {
        return "Bearer " + this.getTokenInLocalStorage();
    }

    public static setTokenInLocalStorage(token: string): void {
        this.addNewRecordInLocalStorage(this.AUTHORIZATION_TOKEN, token);
    }

    public static addNewRecordInLocalStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    public static getTokenInLocalStorage(): string {
        return this.getRecordInLocalStorage(this.AUTHORIZATION_TOKEN);
    }

    public static getRecordInLocalStorage(key: string): string {
        let value = localStorage.getItem(key);
        return value == null ? "" : value;
    }

    public static convertMapToRecord(map?: Map<string, string>): Record<string, string> {
        let result: Record<string, string> = {}

        if (map == null) {
            return result;
        }

        for (let [key, value] of map) {
            result[key] = value;
        }

        return result;
    }

    public static getIdFromUrl(): number {
        const url = window.location.pathname;

        return Number.parseInt(
            url.substring(
                url.lastIndexOf('/') + 1
            )
        );
    }

    public static getRGBFromHex(hex: string): Vector3 {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            return new Vector3(
                0,
                0,
                0
            );
        }

        const red = this.normalizeColor(
            this.parseInt16(
                result[1]
            )
        );

        const green = this.normalizeColor(
            this.parseInt16(
                result[2]
            )
        );

        const blue = this.normalizeColor(
            this.parseInt16(
                result[3]
            )
        );

        return new Vector3(
            red,
            green,
            blue
        );
    }

    public static getHexFromRgb(rgb: Vector3): string {
        return "#" +
            this.colorToHex(rgb.getX()) +
            this.colorToHex(rgb.getY()) +
            this.colorToHex(rgb.getZ());
    }

    private static colorToHex(color: number): string {
        const hex = (color * 255).toString(16);

        return hex.length === 1 ? "0" + hex : hex;
    }

    private static normalizeColor(value: number): number {
        return value / 255;
    }

    private static parseInt16(str: string): number {
        return Number.parseInt(
            str,
            16
        )
    }
}

export default Common;