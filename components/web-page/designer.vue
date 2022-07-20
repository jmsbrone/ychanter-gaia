<template lang="pug">
v-progress-circular(v-if="!page", indeterminate)
v-container(v-else, fluid)
    v-row(no-gutters).align-center
        v-btn(@click="savePage()", color="primary")
            v-icon(:icon="$ycIcon('save')")
            span.ml-2 Save
        .mx-1
            v-btn(@click="undo()", color="secondary-lighten-1", :disabled="!editorHistoryStore.previousState")
                v-icon(:icon="$ycIcon('undo')")
            v-tooltip(activator="parent", location="bottom") Revert changes
        div
            v-btn(@click="redo()", color="secondary", :disabled="!editorHistoryStore.nextState")
                v-icon(:icon="$ycIcon('redo')")
            v-tooltip(activator="parent", location="bottom") Re-apply changes
        v-switch.ml-2(color="secondary", v-model="editorStore.edit_border_on", hide-details, label="Borders")
    v-container.mt-4.page-content-container(fluid)
        template(v-for="(componentOptions, index) in editorStore.pageBlocks", :key="index")
            web-page-editor-component-block(:editor-block="componentOptions")
        web-page-component-selector(@selected="onComponentSelected($event)")
</template>

<script setup lang="ts">
import _ from "lodash";
import { DIContainer } from "../../core/port-manager";
import { useEditorStore } from "../../store/editor";
import type { WebPagesAPI } from "../../modules/web-pages/api";
import { useEditorHistoryStore } from "../../store/editor-history";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

const props = defineProps<{
    pageId: number;
}>();

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const service = DIContainer.get<WebPagesAPI>("WebPagesAPI");
const notification = useAppNotification();
const editorStore = useEditorStore();
const editorHistoryStore = useEditorHistoryStore();

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

const page = ref(null);

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

async function savePage() {
    try {
        await editorStore.save();
        notification.showSuccess("Page saved");
    } catch (error) {
        notification.showError(error);
    }
}

function undo() {
    const previousState = editorHistoryStore.previousState;
    if (previousState === null) {
        return;
    }
    editorStore.$patch(previousState);
    editorHistoryStore.currentPointer--;
}

function redo() {
    const nextState = editorHistoryStore.nextState;
    if (nextState === null) {
        return;
    }
    editorStore.$patch(nextState);
    editorHistoryStore.currentPointer++;
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

function onComponentSelected(name: string) {
    editorStore.addBlock({ parent_id: null, name });
}

/**
 * Initialization
 */

service.getById(props.pageId).then(
    (result) => {
        page.value = result;
        try {
            editorStore.setPage(page.value);
        } catch (error) {
            notification.showError(error);
        }
    },
    () => {
        const router = useRouter();
        router.back();
    }
);
</script>

<style lang="scss" scoped>
.page-content-container {
    border: 1px dashed white;
    border-radius: 5px;
}
</style>
