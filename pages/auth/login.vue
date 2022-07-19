<template lang="pug">
v-container
    v-row
        v-spacer
        .text-h2.mt-4.mb-8 Login
        v-spacer
    v-row
        v-spacer
        v-col(cols="12", md="8", lg="6")
            v-form(v-model="valid", ref="form")
                v-row
                    v-text-field(
                        v-model="formData.login",
                        :rules="rules.login",
                        label="Login",
                        :counter="10"
                    )
                v-row
                    v-text-field(
                        v-model="formData.password",
                        :rules="rules.password",
                        type="password",
                        required,
                        label="Password"
                    )
                v-row
                    v-spacer
                    v-btn(color="primary", @click="login()") Login
                    v-spacer
        v-spacer
</template>

<script setup lang="ts">
import { AuthService } from "../../core/auth/services/auth-service";

definePageMeta({
    layout: "auth",
});

const rules = {
    login: [(v) => !!v || "Required"],
    password: [(v) => !!v || "Required"],
};
const valid = ref(false);
const form = ref(null);
const formData = reactive({
    login: "",
    password: "",
});

async function login() {
    if (!(await form.value.validate())) {
        return;
    }
    let service = new AuthService();
    if (await service.login(formData)) {
        const user = useCurrentUser();
        user.value = await service.fetchCurrentUser();
        const router = useRouter();
        router.back();
    }
}
</script>
