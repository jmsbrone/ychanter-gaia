<template lang="pug">
AdminDynamicEntityEditor(:entity_id="entity_id")
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
    layout: "admin",
})
export default class AdminDynamicEntityEditorPage extends Vue {
    async asyncData({ params }) {
        return { entity_id: params.slug };
    }
}
</script>
