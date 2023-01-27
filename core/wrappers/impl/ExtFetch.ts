/**
 * Create on 31/10/2022
 *
 * @author WhiteMaks
 */
import RequestApi from "../RequestApi";
import Common from "../../support/Common";

class ExtFetch implements RequestApi {

    public sendGet(url: string, headers: Map<string, string>): Promise<Response> {
        return this.sendRequest(url, "GET", headers, undefined);
    }

    public sendPostJson(url: string, body: object, headers: Map<string, string>): Promise<Response> {
        return this.sendRequest(url, "POST", headers, body);
    }

    public sendPostFile(url: string, file: File, headers: Map<string, string>): Promise<Response> {
        const formData = new FormData();
        formData.append("file", file);
        return this.sendRequestFile(url, "POST", headers, formData);
    }

    private sendRequest(url: string, method: string, headers: Map<string, string>, body?: object): Promise<Response> {
        return fetch(
            url,
            {
                method: method,
                headers: Common.convertMapToRecord(headers),
                body: body === undefined ? undefined : JSON.stringify(body)
            }
        );
    }

    private sendRequestFile(url: string, method: string, headers: Map<string, string>, body?: FormData): Promise<Response> {
        return fetch(
            url,
            {
                method: method,
                headers: Common.convertMapToRecord(headers),
                body: body === undefined ? undefined : body
            }
        );
    }

}

export default ExtFetch;