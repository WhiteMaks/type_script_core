/**
 * Create on 01/11/2022
 *
 * @author WhiteMaks
 */
import RequestApi from "../wrappers/RequestApi";
import ExtFetch from "../wrappers/impl/ExtFetch";
import Common from "./Common";

abstract class RestApi {
    private readonly api: RequestApi;

    protected constructor() {
        this.api = new ExtFetch();
    }

    protected sendRequestGet(url: string, headers?: Map<string, string>): Promise<Response> {
        return this.api.sendGet(url, headers === undefined ? Common.generateHeadersContentTypeJson() : headers);
    }

    protected sendRequestPostJson(url: string, body: object, headers?: Map<string, string>): Promise<Response> {
        return this.api.sendPostJson(url, body, headers === undefined ? Common.generateHeadersContentTypeJson() : headers);
    }

    protected sendRequestPostFile(url: string, file: File, headers?: Map<string, string>): Promise<Response> {
        return this.api.sendPostFile(url, file, headers === undefined ? Common.generateHeadersContentTypeMultipartFormData() : headers);
    }

    protected responseToJson(response: Response): Promise<any> {
        if (response.status >= 500) {
            return new Promise<any>(resolve => resolve({error: "Server error"}));
        }
        return response.json();
    }
}



export default RestApi;