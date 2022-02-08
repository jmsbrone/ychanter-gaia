<template lang="pug">
include ../../../ui/templates/buttons.pug

v-container(fluid)
    div(v-if="state === STATE_INITIAL")
        v-toolbar(dense, rounded)
            +icon_btn_transparent("back")(to="/admin/dynamic-entities")
            v-toolbar-title Dynamic entity editor
            template(v-slot:extension)
                v-tabs(v-model="active_tab")
                    v-tab General
                    v-tab Fields

        v-tabs-items(v-model="active_tab")
            v-tab-item(:transition="tab_transition")
                Form(:field_config="entity_data_form_config", v-model="entity_data.general", ref="entity_fields_form")
            v-tab-item(:transition="tab_transition")
                v-container(fluid)
                    v-row.mb-2(no-gutters)
                        v-spacer
                        v-btn(@click="addField()")
                            +icon_btn_transparent("add")
                            | Add
                    v-divider
                    v-data-table(:items="entity_data.fields", :headers="fields_table_header", hide-default-footer)
                        template(v-slot:item.actions="{ item }")
                            +icon_btn("edit")(@click="editField(item)", :disabled="!userCanEditField(item)")
        v-divider
        v-row(no-gutters)
            .my-2.mx-1
                +btn_save()(@click="save()", :disabled="!isValid()")
    div(v-else)
        v-toolbar(dense, rounded)
            +icon_btn_transparent("back")(@click="cancelFieldEdit()")
            v-toolbar-title Editing field {{ edited_field.name }}
        AdminDynamicEntityFieldEditor(:value="edited_field", @input="saveEntityField($event)")
</template>

<script lang="ts">
import { DynamicEntity } from "client/modules/dynamic-entity/domains/dynamic-entity";
import { FormConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { DynamicEntityService } from "../../services/dynamic-entity-service";
import _ from "client/helpers/lodash";
import Form from "client/modules/ui/components/form.vue";
import { CreateDynamicEntityDto, UpdateDynamicEntityDto } from "client/modules/dynamic-entity/dto/dynamic-entity";
import { ErrorHandler } from "client/core/base/error-handler";
import { Errors } from "../../errors";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { UserAbility } from "client/modules/auth/values/user-ability";
import { UserAction } from "common/modules/auth/types/user-action";
import { EntityFieldType } from "client/modules/dynamic-entity/types";

@Component({})
export default class AdminDynamicEntityList extends Vue {
    /**
     * Props
     */
    @Prop()
    entity_id: number | string;

    /**
     * Constants
     */
    readonly STATE_INITIAL = 0;
    readonly STATE_FIELD_EDIT = 1;
    readonly tab_transition = "fade-transition";

    /**
     * Vars
     */
    state: number = this.STATE_INITIAL;
    entity: DynamicEntity;
    entity_service: DynamicEntityService;
    active_tab: number = null;
    entity_data = {
        general: {
            name: null,
            title: null,
            id: null,
        },
        fields: [],
    };
    edited_field = null;
    user_permissions: UserAbility = null;

    /**
     * Config objects
     */
    entity_data_form_config: FormConfig = {
        name: {
            type: FieldType.string,
            required: true,
            maxlength: 255,
            name: "Name",
            custom_validator: (value: string): boolean | string => {
                return (value && !!value.match(/^\w+[\w0-9_]+$/)) || "Invalid name format";
            },
        },
        title: {
            type: FieldType.string,
            required: true,
            maxlength: 255,
            name: "Dynamic entity title",
            custom_validator: (value: string): boolean | string => {
                return (value && !!value.match(/^\w{3,}/)) || "Invalid name format";
            },
        },
    };
    fields_table_header = [
        { text: "Name", value: "name" },
        { text: "Title", value: "form_title" },
        { text: "Actions", value: "actions", sortable: false },
    ];

    /**
     * Hooks
     */
    async fetch() {
        this.entity_service = new DynamicEntityService();
        if (this.entity_id === "new") {
            this.entity = new DynamicEntity();
        } else {
            this.entity = await this.entity_service.getById(parseInt(this.entity_id as string));
        }
        _.assign(this.entity_data.general, _.pick(this.entity, ["id", "name", "title"]));
        this.entity_data.fields = this.entity.fields;

        this.user_permissions = ClientStorage.getInstance().getStore().getUserPermissions();
    }

    async save() {
        let save_dto: UpdateDynamicEntityDto | CreateDynamicEntityDto;
        if (this.entity.id > 0) {
            save_dto = new UpdateDynamicEntityDto();
            save_dto.id = this.entity.id;
        } else {
            save_dto = new CreateDynamicEntityDto();
        }
        _.assign(save_dto, this.entity_data.general);
        save_dto.fields = _.map(this.entity.fields, (field) => _.omit(field, ["locked", "update_error"]));

        try {
            this.entity = await this.entity_service.save(save_dto);
        } catch (error) {
            const error_text = ErrorHandler.getErrorText(Errors, error.message, save_dto);
            this.$yc_storage.getStore().showError(error_text);
        }
    }

    isValid() {
        const form = this.$refs["entity_fields_form"] as Form;
        if (!form) {
            return true;
        }

        return form.isValid();
    }

    editField(field) {
        this.state = this.STATE_FIELD_EDIT;
        this.edited_field = field;
    }

    cancelFieldEdit() {
        this.state = this.STATE_INITIAL;
    }

    userCanEditField(field: EntityFieldType): boolean {
        let allowed = this.user_permissions.can(UserAction.Update, this.entity);
        if (field.system) {
            allowed = this.user_permissions.can(UserAction.Update, this.entity, "system_fields");
        }
        return allowed;
    }

    saveEntityField(field: EntityFieldType) {
        let field_index = null;

        _.each(this.entity.fields, (entity_field, index) => {
            if (entity_field.name === this.edited_field.name) {
                field_index = index;
            }
        });
        if (field_index !== null) {
            this.entity.fields.splice(field_index, 1, field);
        } else {
            this.entity.fields.push(field);
        }

        this.cancelFieldEdit();
    }

    addField() {
        this.editField(new EntityFieldType());
    }
}
</script>
