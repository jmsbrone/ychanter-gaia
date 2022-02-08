<template lang="pug">
div(
    :is="`${FORM_FIELD_NAME_BASE}${FormFieldTypeNameMap[config.type]}`",
    :config="config",
    v-model="model_value",
    @submit="$emit('submit')"
)
</template>

<script lang="ts">
import { FormFieldBase } from "client/modules/ui/components/form-field/base";
import { FormFieldConfig, FormFieldTypeNameMap, FORM_FIELD_NAME_BASE } from "client/types/editor";
import { Component } from "nuxt-property-decorator";

@Component({})
export default class FormField extends FormFieldBase<FormFieldConfig> {
    FORM_FIELD_NAME_BASE = FORM_FIELD_NAME_BASE;
    FormFieldTypeNameMap = FormFieldTypeNameMap;
}
</script>
