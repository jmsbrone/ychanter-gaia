<template lang="pug">
NuxtChild
</template>

<script lang="ts">
import { AuthService } from "client/modules/auth/services/auth-service";
import { Component, Vue } from "nuxt-property-decorator";

@Component({
    layout: "admin",
})
export default class AdminPage extends Vue {
    async fetch() {
        try {
            const auth_service = new AuthService();
            await auth_service.initUser();
            if (!auth_service.isAuthenticated()) {
                throw new Error("not authorized");
            }
        } catch (error) {
            console.error(error);
            this.$nuxt.$router.push("/login");
        }
    }
}
</script>
