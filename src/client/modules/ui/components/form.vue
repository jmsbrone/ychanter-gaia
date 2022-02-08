<template lang="pug">
v-container(fluid)
    v-form(ref="form")
        FormField(
            v-for="(config, name) in field_config",
            :key="name",
            v-model="local_values[name]",
            :config="config",
            @submit="$emit('submit')"
        )
</template>

<script lang="ts">
import { FormConfig } from "client/types/editor";
import _ from "client/helpers/lodash";
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";

@Component({})
export default class Form extends Vue {
    @Prop()
    field_config: FormConfig;

    @Prop()
    value: Object;

    local_values: any = {};

    beforeMount() {
        this.updateLocalValues();
    }

    @Watch("local_values", { deep: true })
    onFieldChange() {
        this.$emit("input", this.local_values);
    }

    updateLocalValues() {
        this.local_values = _.cloneDeep(this.value);
    }

    isValid(): boolean {
        const form = this.$refs["form"] as any;
        const valid = form.validate();

        return valid;
    }

    reset(): void {
        (this.$refs["form"] as any).reset();
    }
}
</script>
