<template lang="pug">
v-text-field(
    type="number",
    v-model="model_value",
    :min="config.min",
    :max="config.max",
    :label="config.name",
    :rules="validator.rules",
    :hint="config.hint",
    persistent-hint,
    @keyup.enter="config.submit_on_enter && $emit('submit')"
)
</template>

<script lang="ts">
import { FormNumberFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldNumber extends FormFieldBase<FormNumberFieldConfig> {
    init() {
        if (isNaN(this.model_value)) {
            this.model_value = this.config.default ?? this.config.min ?? 0;
        }
    }

    getModelValue() {
        return parseInt(this.model_value) || 0;
    }
}
</script>
