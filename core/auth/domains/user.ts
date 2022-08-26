import { UserPermissions } from "../types/user-permissions-subject";

export class User {
    id: number;
    login: string;
    password: string;
    permissions_rules: string;
    permissions: UserPermissions;
}
