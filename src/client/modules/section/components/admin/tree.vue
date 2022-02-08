<template lang="pug">
include ../../../ui/templates/icons.pug

div
    v-treeview(
        :items="section_root.children",
        :load-children="fetchSubsections",
        hoverable,
        transition,
        :active.sync="selected_sections",
        item-key="id",
        open-on-click
    )
        template(v-slot:append="{ item }")
            .ml-auto
                +icon_btn("edit")(@click.stop="editSection(item)")
                +icon_btn("add")(@click.stop="setAddingNewSection(item)")
                +icon_btn("delete")(:disabled="item.system", @click.stop="removeSection(item)")

    v-divider
    .d-flex.justify-center
        +icon_btn("add")(@click="setAddingNewSection(section_root)")

    AdminSectionAddSectionDialog(
        v-if="parent_section_for_dialog",
        v-model="open_add_section_dialog",
        @created="onCreated($event)",
        :parent="parent_section_for_dialog"
    )
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component, Vue } from "nuxt-property-decorator";
import { SectionService } from "client/modules/section/services/section-service";
import { TreeSection } from "../../domains/tree-section";

@Component({})
export default class SectionTree extends Vue {
    section_root: TreeSection = new TreeSection();
    selected_sections = [];
    open_add_section_dialog = false;
    parent_section_for_dialog: TreeSection = null;
    section_service = new SectionService();

    async fetch() {
        this.section_root.id = 0;
        this.section_root.children = [];
        let sections = await this.section_service.getListByParent(0);
        _.each(sections, (section) => {
            this.section_root.children.push({
                ...section,
                children: [],
            });
        });
    }

    async fetchSubsections(section: TreeSection) {
        let sub_sections = await this.section_service.getListByParent(section.id);
        _.each(sub_sections, (sub_section) => {
            section.children.push({
                ...sub_section,
                children: [],
            });
        });
    }

    setAddingNewSection(section: TreeSection) {
        this.open_add_section_dialog = true;
        this.parent_section_for_dialog = section;
    }

    onCreated(section: TreeSection) {
        if (!section.children) {
            section.children = [];
        }
        this.parent_section_for_dialog.children.push(section);
        this.open_add_section_dialog = false;
        this.parent_section_for_dialog = null;
        this.editSection(section);
    }

    get selectedSection(): TreeSection | undefined {
        return this.selected_sections[0];
    }

    closeDialog() {
        this.open_add_section_dialog = false;
    }

    editSection(section: TreeSection) {
        this.selected_sections = [section.id];
        this.$emit("sectionEditSelected", section);
    }

    async removeSection(section: TreeSection) {
        try {
            if (await this.section_service.delete({ id: section.id })) {
                if (!this.removeSectionFromTreeById(this.section_root, section.id)) {
                    console.error("Cannot remove section from treeview");
                }
                if (this.selectedSection && this.selectedSection.id === section.id) {
                    this.resetSelected();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    resetSelected() {
        this.$emit("sectionEditSelected", null);
        this.selected_sections = [];
    }

    removeSectionFromTreeById(tree_node: TreeSection, id: number): boolean {
        for (let i = 0; i < tree_node.children.length; ++i) {
            if (tree_node.children[i].id === id) {
                tree_node.children.splice(i, 1);
                return true;
            }
            if (this.removeSectionFromTreeById(tree_node.children[i], id)) {
                return true;
            }
        }
        return false;
    }
}
</script>
