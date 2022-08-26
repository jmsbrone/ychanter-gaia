<template lang="pug">
v-container(fluid)
    v-row(no-gutters).mb-4
        .text-h4 Web pages
        .mx-2
        v-btn(color="primary", @click="addNewPage()")
            v-icon(:icon="$ycIcon('add')")
            | add
    web-page-treeview(:webPages="pages")
    web-page-add-dialog(
        v-model:opened="addPageDialog",
        :parentPage="rootPage",
        @added="onPageAdded($event)"
    )

</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { WebPage } from "../../domains/web-page";
import { WebPageTree } from "../../domains/web-page-tree";
import { WebPageService } from "../../services/web-page-service";

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

const service = new WebPageService();
const rootPage = new WebPage();

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */
const pages: Ref<WebPageTree[]|any> = ref(await service.getListByParent(0));
const addPageDialog = ref(false);

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function addNewPage() {
    addPageDialog.value = true;
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to component events
// that are not caused by the user directly

function onPageAdded(page: WebPage) {
    pages.value.push(page as WebPageTree);
    addPageDialog.value = false;
}
</script>
