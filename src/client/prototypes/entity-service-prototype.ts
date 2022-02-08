/**
 * @module Prototypes
 */
import { PlainObject } from "client/types/basic";
import _ from "client/helpers/lodash";
import { Query } from "common/lib/graphql/query";
import { Mutation } from "common/lib/graphql/mutation";
import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { GraphQLQuery } from "common/lib/graphql/query-interface";

export type EntityCreateDto<T> = {
    [key in keyof T]?: any;
};

export type EntityUpdateDto<T> = { id: number } & {
    [key in keyof T]?: any;
};

export type EntityDeleteDto<T> = { id?: number } & {
    [key in keyof T]?: any;
};

/**
 * Generic class for all graphql domain services
 */
export abstract class EntityServicePrototype<
    T,
    CreateDto extends EntityCreateDto<T>,
    UpdateDto extends EntityUpdateDto<T>,
    DeleteDto extends EntityDeleteDto<T>
> {
    /**
     * Creates new entity service
     * @param query_one GraphQL query name for selecting a single entity
     * @param query_list GraphQL query name for selecting multiple entity
     * @param mutation_new GraphQL mutation name for adding new entity
     * @param mutation_update GraphQL mutation name for updating entity
     * @param mutation_delete GraphQL mutation name for deleting entity
     */
    public constructor(
        private entity_constructor: new () => T,
        protected readonly query_one: string,
        protected readonly query_list: string,
        protected readonly mutation_new: string,
        protected readonly mutation_update: string,
        protected readonly mutation_delete: string,
        protected readonly graphql_service: GraphQLService = ClientStorage.getInstance().getGraphQLService()
    ) {}

    /**
     * Returns a list of fields that will be requested with entity
     */
    protected abstract getUsedEntityFields(): string[];

    /**
     * Returns a mapper with entity attributes to corresponding GraphQL type
     */
    protected abstract getEntityFieldGraphQLTypes(): { [key in keyof Partial<T>]: string };

    /**
     * Creates new entity model from given data
     * @param constructor
     * @param data
     * @returns
     */
    protected makeEntity(data: any): T {
        const entity = new this.entity_constructor();
        _.assign(entity, data);

        return entity;
    }

    /**
     * Executes a query that is supposed to return multiple items.
     * @param query
     * @returns
     */
    protected async getListByQuery(query: GraphQLQuery): Promise<T[]> {
        const result = [];
        const execution_data = await this.graphql_service.get(query);
        _.each(execution_data, (entity_data) => {
            result.push(this.makeEntity(entity_data));
        });

        return result;
    }

    /**
     * Executes a query that is supposed to return a single item.
     * @param query
     * @returns
     */
    protected async getOneByQuery(query: GraphQLQuery): Promise<T | null> {
        let result = null;
        const execution_data = await this.graphql_service.get(query);
        if (execution_data) {
            result = this.makeEntity(execution_data);
        }

        return result;
    }

    /**
     * Fetches entity by id
     * @param id
     */
    public async getById(id: number, load_content = false): Promise<T | null> {
        const query = new Query(this.query_one).with({ id }).take(...this.getUsedEntityFields());
        if (load_content) {
            query.take("content");
        }

        return this.getOneByQuery(query);
    }

    /**
     * Get entire list without conditions
     * @param offset
     * @param limit
     */
    public async getAll(offset = 0, limit = 0): Promise<T[]> {
        const query = new Query(this.query_list).take(...this.getUsedEntityFields());
        const args: PlainObject = {};
        if (offset > 0) {
            args["offset"] = offset;
        }
        if (limit > 0) {
            args["limit"] = limit;
        }
        query.with(args);

        return this.getListByQuery(query);
    }

    /**
     * Adds or updates entity
     * @param entity
     * @returns
     */
    public async save(dto: UpdateDto | CreateDto): Promise<T | null> {
        let mutation_name: string;
        if (typeof dto["id"] !== "undefined" && dto["id"] > 0) {
            mutation_name = this.mutation_update;
        } else {
            mutation_name = this.mutation_new;
        }

        const mutation = new Mutation(mutation_name).take(...this.getUsedEntityFields());
        const attribute_types = this.getEntityFieldGraphQLTypes();
        const args: PlainObject = {};
        const vars: PlainObject = {};
        _.each(attribute_types, (type, attribute) => {
            if ((mutation_name === this.mutation_new && attribute === "id") || typeof dto[attribute] === "undefined") {
                return;
            }
            args[attribute] = `$${attribute}`;
            vars[attribute] = {
                type,
                value: dto[attribute],
            };
        });
        mutation.with(args).vars(vars);

        return await this.getOneByQuery(mutation);
    }

    /**
     *
     * @param entity
     * @returns
     */
    public async delete(entity: DeleteDto): Promise<boolean> {
        const mutation = new Mutation(this.mutation_delete).with({ id: (entity as any).id });
        let result = false;
        try {
            await this.graphql_service.get(mutation);
            result = true;
        } catch (error) {
            console.error(error);
        }

        return result;
    }
}
