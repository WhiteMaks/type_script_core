/**
 * Create on 31/10/2022
 *
 * @author WhiteMaks
 */

interface RequestApi {

    sendGet(url: string, headers: Map<string, string>): Promise<Response>;

    sendPostJson(url: string, body: object, headers: Map<string, string>): Promise<Response>;

    sendPostFile(url: string, file: File, headers: Map<string, string>): Promise<Response>;

}

export default RequestApi;