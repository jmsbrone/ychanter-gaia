<template lang="pug">
v-text-field(
    v-model="model_value",
    type="password",
    :label="config.name",
    :placeholder="config.placeholder",
    :maxlength="config.maxlength",
    :filled="config.filled",
    :rules="validator.rules",
    @keyup.enter="handleEnterKey()"
)
</template>

<script lang="ts">
import { FormPasswordFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldPassword extends FormFieldBase<FormPasswordFieldConfig> {}
</script>
