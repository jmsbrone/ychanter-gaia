import { GraphQLQuery } from "@ychanter/graphql-client";
import { RequestExecutionResultType } from "../../types/requests";
import { GraphQLQueryExecutionResult, GraphQLQueryRunner } from "./types";

/**
 * Mock class for all GraphQL requests.
 * Generally should not be ever called as all modules should provide
 * their own mocks.
 */
export class GraphQLAxiosRequestMock implements GraphQLQueryRunner {
    setEndpoint(url: string): void {
        // do nothing as it's a mock
    }

    async executeQuery(query: GraphQLQuery): Promise<GraphQLQueryExecutionResult> {
        return new GraphQLQueryExecutionResult(null, [], RequestExecutionResultType.SUCCESS);
    }
}
