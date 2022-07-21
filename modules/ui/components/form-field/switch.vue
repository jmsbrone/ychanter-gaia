<template lang="pug">
v-switch(:label="name", v-model="value")
</template>

<script setup lang="ts">
/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    name: string;
    modelValue?: string;
    rules?: any[];
}>();
const emit = defineEmits(["update:modelValue"]);

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const value = ref(props.modelValue || "");
watch(value, (newValue) => emit("update:modelValue", newValue));
</script>
