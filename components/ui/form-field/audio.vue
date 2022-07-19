<template lang="pug">
v-file-input(
    ref="input",
    v-model="value",
    :label="config.name",
    :placeholder="config.name",
    :hint="config.hint",
    :persistent-hint="true",
    accept="audio/mpeg,audio/mp3",
    :rules="validator.rules",
    :multiple="config.multiple"
)
</template>

<script setup lang="ts">
import { FormValidator } from "../../../core/classes/form-validator";
import type { FormAudioFieldConfig } from "../../../core/types/editor";

const props = defineProps<{
    name: string;
    modelValue?: any;
    config: FormAudioFieldConfig;
}>();
const emit = defineEmits(["update:modelValue"]);

const validator = new FormValidator(props.config);

const value = ref(props.modelValue);
watch(value, (newValue) => {
    emit("update:modelValue", newValue);
});

const input = ref(null);

defineExpose({
    click() {
        input.value.click();
    },
});
</script>
