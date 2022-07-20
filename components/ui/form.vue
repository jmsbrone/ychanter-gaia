<template lang="pug">
v-form(ref="form")
    v-row
        v-col(cols="12", v-for="(config, name) in props.config", :type="config.type", :key="name")
            component(:is="getComponentByType(config.type)", v-model="formData[name]", :config="config")
</template>

<script setup lang="ts">
import { ComponentLoaderHelper } from "../../core/helpers/component-loader";
import type { FormConfig } from "../../core/types/editor";
import { FieldType } from "../../core/types/field-type-enum";
import { FormValidator } from "../../core/classes/form-validator";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    config: FormConfig;
    modelValue: any;
}>();
const emit = defineEmits(["update:modelValue"]);
defineExpose({
    valid,
});

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

function getComponentByType(type: FieldType) {
    const fieldNameBase = "ui:form-field";
    let typeFieldName = "";
    switch (type) {
        case FieldType.string:
            typeFieldName = "string";
            break;
        case FieldType.number:
            typeFieldName = "number";
            break;
        case FieldType.switch:
            typeFieldName = "switch";
            break;
        case FieldType.select:
            typeFieldName = "select";
            break;
    }
    const fieldName = fieldNameBase + "." + typeFieldName;
    return ComponentLoaderHelper.getComponent(fieldName);
}

function getRulesForField(config) {
    const validator = new FormValidator(config);

    return validator.rules;
}

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const form = ref(null);
const formData = reactive(props.modelValue);
watch(formData, (newValue) => {
    emit("update:modelValue", newValue);
});

/**
 * --------------------------------------------------------
 * Exposed methods
 * --------------------------------------------------------
 */

async function valid(): Promise<boolean> {
    return form.value.validate();
}
</script>
