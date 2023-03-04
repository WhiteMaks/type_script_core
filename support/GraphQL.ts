/**
 * Create on 26/12/2022
 *
 * @author WhiteMaks
 */
import RestApi              from "./RestApi";
import GraphQLRequest       from "./GraphQLRequest";
import GraphQLResponse      from "./GraphQLResponse";

class GraphQL extends RestApi {
    private readonly url: string;

    public constructor(url: string) {
        super();

        this.url = url;
    }

    public async query<T extends GraphQLResponse<any>>(request: GraphQLRequest): Promise<T> {
        const body: GraphQLRequest = {
            query: request.query
        };

        return super.responseToJson(
            await super.sendRequestPostJson(
                this.url,
                body
            )
        )
    }
}

export default GraphQL;