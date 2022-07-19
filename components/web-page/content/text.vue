<template lang="pug">
div {{props.options.text}}
</template>

<script setup lang="ts">
import type { PlainObject } from "../../../core/types/basic";
import type { EditorTreeNode } from "../../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    options?: PlainObject;
    editorBlock?: EditorTreeNode;
}>();
</script>
