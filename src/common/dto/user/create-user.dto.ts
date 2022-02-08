import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";

export class CreateUserDto {
    [LOGIN_FIELD]: string;
    [PASSWORD_FIELD]: string;
    isSystemAdmin?: boolean;
    isAdmin?: boolean;
    isOperator?: boolean;
}
