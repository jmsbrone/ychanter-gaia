<template lang="pug">
input(type="hidden", v-model="model_value", :rules="validator.rules")
</template>

<script lang="ts">
import { FormHiddenFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldHidden extends FormFieldBase<FormHiddenFieldConfig> {}
</script>
