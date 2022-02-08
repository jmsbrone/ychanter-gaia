<template lang="pug">
include ../../../templates/icons.pug
include ../../../templates/buttons.pug

v-navigation-drawer(v-if="$store.state.editor && $store.state.editor.section", app, right, absolute, permanent)
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
export default class PageAdminNavBar extends Vue {
    editor_borders_on: boolean = false;

    @Watch("editor_borders_on")
    onChange() {
        ClientStorage.getInstance().getStore().commit("editor/setEditBorder", this.editor_borders_on);
    }
}
</script>
