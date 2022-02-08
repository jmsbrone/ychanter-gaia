<template lang="pug">
AdminSectionPageEditor
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { EditorStore } from "client/stores/editor";
import { AuthService } from "client/modules/auth/services/auth-service";

@Component({
    layout: "editor",
})
export default class EditorPage extends Vue {
    async beforeMount() {
        //- Temporary re-register for hot reload
        if (this.$store.hasModule("editor")) {
            this.$store.unregisterModule("editor");
        }
        this.$store.registerModule("editor", EditorStore);
        const auth_service = new AuthService();
        await auth_service.initUser();
    }
}
</script>
