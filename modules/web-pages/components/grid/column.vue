<template lang="pug">
v-col(
    :sm="props.options.size_sm",
    :md="props.options.size_md",
    :lg="props.options.size_lg",
    :xl="props.options.size_xl",
    :xxl="props.options.size_xxl",
)
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
