/* eslint-disable no-console */
import _ from "client/helpers/lodash";
import { GRAPHQL_PATH, JWT_REFRESH_TOKEN_HEADER } from "common/constants";
import { GraphQLQuery } from "common/lib/graphql/query-interface";
import { GraphQLQueryExecutionResult, GraphQLQueryRunner } from "client/core/components/graphql/types";
import { GraphQLResultMaker } from "client/core/components/graphql/result-maker";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { AxiosRequestBase } from "client/core/axios-request-base";

/**
 * Class for performing graphql requests over axios.
 */
export class GraphQLAxiosRequest extends AxiosRequestBase implements GraphQLQueryRunner {
    /**
     * @inheritdoc
     */
    protected prepareUrl(): string {
        return "/" + GRAPHQL_PATH;
    }

    /**
     * @inheritdoc
     */
    public async executeQuery(query: GraphQLQuery): Promise<GraphQLQueryExecutionResult> {
        const result_maker = new GraphQLResultMaker();
        let result: GraphQLQueryExecutionResult = null;
        await this.$axios
            .post(
                this.prepareUrl(),
                {
                    query: query.getQuery(),
                    variables: query.getVariables(),
                },
                this.prepareConfig()
            )
            .then(
                (response) => {
                    if (response.headers[JWT_REFRESH_TOKEN_HEADER]) {
                        ClientStorage.getInstance().setJWTAuthorizationToken(
                            response.headers[JWT_REFRESH_TOKEN_HEADER]
                        );
                    }
                    if (!response.data.data && response.data.errors) {
                        const errors = response.data.errors;
                        const error_msgs = [];
                        _.each(errors, (error) => {
                            error_msgs.push(error.message);
                        });
                        result = result_maker.makeClientErrorResult(error_msgs);
                    } else {
                        result = result_maker.makeSuccessResult(response.data.data[query.getResponseKey()]);
                    }
                },
                (axios_response) => {
                    try {
                        const errors = axios_response.response.data.errors;
                        const error_msgs = [];
                        _.each(errors, (error) => {
                            error_msgs.push(error.message);
                        });
                        result = result_maker.makeClientErrorResult(error_msgs);
                    } catch (error) {
                        console.error(axios_response);
                        result = result_maker.makeClientErrorResult(["Unknown error"]);
                    }
                }
            );

        return result;
    }
}
