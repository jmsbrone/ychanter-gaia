<template lang="pug">
include ../../../ui/templates/buttons.pug

v-sheet
    v-toolbar(flat)
        v-toolbar-title Edit section
        template(v-slot:extension)
            v-tabs(v-model="tab")
                v-tabs-slider
                v-tab Parameters
    v-tabs-items(v-model="tab")
        v-tab-item
            v-card
                v-card-text
                    FormFieldString(v-model="section.name", :config="{ name: 'Name', placeholder: 'Section name' }")
                    FormFieldString(
                        v-model="section.alias",
                        v-if="!section.system",
                        :config="{ name: 'Alias', placeholder: 'Section alias' }"
                    )
                    FormFieldString(
                        v-model="section.path",
                        v-else,
                        :config="{ name: 'Path', placeholder: 'Full section path' }"
                    )
                    FormFieldSwitch(v-model="section.system", :config="system_field_config")
                    FormFieldSwitch(v-model="section.has_dynamic_routes", :config="dynamic_field_config")
                    FormFieldSwitch(v-model="section.has_indexed_filter", :config="indexed_field_config")
                    FormFieldSection(
                        v-model="section.parent",
                        :key="section.id",
                        :config="{ exclude_ids: excluded_sections, name: 'Parent section' }"
                    )
                v-card-actions
                    +btn_save()(@click="saveSection()")
                    v-btn(color="secondary", nuxt, :to="`/page_editor?id=${section.id}`") Go to edit
                    v-btn(color="secondary", nuxt, :to="`${section.path}`") Page link
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { UpdateSectionDto } from "common/dto/section/update-section.dto";
import { SectionService } from "client/modules/section/services/section-service";
import { Section } from "../../domains/section";
import { FormSwitchFieldConfig } from "client/types/editor";

@Component({})
export default class SectionEditor extends Vue {
    @Prop()
    section: Section;
    tab = null;

    readonly system_field_config = {
        active: "System section",
        inactive: "Normal section",
        hint:
            "Normal sections follow section hierarchy and represent web pages clients interact with." +
            " System sections can live outside of the flow and serve other purposes",
    } as FormSwitchFieldConfig;
    readonly dynamic_field_config = {
        active: "Includes dynamic routes",
        inactive: "Does not include dynamic routes",
        hint:
            "Sections with dynamic routes support will handle requests made to its virtual subsections." +
            " This means that if section serves dynamic content based on URL it must have this setting on to work.",
    } as FormSwitchFieldConfig;
    readonly indexed_field_config = {
        active: "Indexed filter supported",
        inactive: "Indexed filter not supported",
        hint:
            "Sections with indexed filter support will handle requests to them made with additional URL parts that represent the filter." +
            " This means that if section serves components that provide indexed filtering option this setting must be on to work.",
    } as FormSwitchFieldConfig;

    async saveSection() {
        try {
            let section_update_dto = new UpdateSectionDto();
            const section_service = new SectionService();
            _.assign(section_update_dto, this.section);
            await section_service.save(section_update_dto);
            this.$emit("sectionUpdated", this.section);
        } catch (error) {
            console.log(error);
        }
    }

    get excluded_sections() {
        return [this.section.id];
    }
}
</script>

<style lang="scss" scoped>
@use "~assets/styles/themes/index.scss" as theme;

@each $theme in theme.$themes {
    .theme-#{$theme} {
        color: theme.getTextColor($theme);
    }
}
</style>
