<template lang="pug">
v-col(
    :sm="props.options.size_sm",
    :md="props.options.size_md",
    :lg="props.options.size_lg",
    :xl="props.options.size_xl",
    :xxl="props.options.size_xxl",
)
    template(v-for="block in editorBlock.children")
            web-page-editor-component-block(:editor-block="block")
    web-page-component-selector(v-if="editorStore.show_child_add_buttons", @selected="onComponentSelected($event)")
</template>

<script setup lang="ts">
import type { PlainObject } from "../../../../core/types/basic";
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
