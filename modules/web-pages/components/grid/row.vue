<template lang="pug">
v-row
    web-page-component-block(v-for="childConfig in props.options[CHILDREN_FIELD_NAME]", :options="childConfig.options", :name="childConfig.name")
</template>

<script setup lang="ts">
import type { PlainObject } from "../../../../core/types/basic";
import { CHILDREN_FIELD_NAME } from "../../../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    options?: PlainObject;
}>();
</script>
