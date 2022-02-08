import { Store } from "client/core/components/store/interface";
import { StoreState } from "client/core/components/store/state";
import { UserAbility } from "client/modules/auth/values/user-ability";

/**
 * Generic prototype for store classes
 */
export abstract class ClientStorePrototype<StoreClass, CommitOptions, DispatchOptions>
    implements Store<StoreClass, CommitOptions, DispatchOptions>
{
    public abstract commit(type: string, payload?: any, options?: CommitOptions): void;
    public abstract dispatch(type: string, payload?: any, options?: DispatchOptions): void;
    public abstract setSsrResourceData(resource: string, id: string, data: any): void;
    public abstract fetchSsrResourceData(resource: string, id: string): any;
    public abstract fetchSsrDataById(id: string): any;
    public abstract getGetter(getter_name: string): (...args: any[]) => any;
    public abstract getStoreInstance(): StoreClass;
    public abstract hasModule(module: string): boolean;
    public abstract getState(): StoreState;
    public abstract subscribe(handler: (name: { type: string; payload: any }, state: StoreState) => void): void;
    public abstract replaceState(new_state: StoreState): void;
    public abstract showError(error: string): void;
    public abstract getUserPermissions(): UserAbility;

    public constructor(protected readonly $store: StoreClass) {}

    /**
     * Creates id string for given resource
     * @param resource Resource name
     * @param id Unique identificator for the resource
     * @returns
     */
    protected makeResourceId(resource: string, id: string): string {
        return `${resource}-${id}`;
    }
}
