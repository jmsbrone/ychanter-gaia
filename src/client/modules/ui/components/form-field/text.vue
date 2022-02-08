<template lang="pug">
v-textarea(
    v-model="model_value",
    :label="config.name",
    :placeholder="config.placeholder",
    :filled="config.filled",
    :hint="config.hint",
    persistent-hint
)
</template>

<script lang="ts">
import { FormTextFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldText extends FormFieldBase<FormTextFieldConfig> {}
</script>
