import { GraphQLQuery } from "@ychanter/graphql-client";
import { GraphQLClientException, GraphQLServerException } from "./exceptions";
import { GraphQLQueryRunner } from "./types";


/**
 * Service for executing GraphQL queries
 */
export class GraphQLService {
    public constructor(protected readonly query_runner: GraphQLQueryRunner) {}

    /**
     * Executes graphql query and returns requested data
     * @param query
     * @returns
     */
    public async get(query: GraphQLQuery): Promise<any> {
        const result = await this.query_runner.executeQuery(query);
        if (!result.isSuccess()) {
            const error_string: string = result.getErrors().join("\n");
            if (result.isClientError()) {
                throw new GraphQLClientException(error_string);
            } else {
                throw new GraphQLServerException(error_string);
            }
        }

        return result.getData();
    }
}
