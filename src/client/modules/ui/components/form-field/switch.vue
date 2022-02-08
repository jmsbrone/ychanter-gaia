<template lang="pug">
v-switch(v-model="model_value", :label="label", :hint="config.hint", persistentHint)
</template>

<script lang="ts">
import { FormSwitchFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldSwitch extends FormFieldBase<FormSwitchFieldConfig> {
    get label() {
        if (this.config.name) {
            return this.config.name;
        }

        return this.model_value ? this.config.active : this.config.inactive;
    }
}
</script>
