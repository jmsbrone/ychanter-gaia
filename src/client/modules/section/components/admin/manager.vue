<template lang="pug">
include ../../../ui/templates/icons.pug

v-container(fluid)
    v-card(outlined)
        v-card-title Section Manager
        v-card-text Manage sections here
    v-row
        v-col(cols="12", md="4", lg="3")
            AdminSectionTree(@sectionEditSelected="onSectionEditSelected($event)")
        v-divider(vertical)
        v-col
            AdminSectionEditor(v-if="selected_section", :section="selected_section")
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { SectionService } from "client/modules/section/services/section-service";
import { Section } from "../../domains/section";

@Component({})
export default class SectionManager extends Vue {
    selected_section: Section = null;

    async onSectionEditSelected(section: Section) {
        if (section) {
            try {
                const section_service = new SectionService();
                this.selected_section = await section_service.getById(section.id);
            } catch (error) {
                console.error(error);
            }
        } else {
            this.selected_section = null;
        }
    }
}
</script>
