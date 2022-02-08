<template lang="pug">
include ../../../templates/icons.pug
include ../../../templates/buttons.pug

v-navigation-drawer(
    v-if="$store.state.editor && $store.state.editor.section",
    app,
    right,
    absolute,
    v-model="right_panel_open",
    :permanent="!$vuetify.breakpoint.mobile",
    :temporary="$vuetify.breakpoint.mobile"
)
    v-toolbar(dense)
        v-toolbar-title {{ $store.state.editor.section.name }}
        v-spacer
        +icon_btn_transparent("open_external")(:href="$store.state.editor.section.path", target="_blank")
    v-sheet
        v-container(fluid)
            .text-h6 Editor controls
            v-divider
            v-row.my-2.justify-center(no-gutters)
                div
                    AdminSectionEditorHistoryController
            v-switch(
                v-model="editor_borders_on",
                dense,
                hide-details="true",
                :label="`Borders ${editor_borders_on ? 'on' : 'off'}`"
            )
            v-switch(
                v-model="add_button_on", dense, hide-details="true",
                :label="`${add_button_on ? 'Add buttons visible' : 'Add buttons hidden'}`"
            )
            v-divider
            v-row.mt-2.justify-center(no-gutters)
                +btn_save()(@click="$store.dispatch('editor/save')")
                v-btn(color="secondary", nuxt, to="/admin")
                    +icon("back")
                    span Back to admin
</template>

<script lang="ts">
import { ClientStorage } from "client/core/components/storage/client-storage";
import { Component, Vue, Watch } from "nuxt-property-decorator";

@Component({})
export default class LayoutRightEditor extends Vue {
    editor_borders_on: boolean = false;
    add_button_on: boolean = true;
    right_panel_open: boolean = true;

    beforeMount() {
        this.right_panel_open = !this.$vuetify.breakpoint.mobile;
    }

    @Watch("editor_borders_on")
    onChange() {
        ClientStorage.getInstance().getStore().commit("editor/setEditBorder", this.editor_borders_on);
    }

    @Watch("add_button_on")
    onAddButtonOnChanged() {
        ClientStorage.getInstance().getStore().commit("editor/setShowAddButton", this.add_button_on);
    }
}
</script>
