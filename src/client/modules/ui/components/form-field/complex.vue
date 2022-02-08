<template lang="pug">
div
    FormField(
        v-for="(sub_config, field_name) in config.sub_fields",
        :key="field_name",
        :config="sub_config",
        v-model="model_value[field_name]"
    )
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { FormComplexFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldComplex extends FormFieldBase<FormComplexFieldConfig> {
    init() {
        if (!_.isObjectLike(this.model_value)) {
            this.model_value = {};
        }
    }
}
</script>
