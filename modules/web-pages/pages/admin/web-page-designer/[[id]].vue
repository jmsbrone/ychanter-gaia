<template lang="pug">
v-container(fluid)
    v-row(no-gutters)
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
