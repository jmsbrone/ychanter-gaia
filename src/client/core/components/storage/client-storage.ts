import { GlobalStorageBase } from "client/core/components/storage/base";
import { VuexStore } from "client/core/components/store/vuex-store";

export class ClientStorage extends GlobalStorageBase<VuexStore> {
    /**
     * Singleton instance of the storage
     */
    private static _instance: ClientStorage = null;
    public static getInstance(): ClientStorage {
        if (!this._instance) {
            this._instance = new ClientStorage();
        }

        return this._instance;
    }
}
