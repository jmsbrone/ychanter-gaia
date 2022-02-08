<template lang="pug">
v-container(fluid)
    v-toolbar(flat)
        v-toolbar-title Dashboard
    v-card(flat)
        v-card-title Dashboard page
        v-card-text Here you will see general information about the website
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class AdminDashboard extends Vue {}
</script>
