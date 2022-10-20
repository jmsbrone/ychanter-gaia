<template lang="pug">
div(v-html="props.options.text")
</template>

<script setup lang="ts">
import type { PlainObject } from "../../../../core/types/basic";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    options?: PlainObject;
}>();
</script>
