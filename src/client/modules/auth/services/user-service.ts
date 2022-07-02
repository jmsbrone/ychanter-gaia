import { CreateUserDto } from "common/dto/user/create-user.dto";
import { UpdateUserDto } from "common/dto/user/update-user.dto";
import { User } from "../domains/user";
import { EntityDeleteDto, EntityServicePrototype } from "client/prototypes/entity-service-prototype";
import { CRUDResourceSchema, CRUDResourceSchemaPrototype } from "@ychanter/graphql-client";

/**
 * Graphql service for User domain
 */
export class UserService extends EntityServicePrototype<User, CreateUserDto, UpdateUserDto, EntityDeleteDto<User>> {
    protected createSchema(): CRUDResourceSchema {
        return new CRUDResourceSchemaPrototype({
            listResourceQuery: "users",
            singleResourceQuery: "user",
            saveResourceQuery: "saveUser",
            deleteResourceQuery: "deleteUser",
            queries: {
                user: [],
                users: [],
                createUser: [],
                saveUser: [],
                deleteUser: [],
            },
            fieldsTypes: {
                id: "Int",
                isSystemAdmin: "Boolean",
                isAdmin: "Boolean",
                isOperator: "Boolean",
            },
        });
    }
    protected static readonly USER_FIELDS = "id,login,isSystemAdmin,isAdmin,isOperator";

    constructor() {
        super(User);
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
