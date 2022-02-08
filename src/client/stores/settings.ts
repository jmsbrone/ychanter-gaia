/**
 * @summary
 *
 * Store for working with settings
 */

import { Section } from "client/modules/section/domains/section";
import { SysVar } from "client/modules/sysvar/domains/sys-var";
import { SysVarService } from "client/modules/sysvar/services/sys-var-service";
import { ServerSettings } from "client/types/app";
import { Module, Mutation, MutationAction, VuexModule } from "vuex-module-decorators";
import _ from "../helpers/lodash";

@Module({
    name: "settings",
    namespaced: true,
    stateFactory: true,
})
export class SettingsStore extends VuexModule {
    _settings: { [key: string]: SysVar } = {};
    _section: Section = null;
    _file_transfer_limit_bytes = 500000;

    get setting() {
        return (id: string) => {
            return this._settings[id];
        };
    }

    get valueof() {
        return (id: string) => {
            return this._settings[id].value;
        };
    }

    @MutationAction
    async init() {
        try {
            const sysvar_service = new SysVarService();
            const settings = await sysvar_service.getAll();
            const mapped_settings: { [key: string]: SysVar } = {};
            _.each(settings, (setting) => {
                mapped_settings[setting.name] = setting;
            });
            return { _settings: mapped_settings };
        } catch (error) {
            console.error(error);
        }
    }

    @Mutation
    setSection(section: Section) {
        this._section = section;
    }

    get section() {
        return this._section;
    }

    get max_transfer_chunk_size() {
        return this._file_transfer_limit_bytes;
    }

    @Mutation
    setDataFromServer(data: ServerSettings) {
        this._file_transfer_limit_bytes = data.file_transfer_limit_bytes;
    }
}
