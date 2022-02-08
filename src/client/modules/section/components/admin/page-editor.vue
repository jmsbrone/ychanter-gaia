<template lang="pug">
include ../../../ui/templates/icons.pug
include ../../../ui/templates/component-editable.pug

div(v-if="section")
    v-sheet#page-editor-wrapper.d-flex.flex-column.flex-wrap(
        :class="[{ 'dragging-mode': $store.state.editor.dragging_mode, 'edit-border-enabled': $store.state.editor.edit_border_on }]"
    )
        +drop-zone("$store.state.editor.dragging_mode", "componentBlockDrop($event, null, null)")

        template(v-for="(editor_block, index) in $store.getters['editor/pageBlocks']")
            ComponentBlockEditable.section-block.pa-0(
                draggable,
                @dragstart.native="componentBlockStartDragging($event, editor_block.id)",
                @dragend.native="resetDrag($event, editor_block)",
                :editor_block="editor_block",
                :drop_zones_on="$store.state.editor.dragging_mode",
                :key="editor_block.id"
            )

            +drop-zone("$store.state.editor.dragging_mode", "componentBlockDrop($event, null, editor_block.id)")

        v-container.new-component-block(fluid)
            v-row
                v-col
                v-col(cols="3")
                    ComponentSelector(@selected="newComponentSelected($event)")
                v-col
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component, Vue, Watch } from "nuxt-property-decorator";
import { SectionService } from "client/modules/section/services/section-service";
import { DraggableComponent } from "client/mixins/draggable-component";
import { Section } from "../../domains/section";

@Component({
    mixins: [DraggableComponent],
})
export default class PageEditor extends Vue {
    section: Section = null;
    edit_border_on: boolean = false;

    section_block_insert_handler: Function;

    @Watch("edit_border_on")
    onDisabledChanged() {
        this.$store.commit("editor/setEditBorder", this.edit_border_on);
    }

    async fetch(): Promise<void> {
        let section_id = +this.$nuxt.$route.query.id;
        if (typeof section_id === "undefined") {
            this.$nuxt.error({
                statusCode: 400,
                message: "Section not specified",
            });
        }

        try {
            const section_service = new SectionService();
            this.section = await section_service.getById(section_id, true);
            this.$store.commit("editor/setSection", this.section);
        } catch (error) {
            console.log(error);
            this.$nuxt.error({
                statusCode: 404,
                message: `Section #${section_id} is not found`,
            });
        }
    }

    beforeMount() {
        this.edit_border_on = this.$store.state.editor.edit_border_on;
    }

    /**
     * Adding new section block to the end of the list
     */
    newComponentSelected(new_component_name: string) {
        this.$store.commit("editor/addBlock", {
            name: new_component_name,
            parent_id: null,
        });
    }
}
</script>

<style lang="scss" scoped>
@use "~assets/styles/vendors.scss" as *;
@use "~assets/styles/page_editor/draggable-zones.scss" as *;
</style>
