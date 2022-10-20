<template lang="pug">
v-row.justify-center(no-gutters).pa-3
    v-btn(@click.stop="openDialog()")
        v-icon(:icon="$ycIcon('add')")

v-dialog(v-model="selection_dialog", fullscreen)
    v-sheet
        .d-flex.flex-row
            .text-h5.my-2.mx-auto Components
            v-btn(:icon="$ycIcon('close')", variant="flat", @click.stop="closeDialog()")
        v-divider
        v-row(no-gutters).justify-center
            v-tabs(v-model="active_tab", color="accent")
                v-spacer
                v-tab(v-for="(group, $index) in tabs", :key="$index", :value="$index") {{ group.name }}
                v-spacer
        v-divider
        v-window(v-model="active_tab")
            v-window-item(
                v-for="(group, $index) in tabs",
                :key="$index",
                :value="$index",
                transition="fade-transition",
                reverse-transition="fade-transition"
            )
                v-container(fluid)
                    v-row(no-gutters).justify-center
                        .text-h6 {{ group.description }}
                    v-divider.my-2
                    v-row(no-gutters)
                        v-col(cols="auto").flex-grow-1
                            v-row(no-gutters)
                                v-col(cols="auto", v-for="(item, $item_index) in group.items", :key="$item_index").ma-1
                                    v-btn(
                                        @click="selectItem(item)",
                                        variant="outlined",
                                        :color="(selectedItem && selectedItem.name === item.name) ? 'primary' : 'default'"
                                    ) {{ item.selector_text }}
                                v-spacer
                        template(v-if="selectedItem")
                            v-divider(vertical)
                            v-col(cols="4").pa-2
                                v-card
                                    v-card-title {{ selectedItem.selector_text }}
                                    v-card-text {{ selectedItem.editor_description }}
                                v-card-actions.justify-center
                                    v-btn(@click="confirmItem()", color="accent", variant="outlined") add
</template>

<script setup lang="ts">
import _ from "lodash";
import { ComponentGroup } from "../../../core/types/editor";
import { EditorHelper } from "../helpers/editor-helper";

const emit = defineEmits(["selected"]);

const selection_dialog = ref(false);
const active_tab = ref(0);
const components = EditorHelper.getComponentsForSelector();
const selectedItem = ref(null);
const tabs = [
    {
        name: "Grid",
        description: "Components to organize the page layout",
        items: _.filter(components, (componentConfig) => componentConfig.group === ComponentGroup.Grid),
    },
    {
        name: "UI",
        description: "Interactive components",
        items: _.filter(components, (componentConfig) => componentConfig.group === ComponentGroup.UI),
    },
    {
        name: "Content",
        description: "Components to display your content",
        items: _.filter(components, (componentConfig) => componentConfig.group === ComponentGroup.Content),
    },
];

watch(active_tab, () => {
    selectedItem.value = null;
});

function selectItem(item: any) {
    selectedItem.value = item;
}

function openDialog() {
    selection_dialog.value = true;
}

function confirmItem() {
    emit("selected", selectedItem.value.name);
    selection_dialog.value = false;
}

function closeDialog() {
    selection_dialog.value = false;
}
</script>
