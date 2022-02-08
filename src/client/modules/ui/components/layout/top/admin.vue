<template lang="pug">
include ../../../templates/icons.pug

v-app-bar(app, elevate-on-scroll)
    v-app-bar-nav-icon(v-if="$vuetify.breakpoint.mobile", @click="$store.commit('root/openLeftMenu')")
        template(v-slot:default)
            +icon("menu")
    v-app-bar-nav-icon(to="/", nuxt)
        template(v-slot:default)
            +icon("home")
    v-toolbar-title YChanter
    v-row(no-gutters)
        v-spacer
        +icon("signal")(:color="authorized ? `success` : `red`")

    .alert-row
        v-row(no-gutters)
            v-spacer
            v-alert(
                type="error",
                v-model="show_error",
                colored-border,
                border="left",
                transition="scroll-y-transition",
                dismissible,
                elevation="4"
            ) {{ error }}
            v-spacer
</template>

<script lang="ts">
import { AuthService } from "client/modules/auth/services/auth-service";
import { Component, Vue, Watch } from "nuxt-property-decorator";

@Component({})
export default class PageAdminNavBar extends Vue {
    authorized: boolean = false;
    error: string = null;
    show_error: boolean = false;

    async isUserAuthorized() {
        const auth_service = new AuthService();
        return auth_service.isAuthenticated();
    }

    async fetch() {
        this.authorized = await this.isUserAuthorized();
    }

    @Watch("storeErrorCounter")
    onNewError() {
        this.error = this.$yc_storage.getStore().getState().root.error;
        this.show_error = true;
    }

    get storeErrorCounter() {
        return this.$yc_storage.getStore().getState().root.error_counter;
    }
}
</script>

<style lang="scss" scoped>
.alert-row {
    position: absolute;
    width: 100%;
    top: 110%;
}
</style>
