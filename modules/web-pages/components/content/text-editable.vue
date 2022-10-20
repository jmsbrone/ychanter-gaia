<template lang="pug">
.d-flex.flex-column
    div(:class="classRules") {{props.options.text}}
</template>

<script setup lang="ts">
import type { PlainObject } from "../../../../core/types/basic";
import type { EditorTreeNode } from "../../../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    options?: PlainObject;
    editorBlock?: EditorTreeNode;
}>();

const classRules: string[] = reactive([]);

watch(
    () => props.options,
    () => {
        classRules.length = 0;
        if (props.options.size !== "default") {
            classRules.push("text-" + props.options.size);
        }
        if (props.options.style !== "default") {
            classRules.push("font-" + props.options.style);
        }
        classRules.push("text-" + props.options.alignment);
    }
);
</script>
