/**
 * @summary
 *
 * Globally accessible $store.
 * Due to component-based nature of Vue, using $store anywhere else isn't
 * possible without passing it everywhere as a param.
 */

import { JWT_TOKEN_COOKIE, JWT_TOKEN_SSR_ID } from "common/constants";
import { Store as VueStore, CommitOptions, DispatchOptions } from "vuex";
import Cookies from "js-cookie";
import _ from "client/core/helpers/lodash";

export class Store {
    /** Keeping $store reference */
    protected static $store: VueStore<any>;

    /** JWT token for requests */
    protected static jwt_authorization_token: string = null;

    /**
     * Sets store instance
     * @param $store
     */
    public static setStore($store: VueStore<any>) {
        this.$store = $store;
    }

    /**
     * Commit to $store
     * @param type
     * @param payload
     * @param options
     */
    public static commit(type: string, payload?: any, options?: CommitOptions): void {
        this.$store.commit(type, payload, options);
    }

    /**
     * Dispatch action
     * @param type
     * @param payload
     * @param options
     * @returns
     */
    public static dispatch(type: string, payload?: any, options?: DispatchOptions): any {
        return this.$store.dispatch(type, payload, options);
    }

    /**
     * Creates id string for given resource
     * @param resource
     * @param id
     * @returns
     */
    protected static makeResourceId(resource: string, id: string): string {
        return `${resource}-${id}`;
    }

    /**
     * Sets resource data in storage to later be retrieved on client side.
     * @param resource
     * @param id
     * @param data
     */
    public static setSsrResourceData(resource: string, id: string, data: any, fields?: string[]) {
        if (this.$store.hasModule("ssr")) {
            if (fields && _.isObjectLike(data)) {
                const light_data = {};
                _.each(fields, (field) => {
                    light_data[field] = data[field];
                });
                data = light_data;
            }
            this.$store.commit("ssr/setData", {
                id: `${resource}-${id}`,
                data: data,
            });
        }
    }

    /**
     * Retrieves resource data taken from the server.
     *
     * @param resource
     * @param id
     * @param data
     * @returns
     */
    public static fetchSsrResourceData(resource: string, id: string): any {
        return this.fetchSsrDataById(this.makeResourceId(resource, id));
    }

    /**
     * Retrieves any data stored by its id
     *
     * @param id
     * @returns
     */
    public static fetchSsrDataById(id: string): any {
        if (this.$store.hasModule("ssr")) {
            return this.$store.getters["ssr/getData"](id);
        }
    }

    /**
     * Returns stored JWT token
     * @returns
     */
    public static getJwtAuthorizationToken(): string {
        if (!this.jwt_authorization_token) {
            this.jwt_authorization_token = this.fetchSsrDataById(JWT_TOKEN_SSR_ID);
        }
        return this.jwt_authorization_token;
    }

    /**
     * Sets new token
     * @param token
     */
    public static setJWTAuthorizationToken(token: string): void {
        Cookies.set(JWT_TOKEN_COOKIE, token);
        this.jwt_authorization_token = token;
    }

    /**
     * Returns a getter by name
     * @param getter_name
     * @returns
     */
    public static getGetter(getter_name: string): any {
        return this.$store.getters[getter_name];
    }

    /**
     * Returns store instance object for direct manipulations
     * @returns
     */
    public static getStoreInstance(): VueStore<any> {
        return this.$store;
    }
}
