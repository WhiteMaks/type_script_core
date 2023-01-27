/**
 * Create on 26/12/2022
 *
 * @author WhiteMaks
 */

interface GraphQLResponse<DATA> {
    data: DATA;
    errors: any;
}

export default GraphQLResponse;