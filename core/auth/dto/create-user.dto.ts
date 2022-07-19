export class CreateUserDto {
    login: string;
    password: string;
    isSystemAdmin?: boolean;
    isAdmin?: boolean;
    isOperator?: boolean;
}
