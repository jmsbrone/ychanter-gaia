<template lang="pug">
v-autocomplete(
    v-model="model_value",
    ref="input",
    :label="config.name",
    :placeholder="config.placeholder",
    :maxlength="config.maxlength",
    :filled="config.filled",
    :items="config.items",
    :rules="validator.rules",
    :no-filter="!config.filter",
    :return-object="config.object_return",
    :item-text="config.text_prop || 'text'",
    :item-value="config.value_prop || 'value'",
    :search-input.sync="search_input",
    :auto-select-first="true",
    @blur="onFocusLost()",
    @focus="onFocused()",
    @keyup.enter="config.submit_on_enter && $emit('submit')"
)
</template>

<script lang="ts">
import { Component, Prop, Watch } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";
import _ from "client/helpers/lodash";
import { FormAutocompleteFieldConfig } from "client/types/editor";

@Component({})
export default class FormFieldAutocomplete extends FormFieldBase<FormAutocompleteFieldConfig> {
    @Prop()
    searchValue: string;
    search_input: string = "";

    init() {
        this.search_input = this.searchValue;
    }

    @Watch("search_input")
    onSearchValueChangedDebounced = _.debounce(this.onSearchValueChanged.bind(this), 300);
    onSearchValueChanged() {
        this.$emit("update:search-value", this.search_input);
    }
}
</script>
