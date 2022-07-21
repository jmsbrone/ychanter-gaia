<template lang="pug">
v-text-field(type="number", :label="config.name", v-model="value", :rules="validator.rules")
</template>

<script setup lang="ts">
import { FormValidator } from "../../../../core/classes/form-validator";
import type { FormNumberFieldConfig } from "../../../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    modelValue?: string;
    config: FormNumberFieldConfig;
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

const value = ref(props.modelValue || "");
watch(value, (newValue) => emit("update:modelValue", newValue));
</script>
