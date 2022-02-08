<template lang="pug">
v-dialog(v-model="dialog_open", max-width="500px")
    v-card(flat)
        v-card-title Adding new section
        v-card-text
            Form(:field_config="form_config", v-model="section", ref="form")
            div Section URL: {{ `${parent.path}${section.alias || ''}` }}
        v-card-actions
            v-spacer
            v-btn(color="primary", @click="confirm()") Save
            v-btn(color="secondary", @click="cancel()") Close
            v-spacer
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";
import { CreateSectionDto } from "common/dto/section/create-section.dto";
import { SectionService } from "client/modules/section/services/section-service";
import { Section } from "../../domains/section";
import { FormConfig, FormStringFieldConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";
import Form from "client/modules/ui/components/form.vue";

@Component({})
export default class AddSectionDialog extends Vue {
    section: Section = new Section();
    @Prop()
    parent: Section;

    @Prop()
    value: any;

    form_config: FormConfig = {
        name: {
            type: FieldType.string,
            name: "Name",
            hint: "New section title",
            required: true,
            maxlength: 60,
        } as FormStringFieldConfig,
        alias: {
            type: FieldType.string,
            name: "Alias",
            maxlength: 60,
            hint: "Can be left empty to autogenerate alias from name",
        } as FormStringFieldConfig,
    };

    dialog_open: boolean = false;

    mounted() {
        this.dialog_open = this.value;
        if (typeof this.parent.path !== "string" || !this.parent.path) {
            this.parent.path = "/";
        }
    }

    async confirm() {
        if ((this.$refs["form"] as any).isValid()) {
            let new_section_dto = new CreateSectionDto();
            new_section_dto.name = this.section.name;
            new_section_dto.alias = this.section.alias;
            new_section_dto.parent = this.parent.id;
            try {
                const section_service = new SectionService();
                let created_section = await section_service.save(new_section_dto);
                this.$emit("created", created_section);
            } catch (error) {
                console.log(error);
            }
        }
    }

    async cancel() {
        this.dialog_open = false;
    }

    @Watch("value")
    onValueChange() {
        this.dialog_open = this.value;
    }

    @Watch("dialog_open")
    onDialogChange() {
        this.$emit("input", this.dialog_open);
        if (this.dialog_open) {
            (this.$refs["form"] as Form)?.reset();
        }
    }
}
</script>

<style lang="scss" scoped>
.input-group-prepend {
    width: 20%;

    .input-group-text {
        width: 100%;
        display: inline-block;
        text-align: right;
    }
}
</style>
