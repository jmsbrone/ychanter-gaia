<template lang="pug">
div.component-container(:class="{'editor_borders_on': editorStore.edit_border_on}")
    component(:is="component", :options="options", :editorBlock="editorBlock")
    .controls-container.d-flex.align-center.justify-center
        v-btn(v-if="hasOptions", @click="editComponentOptions()")
            v-icon(:icon="$ycIcon('edit')")
        v-btn(@click="deleteComponent()")
            v-icon(:icon="$ycIcon('delete')")

v-dialog(v-if="optionsDialogOpen", :modelValue="true")
    v-container
        v-card
            v-card-title Editing options for component {{ editorBlock.name }}
            v-card-text
                ui-form(ref="optionsForm", :config="getFormConfig()", v-model="optionsFormData")
            v-card-actions
                v-btn(color="primary", @click="saveOptions()") Save
                v-btn(color="secondary", @click="optionsDialogOpen = false") Close
</template>

<script setup lang="ts">
import _ from "lodash";
import { ComponentLoaderHelper } from "../../core/helpers/component-loader";
import type { EditorTreeNode } from "../../core/types/editor";
import { EditorHelper } from "../../modules/web-pages/helpers/editor-helper";
import { useEditorStore } from "../../store/editor";

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
    component = ComponentLoaderHelper.getComponent(props.editorBlock.name);
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

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function saveOptions() {
    editorStore.updateBlock({ id: props.editorBlock.id, options: optionsFormData });
    optionsDialogOpen.value = false;
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
    if (hasOptions) {
        return;
    }
    if (editorStore.last_generated_component_id === props.editorBlock.id) {
        editOptions();
    }
    editorStore.$subscribe(() => {
        options.value = editorStore.blockOptions(props.editorBlock.id);
    });
});
</script>

<style lang="scss" scoped>
.controls-container {
    position: absolute;
    z-index: 900;
    right: 0px;
    top: 0px;
    width: auto;
    opacity: 0.9;
    border-radius: 10px;
    display: block;
}

.component-container {
    position: relative;
}

.editor_borders_on {
    border: 1px dashed white;
    border-radius: 10px;
}
</style>
