<template lang="pug">
v-container(fluid)
    v-no-ssr
        web-page(v-if="page", :page="page")
</template>

<script setup lang="ts">
import _ from "lodash";
import { DIContainer } from "../../core/port-manager";
import type { WebPagesAPI } from "../../modules/web-pages/api";
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

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

// Functions for usage in template

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

// Defining refs, reactive objects, useState() and watch()

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to user interaction

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to component events
// that are not caused by the user directly

/**
 * --------------------------------------------------------
 * Exposed methods
 * --------------------------------------------------------
 */

// API methods and properties for the component that
// can be accessed from parent component
</script>
