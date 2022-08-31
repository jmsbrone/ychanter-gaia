<template lang="pug">
v-container(fluid)
    .text-h4 Content manager
    v-row(no-gutters)
        v-btn(nuxt, to="/admin/content/galleries") Galleries
        v-btn(nuxt, to="/admin/content/playlists") Playlists
</template>

<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

</script>
