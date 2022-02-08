<template lang="pug">
v-container.flex-column(fluid)
    v-list(v-if="subsections.length > 0")
        v-list-item(v-for="subsection in subsections", :key="subsection.id", :to="subsection.path")
            v-list-item-title {{ subsection.name }}
</template>

<script lang="ts">
import { Section } from "client/modules/section/domains/section";
import { SectionService } from "client/modules/section/services/section-service";
import { ComponentPrototype } from "client/modules/ui/components/prototypes/component-prototype";
import { Component } from "nuxt-property-decorator";

@Component({})
export default class UiPcNavigationSectionMenu extends ComponentPrototype {
    subsections: Section[] = [];
    readonly section_service = new SectionService();

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

<style lang="scss" src="./styles.scss" scoped></style>
