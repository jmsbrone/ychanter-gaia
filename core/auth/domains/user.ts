import { UserPermissions } from "../types/user-permissions-subject";

export class User {
    id: number;
    login: string;
    password: string;
    isSystemAdmin: boolean;
    isAdmin: boolean;
    isOperator: boolean;
    permissions_rules: string;
    permissions: UserPermissions;
}
