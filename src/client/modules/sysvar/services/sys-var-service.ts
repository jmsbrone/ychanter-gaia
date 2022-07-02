import { ClientStorage } from "client/core/components/storage/client-storage";
import { GenericResourceSchema, ResourceSchema } from "@ychanter/graphql-client";
import { Query } from "@ychanter/graphql-client";
import { FieldType } from "common/core/types/field-type-enum";
import { SysVar } from "../domains/sys-var";

export class SysVarService {
    private readonly DEFAULT_TYPE = FieldType.string;
    private readonly DEFAULT_VALUE = "";

    protected readonly schema: ResourceSchema = new GenericResourceSchema({
        queries: {
            sysvar: ["name"],
            sysvars: [],
            setSysVar: ["name", "type", "value"],
            deleteSysVar: ["name"],
        },
        fieldsTypes: {
            name: "String",
            type: "Int",
            value: "String",
        },
    });

    public constructor(protected readonly graphql_service = ClientStorage.getInstance().getGraphQLService()) {}

    /**
     * Retrieves entity by name
     * @param name
     * @returns
     */
    public async get(name: string): Promise<SysVar> {
        const entity = await this.graphql_service.get(this.schema.getQuery("sysvar", { name }, ["name,value,type"]));
        if (!entity) {
            return {
                name,
                value: this.DEFAULT_VALUE,
                type: this.DEFAULT_TYPE,
            };
        }

        return entity.value;
    }

    /**
     * Sets new value by name.
     * Type is optional but is required for the request due to the fact that entity might not exist
     * and needs to be created with proper type.
     * @param name
     * @param value
     * @param type
     * @returns
     */
    public async set(name: string, value: any, type: FieldType = this.DEFAULT_TYPE): Promise<SysVar> {
        return await this.graphql_service.get(
            this.schema.getMutation("setSysVar", { name, type, value: value.toString() }, ["name,value"])
        );
    }

    /**
     * Retrieves all sysvars
     * @returns
     */
    public async getAll(): Promise<SysVar[]> {
        return await this.graphql_service.get(this.schema.getQuery("sysvars", {}, ["name,value,type"]));
    }
}
