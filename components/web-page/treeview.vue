<template lang="pug">
v-expansion-panels(multiple, v-model="expandedPages", variant="accordion")
    v-expansion-panel(v-for="(page, pageIndex) in pages", :key="page.id")
        v-expansion-panel-title
            v-icon.mr-4(:icon="$ycIcon('web-page')")
            .text-body-1 {{ page.name }}
            v-spacer
            .d-flex.flex-row.bg-secondary.pa-2.rounded-lg.mr-2
                div
                    v-btn(
                        nuxt,
                        :to='page.path',
                        @click.stop,
                        variant="plain",
                        :icon="$ycIcon('open_web_page')"
                    )
                    v-tooltip(activator="parent", location="bottom") Open
                v-divider(vertical, thickness="4")
                div
                    v-btn(
                        v-if="!page.system",
                        :icon="$ycIcon('add')",
                        @click.stop="addChildPage(page)",
                        variant="plain",
                    )
                    v-tooltip(activator="parent", location="bottom") Add page
                div
                    v-btn(
                        :icon="$ycIcon('edit')",
                        nuxt,
                        :to="`/admin/web-page/${page.id}`",
                        @click.stop,
                        variant="plain",
                    )
                    v-tooltip(activator="parent", location="bottom") Edit
                div
                    v-btn(
                        :icon="$ycIcon('web-page-designer')",
                        nuxt,
                        :to="`/admin/web-page-designer/${page.id}`",
                        @click.stop,
                        variant="plain",
                    )
                    v-tooltip(activator="parent", location="bottom") Page designer
                div
                    v-btn(
                        v-if="!page.system"
                        :icon="$ycIcon('delete')",
                        @click.stop="deletePage(page)",
                        variant="plain",
                    )
                    v-tooltip(activator="parent", location="bottom") Delete
        v-expansion-panel-text.ml-4.mr-0
            web-page-treeview(
                v-if="isPageOpen(pageIndex) && page.children?.length > 0",
                :webPages="page.children",
            )
            .text-body-1(v-else) No child pages

web-page-add-dialog(
    v-model:opened="dialogState.addDialog",
    :parentPage="dialogState.activePage",
    @added="onPageAdded($event)"
)
</template>

<script setup lang="ts">
import { DIContainer } from "../../core/port-manager";
import _ from "lodash";
import type { WebPagesAPI } from "../../modules/web-pages/api";
import { WebPage } from "../../modules/web-pages/domains/web-page";
import { WebPageTree } from "../../modules/web-pages/domains/web-page-tree";
/**
 * --------------------------------------------------------
 * Component setup
 * --------------------------------------------------------
 */
const props = defineProps<{
    webPages: Array<WebPageTree>;
}>();

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const pageService = DIContainer.get<WebPagesAPI>("WebPagesAPI");

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */
const pages = ref(props.webPages);
const dialogState = reactive({
    addDialog: false,
    activePage: null,
});
const expandedPages = ref([]);
watch(expandedPages, onExpandedPagesChange);

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */
function addChildPage(page) {
    dialogState.addDialog = true;
    dialogState.activePage = page;
}

async function deletePage(page: WebPage) {
    const confirmationDialog = useConfirmationDialog();
    confirmationDialog.confirm(
        `Deleting page: ` + page.name,
        "Are you sure you want to delete this page? This action cannot be undone.",
        () => onDeleteConfirm
    );
}

async function onPageAdded(page: WebPage) {
    await loadPageChildren(dialogState.activePage);
    dialogState.activePage.children.push(page);
}

async function loadPageChildren(page: WebPageTree) {
    if (typeof page.children === "undefined") {
        page.children = (await pageService.getListByParent(page.id)) as WebPageTree[];
    }
}
function isPageOpen(pageIndex: number) {
    return _.includes(expandedPages.value, pageIndex);
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */
async function onDeleteConfirm() {
    await pageService.delete({ id: dialogState.activePage.id });
    pages.value = _.remove(pages.value, (page) => page.id !== dialogState.activePage.id);
    dialogState.activePage = null;
}

async function onExpandedPagesChange(value, oldValue) {
    const newPageIndexes: number[] = _.difference(value, oldValue);
    await Promise.all(_.map(newPageIndexes, (pageIndex) => loadPageChildren(pages.value[pageIndex] as WebPageTree)));
}
</script>
