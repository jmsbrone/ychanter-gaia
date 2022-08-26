import { User } from "../domains/user";
import { CRUDResourceSchema, CRUDResourceSchemaPrototype } from "@ychanter/graphql-client";
import { EntityServicePrototype, EntityDeleteDto } from "../../prototypes/entity-service-prototype";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

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
            },
        });
    }
    protected static readonly USER_FIELDS = "id,login";

    constructor() {
        super(User);
    }

    protected getUsedEntityFieldsOne(): string[] {
        return ["id"];
    }

    protected getUsedEntityFieldsMany(): string[] {
        return ["id"];
    }

    protected getEntityFieldGraphQLTypes(): { [key in keyof Partial<User>]: string } {
        return {
            id: "Int!",
        };
    }
}
