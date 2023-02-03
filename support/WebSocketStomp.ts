/**
 * Create on 11/01/2023
 *
 * @author WhiteMaks
 */
import SockJS from "sockjs-client";
import {
    Client,
    Frame,
    Message,
    over
} from "stompjs";
import Common from "./Common";

class WebSocketStomp {
    /**
     * Объект для работы с веб сокет клиентом
     * @private
     */
    private readonly client: Client;
    /**
     * Буффер для сбора подписок когда канал сокета еще не готов к отправке сообщений
     * @private
     */
    private readonly subscribesBuffer: Map<string, (message: Message) => void>;
    /**
     * Буффер для сбора отписок когда канал сокета еще не готов к отправке сообщений
     * @private
     */
    private readonly unsubscribesBuffer: Set<string>;
    /**
     * Список всех активных подписок (ключ = эндпоинт, значение = id подписки)
     * @private
     */
    private readonly subscribes: Map<string, string>;

    /**
     * Переключатель состояния канала сокета
     * @private
     */
    private isOnline: boolean;

    public constructor(host: string, port: number, ssl: boolean) {
        this.isOnline = false;

        this.subscribesBuffer = new Map<string, (message: Message) => void>();
        this.unsubscribesBuffer = new Set<string>();

        this.subscribes = new Map<string, string>();

        const url = this.generateUrl(
            host,
            port,
            ssl
        );

        this.client = over(
            new SockJS(url)
        );

        this.init();
    }

    private init(): void {
        this.client.debug = () => {}; //отключение дебаг режима, для того чтобы в консоли не сыпались сообщения

        //после установки связи с сокетом, нужно пройтись по буферам и отчисть их
        this.onConnect(frame => {
            this.isOnline = true;

            this.subscribesBuffer.forEach((value, key) => {
                this.subscribe(key, value);
            });

            this.unsubscribesBuffer.forEach(value => {
                this.unsubscribe(value);
            });

            this.subscribesBuffer.clear();
            this.unsubscribesBuffer.clear();
        });
    }

    /**
     * Ивент на подключение к сокету
     * @param callback функция обратного вызова
     * @private
     */
    private onConnect(callback: (frame: Frame | undefined) => void): void {
        this.client.connect(
            this.getHeaders(),
            callback
        );
    }

    /**
     * Отправить запрос на подписку метода
     * @param method метод для подписи
     * @param callback функция обратного вызова
     */
    public subscribe(method: string, callback: (message: Message) => void): void {
        if (!method.startsWith("/topic")) {
            method = "/topic" + method;
        }

        //если связь с сокетом не установлена, то нужно заполнить буффер
        if (!this.isOnline) {
            this.subscribesBuffer.set(method, callback);

            return;
        }

        const subscribeId = this.client.subscribe(
            method,
            callback
        ).id;

        this.subscribes.set(
            method,
            subscribeId
        );
    }

    /**
     * Отправить запрос на отписку метода
     * @param method метод для отписки
     */
    public unsubscribe(method: string): void {
        if (!method.startsWith("/topic")) {
            method = "/topic" + method;
        }

        //если связь с сокетом не установлена, то нужно заполнить буффер
        if (!this.isOnline) {
            this.unsubscribesBuffer.add(method);

            return;
        }

        const subscribeId = this.subscribes.get(method);
        if (subscribeId) {
            this.client.unsubscribe(subscribeId);

            this.subscribes.delete(method);
        }
    }

    private getHeaders() {
        return {
            Authorization: Common.getBearerToken()
        };
    }

    private generateUrl(host: string, port: number, ssl: boolean): string {
        let protocol: string;

        if (ssl) {
            protocol = "https";
        } else {
            protocol = "http"
        }

        return protocol.concat("://")
            .concat(host)
            .concat(":")
            .concat(String(port))
            .concat("/web_socket");
    }
}

export default WebSocketStomp;