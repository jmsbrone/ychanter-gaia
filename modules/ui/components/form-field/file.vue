<template lang="pug">
v-file-input(
    ref="input",
    v-model="value",
    :label="config.name",
    :placeholder="config.name",
    :hint="config.hint",
    :persistent-hint="true",
    :accept="config.mimetyping ? config.mimetyping.join(',') : '*'",
    :rules="validator.rules",
    :multiple="config.multiple"
)
</template>

<script setup lang="ts">
import { FormValidator } from "../../../../core/classes/form-validator";
import type { FormFileFieldConfig } from "../../../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

defineExpose({
    click() {
        input.value.click();
    },
});
const props = defineProps<{
    modelValue?: any;
    config: FormFileFieldConfig;
}>();
const emit = defineEmits(["update:modelValue"]);

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const validator = new FormValidator(props.config);

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const input = ref(null);
const value = ref(props.modelValue);
watch(value, (newValue) => {
    emit("update:modelValue", newValue);
});
</script>
