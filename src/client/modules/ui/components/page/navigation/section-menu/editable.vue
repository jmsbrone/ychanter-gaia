<template lang="pug">
include ../../../../templates/component-editable.pug

v-container.flex-column(fluid, :class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }")
    slot(name="controls")
    v-list(v-if="subsections.length > 0")
        v-list-item(v-for="subsection in subsections", :key="subsection.id", :to="subsection.path")
            v-list-item-title {{ subsection.name }}
</template>

<script lang="ts">
import { Section } from "client/modules/section/domains/section";
import { SectionService } from "client/modules/section/services/section-service";
import { EditableComponentPrototype } from "client/modules/ui/components/prototypes/editable-component-prototype";
import { Component, Watch } from "nuxt-property-decorator";

@Component({})
export default class UiPcNavigationSectionMenuEditable extends EditableComponentPrototype {
    subsections: Section[] = [];
    readonly section_service = new SectionService();

    @Watch("options.section")
    async onSectionChanged() {
        await this.loadSubSections();
    }

    async loadSubSections() {
        if (this.options.section) {
            this.subsections = await this.section_service.getListByParent(this.options.section);
        }
    }

    async fetch() {
        await this.loadSubSections();
    }
}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
