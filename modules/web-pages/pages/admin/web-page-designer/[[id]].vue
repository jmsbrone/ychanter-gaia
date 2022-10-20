<template lang="pug">
v-container(fluid).fill-height
    v-row(no-gutters, :class="{'justify-center': $vuetify.display.mobile}")
        .text-h4 Web page designer
    v-divider
    web-page-designer(:pageId="pageId")
</template>

<script setup lang="ts">
import _ from "lodash";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const route = useRoute();
const pageId = parseInt(_.isArray(route.params.id) ? route.params.id[0] : route.params.id) as number;
</script>
