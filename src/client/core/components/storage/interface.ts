import { AxiosRequest } from "client/core/components/axios-request";
import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { Store } from "client/core/components/store/interface";

/**
 * Interface for global storage that should be implemented
 * in the class responsible for storing globally accessed data.
 */
export interface GlobalStorage<StoreType extends Store = any> {
    /**
     * Gets jwt authorization token from global storage
     */
    getJwtAuthorizationToken(): string;
    /**
     * Sets new jwt authorization token
     * @param token
     */
    setJWTAuthorizationToken(token: string): void;
    /**
     * Sets global store for this storage
     * @param store
     */
    setStore(store: StoreType): void;
    /**
     * Returns global store instance for this storage
     */
    getStore(): StoreType;
    /**
     * Sets a global reference to created GraphQL service instance
     * @param graphql_service
     */
    setGraphQLService(graphql_service: GraphQLService): void;
    /**
     * Get reference to global GraphQL service instance
     */
    getGraphQLService(): GraphQLService;
    /**
     * Sets a global reference to created AxiosRequest instance
     * @param axios_service
     */
    setAxiosRequest(axios_service: AxiosRequest): void;
    /**
     * Get reference to global AxiosRequest instance
     */
    getAxiosRequest(): AxiosRequest;
}
