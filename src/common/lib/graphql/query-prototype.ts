/**
 * @summary
 *
 * GraphQL query prototype class with base functionality.
 */

import _ from "client/helpers/lodash";
import { PlainObject } from "client/types/basic";
import { GraphQLQuery } from "./query-interface";

export abstract class QueryPrototype implements GraphQLQuery {
    constructor(protected _query_name: string, protected name: string = null) {
        if (this.name === null) {
            this.name = _query_name;
        }
    }
    protected _args: PlainObject = {};
    protected _result_fields: string[] = [];
    protected _variables: { [key: string]: { type: string; value: any } } = {};

    /**
     * Arguments
     * @param data
     * @returns
     */
    public with(data: PlainObject): GraphQLQuery {
        this._args = data;
        return this;
    }

    /**
     * Sets variables to use with the query
     * @param variables
     * @returns
     */
    public vars(variables: { [key: string]: { type: string; value: any } }): GraphQLQuery {
        this._variables = variables;
        return this;
    }

    /**
     * Selected fields from result
     * @param fields
     * @returns
     */
    public take(...fields: string[]): GraphQLQuery {
        const exploded_fields = [];
        _.each(fields, (field) => exploded_fields.push(field.replace(/,\s+/g, ",").split(",")));
        this._result_fields.push(...exploded_fields);
        return this;
    }

    /**
     * Returns defined query as a graphql query string
     * @returns
     */
    public abstract getQuery(): string;

    /**
     * Returns variables for the query
     * @returns
     */
    public getVariables(): PlainObject {
        const vars = {};
        _.each(this._variables, ({ type, value }, name) => {
            vars[name] = value;
        });
        return vars;
    }

    /**
     * Returns variables to insert into query definition
     * @returns
     */
    protected getVariablesString(): string {
        let result = "";
        if (!_.isEmpty(this._variables)) {
            const string_args: string[] = [];
            _.each(this._variables, (item, name) => {
                string_args.push(`$${name}: ${item.type}`);
            });
            result = `(${_.join(string_args, ",")})`;
        }
        return result;
    }

    /**
     * Returns arguments to specify in the query as a string in parentheses
     * @returns
     */
    protected getArgumentsString(): string {
        let result = "";
        if (!_.isEmpty(this._args)) {
            const string_args: string[] = [];
            _.each(this._args, (value, name) => {
                if (typeof value === "string" && value.match(/\$\w+/)) {
                    string_args.push(`${name}: ${value}`);
                } else {
                    string_args.push(`${name}: ${JSON.stringify(value)}`);
                }
            });
            result = `(${_.join(string_args, ",")})`;
        }
        return result;
    }

    /**
     * Returns query name (it'll be the key in response data)
     * @returns
     */
    public getResponseKey(): string {
        return this._query_name;
    }
}
