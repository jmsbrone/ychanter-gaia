<template lang="pug">
div
    span {{ config.name }}
    v-color-picker(:value="model_value", :label="config.name", @update:color="onColorChanged($event)")
</template>

<script lang="ts">
import { FormColorFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormColorField extends FormFieldBase<FormColorFieldConfig> {
    onColorChanged(color: any) {
        this.setModelValue(color.hex);
    }
}
</script>
