/**
 * @module Helpers
 */

import { MODULE_ID } from "common/constants";

export class ErrorHelper {
    /**
     * Returns information from server error code
     * @param error_code
     * @returns
     */
    public static parseServerErrorCode(error_code: string): { module_id: MODULE_ID; code: number } {
        const error_int: number = parseInt(error_code);
        return {
            module_id: error_int >> 16,
            code: error_int & 0xff,
        };
    }
}
