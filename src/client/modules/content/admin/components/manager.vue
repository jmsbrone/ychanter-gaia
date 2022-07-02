<template lang="pug">
v-container(fluid)
    v-card(outlined)
        v-card-title Content manager
        v-card-subtitle Create, edit, remove content
        v-card-text
            v-btn(nuxt, to="/admin/content/galleries") Galleries
            v-btn(nuxt, to="/admin/content/playlists") Playlists

    NuxtChild
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class ContentManager extends Vue {
    tab = null;
}
</script>
