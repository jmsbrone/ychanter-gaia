/**
 * @summary
 *
 * DTO for user login information
 */

import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";

export class UserLoginDto {
    [LOGIN_FIELD]: string;
    [PASSWORD_FIELD]: string;
}
