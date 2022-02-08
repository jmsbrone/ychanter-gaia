/**
 * @module Modules.Auth.Domains
 */
import { UserPermissions } from "client/modules/auth/types/user-permissions-subject";
import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";

export class User {
    id: number;
    [LOGIN_FIELD]: string;
    [PASSWORD_FIELD]: string;
    isSystemAdmin: boolean;
    isAdmin: boolean;
    isOperator: boolean;
    permissions_rules: string;
    permissions: UserPermissions;
}
