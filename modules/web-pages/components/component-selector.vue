<template lang="pug">
v-row.justify-center(no-gutters)
    v-btn.secondary.darken-2(@click="openDialog()")
        v-icon(:icon="$ycIcon('add')")
        span Add component

v-dialog(v-model="selection_dialog")
    v-sheet.rounded-lg
        v-tabs(v-model="active_tab", background-color="primary")
            v-tab(v-for="(group, $index) in tabs", :key="$index", :value="$index") {{ group.name }}
        v-window(v-model="active_tab")
            v-window-item(v-for="(group, $index) in tabs", :key="$index", :value="$index")
                v-container(fluid)
                    v-row
                        v-col(cols="4", v-for="(item, $item_index) in group.items", :key="$item_index")
                            v-card(@click="selectItem(item)")
                                v-card-text.d-flex.justify-center {{ item.selector_text }}
</template>

<script setup lang="ts">
import _ from "lodash";
import { ComponentGroup } from "../../../core/types/editor";
import { EditorHelper } from "../helpers/editor-helper";

const emit = defineEmits(["selected"]);

const selection_dialog = ref(false);
const active_tab = ref(0);
const components = EditorHelper.getComponentsForSelector();
const tabs = [
    {
        name: "Grid",
        items: _.filter(components, (componentConfig) => componentConfig.group === ComponentGroup.Grid),
    },
    {
        name: "UI",
        items: _.filter(components, (componentConfig) => componentConfig.group === ComponentGroup.UI),
    },
    {
        name: "Content",
        items: _.filter(components, (componentConfig) => componentConfig.group === ComponentGroup.Content),
    },
];

function selectItem(item: any) {
    emit("selected", item.name);
    selection_dialog.value = false;
}

function openDialog() {
    selection_dialog.value = true;
}
</script>
