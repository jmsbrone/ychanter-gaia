<template lang="pug">
include ../templates/icons.pug

v-row.justify-center(no-gutters, v-if="$store.state.editor.show_add_button")
    v-btn.secondary.darken-2(@click="openDialog") Add component
        +icon("add")
    v-dialog(v-model="selection_dialog", max-width="800")
        v-tabs(v-model="active_tab")
            v-tab(v-for="(group, $index) in tabs", :key="$index") {{ group.name }}
        v-tabs-items(v-model="active_tab")
            v-tab-item(v-for="(group, $index) in tabs", :key="$index")
                v-container(fluid)
                    v-row
                        v-col(cols="3", v-for="(item, $item_index) in group.items", :key="$item_index")
                            v-hover(v-model="items_hover_tracker[item.name]")
                                v-card(@click="selectItem(item)")
                                    v-card-text.d-flex.justify-center(
                                        :class="{ 'font-weight-bold': items_hover_tracker[item.name] }"
                                    ) {{ item.selector_text }}
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component, Vue } from "nuxt-property-decorator";
import { GalleryConfig } from "client/modules/ui/components/page/content/gallery/config";
import { RawHtmlConfig } from "client/modules/ui/components/page/content/raw-html/config";
import { SlideConfig } from "client/modules/ui/components/page/content/slide/config";
import { TextBlockConfig } from "client/modules/ui/components/page/content/text-block/config";
import { GridColumnConfig } from "client/modules/ui/components/page/grid/column/config";
import { ContainerConfig } from "client/modules/ui/components/page/grid/container/config";
import { GridRowConfig } from "client/modules/ui/components/page/grid/row/config";
import { MenuConfig } from "client/modules/ui/components/page/navigation/menu/config";
import { NavLinkConfig } from "client/modules/ui/components/page/navigation/nav-link/config";
import { SectionMenuConfig } from "client/modules/ui/components/page/navigation/section-menu/config";

@Component({})
export default class ComponentSelector extends Vue {
    selection_dialog: boolean = false;
    active_tab = 0;
    items_hover_tracker = {};

    tabs = [
        {
            name: "Grid",
            items: [ContainerConfig, GridRowConfig, GridColumnConfig],
        },
        {
            name: "UI",
            items: [MenuConfig, NavLinkConfig, SectionMenuConfig],
        },
        {
            name: "Content",
            items: [SlideConfig, RawHtmlConfig, TextBlockConfig, GalleryConfig],
        },
    ];
    selectItem(item: any) {
        this.$emit("selected", item.name);
        this.selection_dialog = false;
    }

    openDialog() {
        this.selection_dialog = true;
    }
}
</script>
