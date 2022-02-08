import { GraphQLQueryExecutionResult } from "client/core/components/graphql/types";
import { RequestExecutionResultType } from "client/types/requests";

/**
 * Factory for creating result objects
 */
export class GraphQLResultMaker {
    /**
     * Returns graphql result object with given data
     * @param data
     * @returns
     */
    public makeSuccessResult(data: any): GraphQLQueryExecutionResult {
        return new GraphQLQueryExecutionResult(data);
    }

    /**
     * Returns graphql result object with execution errors that were caused by client.
     * @param errors
     * @returns
     */
    public makeClientErrorResult(errors: any[]): GraphQLQueryExecutionResult {
        return new GraphQLQueryExecutionResult(null, errors, RequestExecutionResultType.CLIENT_ERROR);
    }

    /**
     * Returns graphql result object with execution errors that happened server-side.
     * @param errors
     * @returns
     */
    public makeServerErrorResult(errors: any[]): GraphQLQueryExecutionResult {
        return new GraphQLQueryExecutionResult(null, errors, RequestExecutionResultType.SERVER_ERROR);
    }
}
