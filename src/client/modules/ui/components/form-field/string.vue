<template lang="pug">
v-text-field(
    v-model="model_value",
    :label="config.name",
    :hint="config.hint",
    persistent-hint,
    :placeholder="config.placeholder",
    :maxlength="config.maxlength",
    :filled="config.filled",
    :rules="validator.rules",
    @keyup.enter="config.submit_on_enter && $emit('submit')"
)
</template>

<script lang="ts">
import { FormStringFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldString extends FormFieldBase<FormStringFieldConfig> {}
</script>
