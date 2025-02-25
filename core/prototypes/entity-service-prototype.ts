import _ from "lodash";
import { CRUDResourceSchema } from "@ychanter/graphql-client";
import { GraphQLQuery } from "@ychanter/graphql-client";
import { GraphQLService } from "../components/graphql/graphql-service";
import { PlainObject } from "../types/basic";
import { DIContainer } from "../port-manager";

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
    protected schema: CRUDResourceSchema;
    protected readonly graphql_service: GraphQLService;

    /**
     * Creates new entity service
     */
    public constructor(private entity_constructor: new () => T) {
        this.schema = this.createSchema();
        this.graphql_service = DIContainer.get<GraphQLService>("GraphQLService");
    }

    /**
     * Returnes graphql schema for this service
     */
    protected abstract createSchema(): CRUDResourceSchema;

    /**
     * Returns a list of fields that will be returns for a single entity.
     */
    protected abstract getUsedEntityFieldsOne(): string[];

    /**
     * Returns a list of fields that will be requested for a list of entities.
     * This generally allows to exclude unnecessary list view fields.
     */
    protected abstract getUsedEntityFieldsMany(): string[];

    /**
     * Creates new entity model from given data
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
    public async getById(id: number): Promise<T | null> {
        const query = this.schema.getQueryOne({ id }, this.getUsedEntityFieldsOne());

        return this.getOneByQuery(query);
    }

    /**
     * Get entire list without conditions
     * @param offset
     * @param limit
     */
    public async getAll(offset = 0, limit = 0): Promise<T[]> {
        const args: PlainObject = {};
        if (offset > 0) {
            args["offset"] = offset;
        }
        if (limit > 0) {
            args["limit"] = limit;
        }
        const query = this.schema.getQueryMany(args, this.getUsedEntityFieldsMany());

        return this.getListByQuery(query);
    }

    /**
     * Adds or updates entity
     * @param entity
     * @returns
     */
    public async save(dto: UpdateDto | CreateDto): Promise<T | null> {
        const mutation = this.schema.getSaveMutation(dto, this.getUsedEntityFieldsOne());

        return await this.getOneByQuery(mutation);
    }

    /**
     *
     * @param entity
     * @returns
     */
    public async delete(entity: DeleteDto): Promise<boolean> {
        const mutation = this.schema.getDeleteMutation({ id: (entity as any).id }, []);
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
