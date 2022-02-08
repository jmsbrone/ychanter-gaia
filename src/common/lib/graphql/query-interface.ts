/**
 * @summary
 *
 * General interface for working with GraphQL queries
 */

import { PlainObject } from "client/types/basic";

export interface GraphQLQuery {
    getQuery(): string;
    with(data: PlainObject): GraphQLQuery;
    vars(variables: { [key: string]: { type: string; value: any } }): GraphQLQuery;
    take(...fields: string[]): GraphQLQuery;
    getVariables(): PlainObject;
    getResponseKey(): string;
}
