/**
 * Interface for a wrapper around used store.
 * The class implementing it should be preffered to library/framework dependent store
 * in order to make logic decoupled.
 */

import { StoreState } from "client/core/components/store/state";
import { UserAbility } from "client/modules/auth/values/user-ability";

export interface Store<UnderlyingStoreType = any, CommitOptionsType = any, DispatchOptionsType = any> {
    /**
     * Commits a change to the store.
     * @param type Commit name
     * @param payload Commit data
     * @param options Additional options
     */
    commit(type: string, payload?: any, options?: CommitOptionsType): void;
    /**
     * Triggers a store action.
     * @param type Action name
     * @param payload Action data
     * @param options Additional options
     */
    dispatch(type: string, payload?: any, options?: DispatchOptionsType): any;
    /**
     * Used from server side to set ssr data for different resources.
     * @param resource Resource name (category/group)
     * @param id Unique identificator for the data to be saved
     * @param data Data to be saved
     */
    setSsrResourceData(resource: string, id: string, data: any): void;
    /**
     * Returns previously saved ssr data for given resource.
     * @param resource Resource name (category/group)
     * @param id Unique identificator to retrieve data
     */
    fetchSsrResourceData(resource: string, id: string): any;
    /**
     * Fetch ssr data by id directly
     * @param id Unique data id
     */
    fetchSsrDataById(id: string): any;
    /**
     * Returns a store getter
     * @param getter_name Getter name
     */
    getGetter(getter_name: string): (...args: any[]) => any;
    /**
     * Returns underlying store object for used library/framework.
     */
    getStoreInstance(): UnderlyingStoreType;
    /**
     * Returns current store state
     */
    getState(): StoreState;
    /**
     * Returns true if given module is registered
     * @param module
     */
    hasModule(module: string): boolean;
    /**
     * Subscribes to store changes
     * @param handler
     */
    subscribe(handler: (name: { type: string; payload: any }, state: StoreState) => void): void;
    /**
     * Sets new store state overriding the current one
     * @param new_state
     */
    replaceState(new_state: StoreState): void;
    /**
     * Returns user permissions object
     */
    getUserPermissions(): UserAbility;
    /**
     * Display error to user
     * @param error
     */
    showError(error: string): void;
}
