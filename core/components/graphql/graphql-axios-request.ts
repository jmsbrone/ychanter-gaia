/* eslint-disable no-console */

import { GraphQLQuery } from "@ychanter/graphql-client";
import { Axios } from "axios";
import { AxiosRequestBase } from "../../prototypes/axios-request-base";
import _ from "lodash";
import { GraphQLResultMaker } from "./result-maker";
import { GraphQLQueryRunner, GraphQLQueryExecutionResult } from "./types";

/**
 * Class for performing graphql requests over axios.
 */
export class GraphQLAxiosRequest extends AxiosRequestBase implements GraphQLQueryRunner {
    protected graphqlEndpoint: string;

    constructor(axios: Axios) {
        super(axios);
    }

    /** @inheritdoc */
    setEndpoint(url: string): void {
        this.graphqlEndpoint = url;
    }

    /** @inheritdoc */
    protected prepareUrl(): string {
        return this.graphqlEndpoint;
    }

    /** @inheritdoc */
    public async executeQuery(query: GraphQLQuery): Promise<GraphQLQueryExecutionResult> {
        const result_maker = new GraphQLResultMaker();
        let result: GraphQLQueryExecutionResult = null;
        await this.$axios
            .post(
                this.prepareUrl(),
                {
                    query: query.build(),
                    variables: query.getVariables(),
                },
                this.prepareConfig()
            )
            .then(
                (response) => {
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
