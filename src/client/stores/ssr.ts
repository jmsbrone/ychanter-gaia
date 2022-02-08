/**
 * @summary
 *
 * Store for keeping and accessing ssr data.
 */

import { PlainObject } from "client/types/basic";
import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({
    name: "ssr",
    namespaced: true,
    stateFactory: true,
})
export class RuntimeStore extends VuexModule {
    _universal_data: PlainObject = {};

    get getData() {
        return (id: string) => {
            return this._universal_data[id];
        };
    }

    @Mutation
    setData({ id, data }): void {
        this._universal_data[id] = data;
    }
}
