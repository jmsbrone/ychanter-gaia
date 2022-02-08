<template lang="pug">
v-select(
    v-model="model_value",
    :items="items",
    item-value="id",
    item-text="name",
    placeholder="Section",
    :label="config.name"
)
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Section } from "client/modules/section/domains/section";
import { SectionService } from "client/modules/section/services/section-service";
import { FormSectionFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";

@Component({})
export default class FormFieldSection extends FormFieldBase<FormSectionFieldConfig> {
    items = [];

    async fetch() {
        const section_service = new SectionService();
        this.items = await section_service.getAll();
        const items: Section[] = [
            {
                id: null,
                name: "---",
            } as Section,
        ];
        const root_sections = this.collectTreeChildren(this.items, null);
        _.each(root_sections, (root_section) => {
            items.push(...this.flattenTreeNote(root_section));
        });
        this.items = items;
    }

    /**
     * Returns an array of tree children for given tree note id.
     * Function is called recursively so that returned tree notes will
     * also include their children.
     * @param list
     * @param note_id
     */
    collectTreeChildren(list: Section[], note_id: number | null): Section[] {
        const result = [];
        _.each(list, (item) => {
            if (item.parent === note_id) {
                (item as any).children = this.collectTreeChildren(list, item.id);
                result.push(item);
            }
        });
        return result;
    }

    /**
     * Returns a list of all tree notes and leaves for given root note
     * @param note
     */
    flattenTreeNote(note: Section): Section[] {
        const result = [];
        if (!this.config.exclude_ids || !_.includes(this.config.exclude_ids, note.id)) {
            result.push(note);
            _.each((note as any).children, (child) => {
                result.push(...this.flattenTreeNote(child));
            });
        }
        return result;
    }
}
</script>
