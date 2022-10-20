<template lang="pug">
v-row.controls-container(
    no-gutters,
    v-if="selected",
).justify-center
    v-btn(v-if="hasOptions", @click="editComponentOptions()", :icon="$ycIcon('edit')", variant="plain")
    v-divider(vertical)
    v-btn(@click="deleteComponent()", :icon="$ycIcon('delete')", variant="plain")
component(
    :is="component",
    :class="{'editor_borders_on': editorStore.edit_border_on, 'selected': selected}",
    :options="options",
    :editorBlock="editorBlock",
    @click.stop="selected = !selected"
).component-container

v-dialog(v-if="optionsDialogOpen", :modelValue="true")
    v-container
        v-card.pa-2
            v-card-title Editing options for component {{ editorBlock.name }}
            v-card-text
                ui-form(ref="optionsForm", :config="getFormConfig()", v-model="optionsFormData")
            v-card-actions.justify-center
                v-btn(color="primary", @click="saveOptions()")
                    v-icon(:icon="$ycIcon('save')")
                    | Save
                v-btn(color="secondary", @click="optionsDialogOpen = false")
                    v-icon(:icon="$ycIcon('close')")
                    | Close
</template>

<script setup lang="ts">
import _ from "lodash";
import { ComponentLoaderHelper } from "../../../core/helpers/component-loader";
import type { EditorTreeNode } from "../../../core/types/editor";
import { EditorHelper } from "../../../modules/web-pages/helpers/editor-helper";
import { useEditorStore } from "../store/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    editorBlock: EditorTreeNode;
}>();

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const notification = useAppNotification();
const editorStore = useEditorStore();
const initialOptions = editorStore.blockOptions(props.editorBlock.id);
const hasOptions = EditorHelper.hasOptions(props.editorBlock.name);
const optionsFormData = {};
let component = null;
try {
    component = ComponentLoaderHelper.getComponent(props.editorBlock.name + '-editable');
} catch (error) {
    notification.showError(error);
    console.log(error);
}

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

function getFormConfig() {
    return editorStore.componentOptions(props.editorBlock.name);
}

function editOptions() {
    _.assign(optionsFormData, _.cloneDeep(options.value));
    optionsDialogOpen.value = true;
}

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const options = ref(initialOptions);
const optionsDialogOpen = ref(false);
const selected = ref(false);

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function saveOptions() {
    editorStore.updateBlock({ id: props.editorBlock.id, options: optionsFormData });
    optionsDialogOpen.value = false;
    _.assign(options.value, optionsFormData);
}

function editComponentOptions() {
    editOptions();
}

function deleteComponent() {
    const confirmationDialog = useConfirmationDialog();
    confirmationDialog.confirm("Deleting component", "Are you sure?", () => {
        editorStore.deleteBlock(props.editorBlock.id);
    });
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

onBeforeMount(() => {
    if (!hasOptions) {
        return;
    }
    if (editorStore.last_generated_component_id === props.editorBlock.id) {
        editOptions();
    }
    editorStore.$subscribe((mutation, state) => {
        options.value = editorStore.blockOptions(props.editorBlock.id);
    });
});
</script>

<style lang="scss" scoped>
.controls-container {
    opacity: 0.9;
}

.editor_borders_on {
    border: 2px dashed rgba(var(--v-theme-accent));
    border-radius: 10px;
}

.selected {
    border: 5px solid rgba(var(--v-theme-secondary));
    border-radius: 5px;
}

.component-container {
    &:hover {
        background-color: rgba(var(--v-theme-secondary-darken-2));
        cursor: pointer;
    }
    min-height: 20px;
    min-width: 20px;
}
</style>
