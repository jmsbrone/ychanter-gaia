/**
 * @summary
 *
 * GraphQL mutation builder class.
 */

import _ from "client/helpers/lodash";
import { QueryPrototype } from "./query-prototype";

export class Mutation extends QueryPrototype {
    public getQuery(): string {
        return `mutation ${this.name}${this.getVariablesString()} {
            ${this._query_name}${this.getArgumentsString()}
                ${_.isEmpty(this._result_fields) ? "" : "{" + _.join(this._result_fields, ",") + "}"}
        }`;
    }
}
