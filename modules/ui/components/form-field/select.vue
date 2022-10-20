<template lang="pug">
v-select(:label="config.name", v-model="value", :rules="validator.rules", :items="selectItems")
</template>

<script setup lang="ts">
import _ from "lodash";
import { FormValidator } from "../../../../core/classes/form-validator";
import type { FormSelectFieldConfig } from "../../../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    modelValue?: string;
    config: FormSelectFieldConfig;
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
const selectItems = _.map(props.config.options, (key, value) => {
    return { title: key, value };
});

const value: any = ref(props.modelValue || "");
watch(value, (newValue) => emit("update:modelValue", newValue));
</script>
