export type UpdateUserDto = {
    id: number;
    login?: string;
    password?: string;
    isSystemAdmin?: boolean;
    isAdmin?: boolean;
    isOperator?: boolean;
};
