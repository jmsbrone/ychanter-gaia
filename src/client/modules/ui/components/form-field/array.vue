<template lang="pug">
div
    div(v-for="(item, index) in model_value", :key="index")
        FormField(v-model="model_value[index]", :config="getArrayItemConfig()")
        v-btn(@click="removeItem(index)") Remove
    v-btn(@click="addItem()") Add
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { FormArrayFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldArray extends FormFieldBase<FormArrayFieldConfig> {
    init() {
        if (!_.isArray(this.model_value)) {
            this.model_value = [];
        }
    }

    getArrayItemConfig() {
        return this.config.item_config;
    }

    removeItem(index: number) {
        this.model_value.splice(index, 1);
    }

    addItem() {
        this.model_value.push(null);
    }
}
</script>
