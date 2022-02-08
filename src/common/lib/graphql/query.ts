/**
 * @summary
 *
 * GraphQL query builder class.
 */

import _ from "client/helpers/lodash";
import { QueryPrototype } from "./query-prototype";

export class Query extends QueryPrototype {
    public getQuery(): string {
        return `query ${this.name}${this.getVariablesString()} {
            ${this._query_name}${this.getArgumentsString()}
                ${_.isEmpty(this._result_fields) ? "" : "{" + _.join(this._result_fields, ",") + "}"}
        }`;
    }
}
