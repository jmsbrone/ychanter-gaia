/**
 * @summary
 *
 * GraphQL service for sysvar
 */

import { ClientStorage } from "client/core/components/storage/client-storage";
import { Mutation } from "common/lib/graphql/mutation";
import { Query } from "common/lib/graphql/query";
import { FieldType } from "common/core/types/field-type-enum";
import { SysVar } from "../domains/sys-var";

export class SysVarService {
    private readonly DEFAULT_TYPE = FieldType.string;
    private readonly DEFAULT_VALUE = "";

    public constructor(protected readonly graphql_service = ClientStorage.getInstance().getGraphQLService()) {}

    /**
     * Retrieves entity by name
     * @param name
     * @returns
     */
    public async get(name: string): Promise<SysVar> {
        const entity = await this.graphql_service.get(
            new Query("sysvar")
                .with({ name: "$name" })
                .vars({ name: { type: "String!", value: name } })
                .take("name,value,type")
        );
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
            new Mutation("setSysVar")
                .with({
                    name: "$name",
                    value: "$value",
                    type: "$type",
                })
                .vars({
                    name: {
                        type: "String!",
                        value: name,
                    },
                    type: {
                        type: "Int!",
                        value: type,
                    },
                    value: {
                        type: "String!",
                        value: value?.toString() || "",
                    },
                })
                .take("name,value")
        );
    }

    /**
     * Retrieves all sysvars
     * @returns
     */
    public async getAll(): Promise<SysVar[]> {
        return await this.graphql_service.get(new Query("sysvars").take("name,value,type"));
    }
}
