<template lang="pug">
v-select(
    v-model="model_value",
    :items="items",
    :label="config.name",
    :hint="config.hint",
    persistent-hint,
    :placeholder="config.placeholder"
)
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { FormSelectFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldSelect extends FormFieldBase<FormSelectFieldConfig> {
    items: { text: string; value: any }[] = [];

    async init() {
        this.items = _.toArray(
            _.map(this.config.options, (value, key) => {
                return {
                    text: value,
                    value: parseInt(key),
                };
            })
        );
    }
}
</script>
