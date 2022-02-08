import { ClientStorePrototype } from "client/core/components/store/prototype";
import { StoreState } from "client/core/components/store/state";
import { UserAbility } from "client/modules/auth/values/user-ability";
import { CommitOptions, DispatchOptions, Store as VStore } from "vuex/types/index";

/**
 * Wrapper around Vuex $store
 */
export class VuexStore extends ClientStorePrototype<VStore<any>, CommitOptions, DispatchOptions> {
    /**
     * @inheritdoc
     */
    public getUserPermissions(): UserAbility {
        return this.getState().root.user.permissions;
    }

    /**
     * @inheritdoc
     */
    public replaceState(new_state: StoreState): void {
        this.$store.replaceState(new_state);
    }
    /**
     * @inheritdoc
     */
    public subscribe(handler: (name: { type: string; payload: any }, state: StoreState) => void): void {
        this.$store.subscribe(handler);
    }

    /**
     * @inheritdoc
     */
    public hasModule(module: string): boolean {
        return this.$store.hasModule(module);
    }
    /**
     * @inheritdoc
     */
    public getState(): StoreState {
        return this.$store.state;
    }

    /**
     * @inheritdoc
     */
    public commit(type: string, payload?: any, options?: CommitOptions): void {
        this.$store.commit(type, payload, options);
    }

    /**
     * @inheritdoc
     */
    public dispatch(type: string, payload?: any, options?: DispatchOptions): void {
        this.$store.dispatch(type, payload, options);
    }

    /**
     * @inheritdoc
     */
    public setSsrResourceData(resource: string, id: string, data: any): void {
        if (this.$store.hasModule("ssr")) {
            this.$store.commit("ssr/setData", {
                id: this.makeResourceId(resource, id),
                data: data,
            });
        }
    }

    /**
     * @inheritdoc
     */
    public fetchSsrResourceData(resource: string, id: string) {
        return this.fetchSsrDataById(this.makeResourceId(resource, id));
    }

    /**
     * @inheritdoc
     */
    public getGetter(getter_name: string): ((...args: any[]) => any) | any {
        return this.$store.getters[getter_name];
    }

    /**
     * @inheritdoc
     */
    public getStoreInstance(): VStore<any> {
        return this.$store;
    }

    /**
     * Retrieves any data stored by its id
     *
     * @param id
     * @returns
     */
    public fetchSsrDataById(id: string): any {
        let result = undefined;
        if (this.$store.hasModule("ssr")) {
            result = this.getGetter("ssr/getData")(id);
        }

        return result;
    }

    public showError(error: string): void {
        this.$store.commit("root/setError", error);
    }
}
