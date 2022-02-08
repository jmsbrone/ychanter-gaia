<template lang="pug">
include ../../../../templates/component-editable.pug

v-row(:class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }", no-gutters)
    +editable-component-list
</template>

<script lang="ts">
import { ClientStorage } from "client/core/components/storage/client-storage";
import _ from "client/helpers/lodash";
import { DraggableComponent } from "client/mixins/draggable-component";
import { Component, Watch } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({
    mixins: [DraggableComponent],
})
export default class UiPcGridRowEditable extends EditableComponentPrototype {
    @Watch("options.column_count")
    onColumnCountChanged() {
        ClientStorage.getInstance().getStore().commit("editor/setBlockChildCount", {
            id: this.editor_block.id,
            count: this.options.column_count,
        });
    }
}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
