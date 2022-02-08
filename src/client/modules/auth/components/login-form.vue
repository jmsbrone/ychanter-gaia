<template lang="pug">
div
    Form(:field_config="form_fields_config", v-model="login_dto", @submit="login()")
    .d-flex
        v-spacer
        v-btn(color="primary", @click="login()") Login
        v-spacer
</template>

<script lang="ts">
import { FormConfig } from "client/types/editor";
import { LOGIN_FIELD, PASSWORD_FIELD } from "common/constants";
import { UserLoginDto } from "common/dto/user/login.dto";
import { FieldType } from "common/core/types/field-type-enum";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { AuthService } from "../services/auth-service";

@Component({})
export default class AuthLoginForm extends Vue {
    form_fields_config: FormConfig = {
        [LOGIN_FIELD]: {
            type: FieldType.string,
            required: true,
            name: "Login",
            minlength: 4,
        },
        [PASSWORD_FIELD]: {
            type: FieldType.password,
            required: true,
            minlength: 4,
            name: "Password",
            submit_on_enter: true,
        },
    };
    login_dto: UserLoginDto = {
        login: "",
        password: "",
    };

    @Prop({ default: null })
    redirectUrl: string;

    async login() {
        try {
            const service = new AuthService();
            let logged_in = await service.login(this.login_dto);
            if (logged_in) {
                if (this.redirectUrl) {
                    this.$router.push(this.redirectUrl);
                } else {
                    this.$router.go(0);
                }
            } else {
                throw "not authorized";
            }
        } catch (error) {
            console.error(error);
        }
    }
}
</script>
