<template lang="pug">
div(v-if="section")
    v-sheet#page-wrapper.d-flex.flex-column.flex-wrap
        ComponentBlock.section-block.pa-0(v-for="(block_data, index) in blocks", :key="index", :section_data="block_data")
</template>

<script lang="ts">
import { ComponentBlockType } from "client/types/editor";
import { Component, Vue } from "nuxt-property-decorator";
import { SectionService } from "client/modules/section/services/section-service";
import { Section } from "client/modules/section/domains/section";

@Component({})
export default class PublicPage extends Vue {
    section: Section = null;
    blocks: ComponentBlockType[] = [];

    async fetch() {
        try {
            let route = this.$route.path;
            if (route === "/undefined") {
                route = "/";
            }
            const section_service = new SectionService();
            this.section = await section_service.getByPath(route);
            this.$store.commit("settings/setSection", this.section);
            this.blocks = JSON.parse(this.section.content);
        } catch (error) {
            console.error(error);
            this.$nuxt.error({ statusCode: 404, message: "Not found" });
        }
    }

    head() {
        return {
            title: this.section?.name || this.$store.getters["settings/valueof"]("name"),
        };
    }
}
</script>
