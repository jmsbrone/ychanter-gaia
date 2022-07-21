<template lang="pug">
div.d-block
    v-btn(nuxt, to="/admin/web-pages")
        v-icon(:icon="$ycIcon('back')")
        div back to list
    web-page-edit(:id="getPageId()")
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
});

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */


/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

function getPageId(): number {
    const route = useRoute();
    let id: string;
    if (_.isArray(route.params.id)) {
        id = route.params.id[0];
    } else {
        id = route.params.id;
    }

    return parseInt(id);
}
</script>
