import { AxiosRequest } from "client/core/components/axios-request";
import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { GlobalStorage } from "client/core/components/storage/interface";
import { Store } from "client/core/components/store/interface";
import { PlainObject } from "client/types/basic";
import { JWT_TOKEN_SSR_ID } from "common/constants";
import Cookies from "js-cookie";

/**
 * Base class for storage classes.
 * Implements general functionality that doesn't depend on used store type.
 */
export abstract class GlobalStorageBase<T extends Store> implements GlobalStorage<T> {
    /**
     * Storage object
     */
    private _storage_data: PlainObject = {};

    protected readonly STORAGE_KEY_JWT_AUTHORIZATION_TOKEN = "jwt-authorization-token";
    protected readonly STORAGE_KEY_STORE = "store";
    protected readonly STORAGE_KEY_GRAPHQL = "graphql-service";
    protected readonly STORAGE_KEY_AXIOS = "axios-request";

    /**
     * Sets storage data
     * @param key
     * @param data
     */
    protected setStorageData(key: string, data: any): void {
        this._storage_data[key] = data;
    }

    /**
     * Retrieve storage data
     * @param key
     * @returns
     */
    protected getStorageData(key: string): any {
        return this._storage_data[key];
    }

    /**
     * @inheritdoc
     */
    public getJwtAuthorizationToken(): string {
        let token = this.getStorageData(this.STORAGE_KEY_JWT_AUTHORIZATION_TOKEN);
        if (!token) {
            token = this.getStore().fetchSsrDataById(JWT_TOKEN_SSR_ID);
            if (!token) {
                token = Cookies.get(this.STORAGE_KEY_JWT_AUTHORIZATION_TOKEN);
            }
            this.setJWTAuthorizationToken(token);
        }

        return token;
    }

    /**
     * @inheritdoc
     */
    public setJWTAuthorizationToken(token: string): void {
        Cookies.set(this.STORAGE_KEY_JWT_AUTHORIZATION_TOKEN, token);
        this.setStorageData(this.STORAGE_KEY_JWT_AUTHORIZATION_TOKEN, token);
    }

    /**
     * @inheritdoc
     */
    public setStore(store: T): void {
        this.setStorageData(this.STORAGE_KEY_STORE, store);
    }

    /**
     * @inheritdoc
     */
    public getStore(): T {
        return this.getStorageData(this.STORAGE_KEY_STORE);
    }

    /**
     * @inheritdoc
     */
    setGraphQLService(graphql_service: GraphQLService): void {
        this.setStorageData(this.STORAGE_KEY_GRAPHQL, graphql_service);
    }

    /**
     * @inheritdoc
     */
    getGraphQLService(): GraphQLService {
        return this.getStorageData(this.STORAGE_KEY_GRAPHQL);
    }

    /**
     * @inheritdoc
     */
    setAxiosRequest(axios_service: AxiosRequest): void {
        this.setStorageData(this.STORAGE_KEY_AXIOS, axios_service);
    }

    /**
     * @inheritdoc
     */
    getAxiosRequest(): AxiosRequest {
        return this.getStorageData(this.STORAGE_KEY_AXIOS);
    }
}
