<template lang="pug">
v-container
    template(v-if="editorBlock")
        template(v-for="block in editorBlock.children")
            web-page-editor-component-block(:editor-block="block")
        web-page-component-selector(@selected="onComponentSelected($event)")
    template(v-else)
        web-page-component-block(v-for="childConfig in options[CHILDREN_FIELD_NAME]", :options="childConfig.options", :name="childConfig.name")

</template>

<script setup lang="ts">
import type { PlainObject } from "../../../../core/types/basic";
import { CHILDREN_FIELD_NAME } from "../../../../core/types/editor";
import type { EditorTreeNode } from "../../../../core/types/editor";
import { useEditorStore } from "../../store/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    editorBlock?: EditorTreeNode;
    options?: PlainObject;
}>();

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const editorStore = useEditorStore();

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

function onComponentSelected(name: string) {
    editorStore.addBlock({ parent_id: props.editorBlock.id, name });
}
</script>
