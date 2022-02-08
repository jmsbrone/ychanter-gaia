<template lang="pug">
include ../../templates/component-editable.pug
include ../../templates/icons.pug

div(
    v-if="editor_block.name",
    :is="`${editor_block.name}Editable`",
    :editor_block="editor_block",
    :drop_zones_on="drop_zones_on && $store.state.editor.dragged_block_id !== editor_block.id",
    @mouseover.native.stop="mouse_over = true",
    @mouseleave.native.stop="mouse_over = false"
)
    template(v-slot:controls)
        .component-controls(v-show="mouse_over")
            +icon_btn("edit")(
                v-if="$store.getters['editor/componentHasOptions'](editor_block.name)",
                v-once,
                @click="openOptionsDialog()"
            )
            +icon_btn("delete")(@click="sendRemovalRequest()")

        v-dialog(v-if="editor_block.name", v-model="options_dialog_open", scrollable, max-width="800px", persistent)
            v-card
                v-card-title
                    span Editing
                    v-spacer
                    +icon_btn_transparent("close")(@click="options_dialog_open = false")
                v-card-text
                    Form(
                        v-model="options",
                        :key="options_version",
                        :field_config="$store.getters['editor/componentOptions'](editor_block.name)",
                        ref="options_form"
                    )
                v-card-actions
                    v-spacer
                    v-btn(@click="sendRemovalRequest()", color="error") Delete
                    v-btn(@click="saveOptions()", color="primary") Save
                        v-spacer
v-row.justify-center(v-else, no-gutters)
    ComponentSelector(@selected="onComponentSelected($event)")
</template>

<script lang="ts">
import { ClientStorage } from "client/core/components/storage/client-storage";
import _ from "client/helpers/lodash";
import { Component } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../prototypes/editable-component-prototype";

@Component({})
export default class ComponentBlock extends EditableComponentPrototype {
    mouse_over: boolean = false;

    /** Overriding editable component behaviour */
    beforeMount() {}

    onComponentSelected(name: string) {
        ClientStorage.getInstance().getStore().commit("editor/recreateBlock", {
            id: this.editor_block.id,
            name: name,
        });
        this.$emit("selected");
        this.options_dialog_open = true;
    }

    saveOptions() {
        if (!(this.$refs.options_form as any)?.isValid()) {
            return;
        }
        ClientStorage.getInstance()
            .getStore()
            .commit("editor/updateBlock", {
                id: this.editor_block.id,
                options: _.cloneDeep(this.options),
            });
        this.options_dialog_open = false;
    }

    sendRemovalRequest() {
        ClientStorage.getInstance().getStore().commit("editor/deleteBlock", this.editor_block.id);
    }
}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
