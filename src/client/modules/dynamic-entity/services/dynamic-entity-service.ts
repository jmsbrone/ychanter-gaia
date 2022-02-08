import { DynamicEntity } from "client/modules/dynamic-entity/domains/dynamic-entity";
import {
    CreateDynamicEntityDto,
    DeleteDynamicEntityDto,
    UpdateDynamicEntityDto,
} from "client/modules/dynamic-entity/dto/dynamic-entity";
import { EntityServicePrototype } from "client/prototypes/entity-service-prototype";

export class DynamicEntityService extends EntityServicePrototype<
    DynamicEntity,
    CreateDynamicEntityDto,
    UpdateDynamicEntityDto,
    DeleteDynamicEntityDto
> {
    constructor() {
        super(
            DynamicEntity,
            "dynamicEntity",
            "dynamicEntities",
            "createDynamicEntity",
            "updateDynamicEntity",
            "deleteDynamicEntity"
        );
    }

    protected getUsedEntityFields(): string[] {
        return [
            "id",
            "name",
            "title",
            `fields{
                type,
                name,
                title,
                form_title,
                system,
                required,
                multivalued,
                unique,
                default,
                validator_rules,
                length,
                link_to_entity,
                locked,
                update_error,
                value_on_update
            }`,
        ];
    }

    protected getEntityFieldGraphQLTypes(): {
        id?: string;
        created_at?: string;
        updated_at?: string;
        title?: string;
        name?: string;
        table?: string;
        fields?: string;
    } {
        return {
            id: "Int!",
            name: "String!",
            title: "String!",
            fields: "[EntityFieldTypeDto!]!",
        };
    }
}
