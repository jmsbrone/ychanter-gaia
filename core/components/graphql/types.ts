import { GraphQLQuery } from "@ychanter/graphql-client";
import { RequestExecutionResult } from "../../types/requests";

/**
 * Extending class to localize dependencies and improve readability.
 */
export class GraphQLQueryExecutionResult extends RequestExecutionResult {}

/**
 * Interface for classes handling graphql requests.
 * This is required for graphql services.
 */
export interface GraphQLQueryRunner {
    /**
     * Executes given query and returns result object for it
     * @param query
     */
    executeQuery(query: GraphQLQuery): Promise<GraphQLQueryExecutionResult>;

    /**
     * Sets graphql endpoint.
     */
    setEndpoint(url: string): void;
}
