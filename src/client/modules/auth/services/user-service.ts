/**
 * @module Modules.Auth.Services
 */

import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";
import { CreateUserDto } from "common/dto/user/create-user.dto";
import { UpdateUserDto } from "common/dto/user/update-user.dto";
import { User } from "../domains/user";
import { EntityDeleteDto, EntityServicePrototype } from "client/prototypes/entity-service-prototype";

/**
 * Graphql service for User domain
 */
export class UserService extends EntityServicePrototype<User, CreateUserDto, UpdateUserDto, EntityDeleteDto<User>> {
    protected static readonly USER_FIELDS = "id,login,isSystemAdmin,isAdmin,isOperator";

    constructor() {
        super(User, "user", "users", "createUser", "updateUser", "deleteUser");
    }

    protected getUsedEntityFields(): string[] {
        return ["id", "isSystemAdmin", "isAdmin", "isOperator"];
    }

    protected getEntityFieldGraphQLTypes(): { [key in keyof Partial<User>]: string } {
        return {
            id: "Int!",
            isSystemAdmin: "Boolean",
            isAdmin: "Boolean",
            isOperator: "Boolean",
        };
    }
}
