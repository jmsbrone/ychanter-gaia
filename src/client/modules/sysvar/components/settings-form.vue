<template lang="pug">
include ../../ui/templates/icons.pug

v-sheet
    v-card(flat)
        v-card-text
            v-expansion-panels(v-model="active_panels", multiple)
                v-expansion-panel(v-for="setting_group in setting_groups", :key="setting_group.header")
                    v-expansion-panel-header {{ setting_group.header }}
                    v-expansion-panel-content
                        Form(
                            v-if="initialized",
                            :field_config="setting_group.settings",
                            v-model="setting_group.form_data"
                        )
        v-card-actions
            v-spacer
            v-btn(color="primary", @click="onSave()") Save
                +icon("save")
            v-spacer
    v-card(flat)
        v-card-title System info
        v-card-text
            div Max transfer size: {{ $store.getters['settings/max_transfer_chunk_size'] }} bytes
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { FieldType } from "common/core/types/field-type-enum";
import { Component, Vue } from "nuxt-property-decorator";
import { PlainObject } from "client/types/basic";
import { Settings } from "common/constants";
import { FileService } from "client/modules/file/services/file-service";
import { SysVarService } from "client/modules/sysvar/services/sys-var-service";

@Component({
    layout: "admin",
})
export default class AdminSettings extends Vue {
    setting_groups = [
        {
            header: "Website",
            settings: {
                name: {
                    type: FieldType.string,
                    maxlength: 100,
                    name: "Project name",
                    hint: "Website name that will be displayed publicly",
                },
                favicon: {
                    type: FieldType.image,
                    name: "Favicon",
                    preview: true,
                    preview_size: "small",
                    hint: "Small site icon in .ico format",
                    mimetyping: ["image/vnd.microsoft.icon"],
                    upload_type: "icon",
                },
            },
            form_data: {},
        },
        {
            header: "Files",
            settings: {
                [Settings.REUSE_FILES_ON_DUPLICATE_UPLOAD]: {
                    type: FieldType.switch,
                    active: "Duplicate uploads are not allowed",
                    inactive: "Duplicate file uploads are not checked",
                    hint: "This setting affects file uploads. Having it active will prevent users from uploading duplicate files.",
                },
                [Settings.STORE_FILES_IN_DB]: {
                    type: FieldType.switch,
                    inactive: "Files are stored only locally",
                    active: "Files are stored in database",
                    hint: "With this setting on files will be additionally saved to database. This should only be active for environments where local files can be deleted (for example, Heroku dynos can restart from clean slate)",
                },
            },
            form_data: {},
        },
    ];
    favicon_last_active_id: number;
    initialized: boolean = false;
    active_panels: number[] = [];
    current_settings: any[] = [];

    async fetch() {
        const sysvar_service = new SysVarService();
        this.current_settings = await sysvar_service.getAll();
        let data: PlainObject = {};
        _.each(this.current_settings, (setting) => {
            switch (setting.type) {
                case FieldType.switch:
                case FieldType.checkbox:
                    setting.value = setting.value === "true";
                    break;
                case FieldType.number:
                case FieldType.file:
                case FieldType.gallery:
                case FieldType.image:
                    setting.value = parseInt(setting.value);
                    break;
            }
            data[setting.name] = setting.value;
        });
        _.each(this.setting_groups, (group) => {
            _.each(group.settings, (config, name) => {
                group.form_data[name] = data[name];
            });
        });
        this.favicon_last_active_id = this.current_settings["favicon"];
        this.initialized = true;
    }

    beforeMount() {
        this.active_panels = _.range(this.setting_groups.length);
    }

    async onSave() {
        try {
            const sysvar_service = new SysVarService();
            const form_data: PlainObject = {};
            await Promise.all(
                _.map(this.setting_groups, async (group) => {
                    await Promise.all(
                        _.map(group.settings, async (config, name) => {
                            form_data[name] = group.form_data[name];
                            if (form_data[name] !== this.current_settings[name]) {
                                await sysvar_service.set(name, group.form_data[name], config.type);
                            }
                        })
                    );
                })
            );

            if (form_data.favicon && form_data.favicon !== this.favicon_last_active_id) {
                const file_service = new FileService();
                await file_service.updateFavicon(form_data.favicon);
                this.favicon_last_active_id = form_data.favicon;
            }
        } catch (error) {
            console.error(error);
        }
    }
}
</script>
