<template lang="pug">
v-container(fluid)
    v-no-ssr
        web-page(v-if="page", :page="page")
</template>

<script setup lang="ts">
import _ from "lodash";
import { DIContainer } from "../../../../core/port-manager";
import type { WebPagesAPI } from "../../api";
/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

definePageMeta({
    layout: false,
});

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */
let page = null;
if (!process.server) {
    const service = DIContainer.get<WebPagesAPI>("WebPagesAPI");
    const route = useRoute();
    const pathParts = [];
    if (_.isArray(route.params.path)) {
        pathParts.push(...route.params.path);
    } else {
        pathParts.push(route.params.path);
    }
    if (_.isArray(route.params.slug)) {
        pathParts.push(...route.params.slug);
    } else if (route.params.slug) {
        pathParts.push(route.params.slug);
    }
    let pagePath = "/" + pathParts.join("/") + "/";
    if (pagePath == "//") {
        pagePath = "/";
    }
    page = ref(await service.getByPath(pagePath));
}
</script>
