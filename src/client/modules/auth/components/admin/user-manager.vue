<template lang="pug">
include ../../../ui/templates/icons.pug

div
    v-card(v-if="!edit_mode")
        v-card-title Users
        v-card-text
            v-data-table(:items="users", :headers="table_fields")
                template(v-slot:item.actions="{ item }")
                    +icon_btn("edit")(@click="setEdit(item)", :disabled="!canEditUser(item)")
                    +icon_btn("delete")(
                        @click="deleteUser(item)",
                        :disabled="!canDeleteUser(item)"
                    )
        v-card-actions
            v-btn(color="primary", @click="addNew()")
                +icon("add")
                span Add
    v-card(v-else)
        v-card-title {{ edit_data.id ? `Editing user <${edit_data.login}>` : 'New user' }}
        v-card-text
            Form(:field_config="edit_form_fields_config", v-model="edit_data", ref="edit_form")
        v-card-actions
            v-btn(color="primary", @click="save()")
                +icon("save")
                span Save
            v-btn(color="secondary", @click="back()")
                +icon("back")
                span Back
</template>

<script lang="ts">
import { FormConfig } from "client/types/editor";
import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";
import { CreateUserDto } from "common/dto/user/create-user.dto";
import { UpdateUserDto } from "common/dto/user/update-user.dto";
import { Component, Vue } from "nuxt-property-decorator";
import _ from "client/helpers/lodash";
import { UserService } from "../../services/user-service";
import { User } from "../../domains/user";
import { UserAction } from "common/modules/auth/types/user-action";
import { FieldType } from "common/core/types/field-type-enum";

@Component({})
export default class AdminDashboardUsersManager extends Vue {
    edit_mode: boolean = false;
    edit_data: UpdateUserDto & CreateUserDto = {
        id: null,
        [LOGIN_FIELD]: "",
        [PASSWORD_FIELD]: "",
    };
    edit_form_fields_config: FormConfig = {
        id: {
            type: FieldType.hidden,
        },
        [LOGIN_FIELD]: {
            type: FieldType.string,
            required: true,
            minlength: 4,
            maxlength: 40,
            name: "Login",
        },
        [PASSWORD_FIELD]: {
            type: FieldType.password,
            required: true,
            minlength: 6,
            maxlength: 50,
            name: "Password",
        },
        isSystemAdmin: {
            type: FieldType.switch,
            name: "System admin",
        },
        isAdmin: {
            type: FieldType.switch,
            name: "Administrator",
        },
        isOperator: {
            type: FieldType.switch,
            name: "Operator",
        },
    };
    users: User[] = [];
    table_fields = [
        { text: "ID", value: "id" },
        { text: "Login", value: "login" },
        { text: "Registered", value: "created_at" },
        { text: "Actions", value: "actions", sortable: false },
    ];
    user_service = new UserService();

    head() {
        return {
            title: "Users",
        };
    }

    async fetch() {
        this.users = await this.user_service.getAll();
    }

    setEdit(selected_user: User) {
        this.edit_data = selected_user;
        this.edit_form_fields_config[PASSWORD_FIELD].required = false;
        this.edit_mode = true;
    }

    addNew() {
        this.edit_data = {
            id: null,
            [LOGIN_FIELD]: "",
            [PASSWORD_FIELD]: "",
        };
        this.edit_form_fields_config[PASSWORD_FIELD].required = true;
        this.edit_mode = true;
    }

    async deleteUser(user: User) {
        try {
            await this.user_service.delete({ id: user.id });
            this.users.splice(this.users.indexOf(user), 1);
        } catch (error) {
            console.error(error);
        }
    }

    async save() {
        if (!(this.$refs.edit_form as any).isValid()) {
            return;
        }
        try {
            if (!this.edit_data.id) {
                let new_user = await this.user_service.save(this.edit_data);
                this.users.push(new_user);
            } else {
                let updated_user = await this.user_service.save(this.edit_data);
                let index = _.findIndex(this.users, { id: this.edit_data.id });
                this.users.splice(index, 1, updated_user);
            }
            this.edit_mode = false;
        } catch (error) {
            console.error(error);
        }
    }

    back() {
        this.edit_mode = false;
    }

    canEditUser(user: User): boolean {
        const permissions = this.$yc_storage.getStore().getState().root.user.permissions;
        return permissions.can(UserAction.Update, user);
    }

    canDeleteUser(user: User): boolean {
        const permissions = this.$yc_storage.getStore().getState().root.user.permissions;
        return permissions.can(UserAction.Delete, user);
    }
}
</script>
