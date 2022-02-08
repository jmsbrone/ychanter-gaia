import { ErrorHelper } from "client/helpers/error-helper";
import _ from "client/helpers/lodash";
import { PlainObject } from "client/types/basic";
import { ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY } from "common/constants";

export class ErrorHandler {
    /**
     * Returns text for given module error
     * @param server_error
     * @param module_errors
     * @param data
     * @returns
     */
    public static getErrorText(module_errors: PlainObject, server_error: string, data: any = {}): string {
        const error_data = ErrorHelper.parseServerErrorCode(server_error);
        let error_message: string = module_errors[error_data.code];
        if (!error_message) {
            error_message = "Unknown error";
        } else {
            _.each(data, (value, key) => {
                if (typeof value !== "string") {
                    return;
                }
                error_message = error_message.replace(
                    `${ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY}${key}${ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY}`,
                    value
                );
            });
        }

        return error_message;
    }
}
