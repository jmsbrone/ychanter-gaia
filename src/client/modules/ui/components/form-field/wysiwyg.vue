<template lang="pug">
html-editor(v-model="model_value")
</template>

<script lang="ts">
import { FormWysiwygFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldWysiwyg extends FormFieldBase<FormWysiwygFieldConfig> {
    init() {
        if (typeof this.model_value !== "string") {
            this.model_value = "";
        }
    }
}
</script>
