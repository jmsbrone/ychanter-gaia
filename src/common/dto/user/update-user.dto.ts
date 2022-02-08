import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";

export type UpdateUserDto = {
    id: number;
    [LOGIN_FIELD]?: string;
    [PASSWORD_FIELD]?: string;
    isSystemAdmin?: boolean;
    isAdmin?: boolean;
    isOperator?: boolean;
};
