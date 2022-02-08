<template lang="pug">
include ../../../../templates/component-editable.pug

v-col.flex-wrap(
    :class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }",
    :cols="options.column_size",
    :sm="options.column_size_sm",
    :md="options.column_size_md",
    :lg="options.column_size_lg",
    :xl="options.column_size_xl"
)
    +editable-component-list
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { DraggableComponent } from "client/mixins/draggable-component";
import { Component } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({
    mixins: [DraggableComponent],
})
export default class UiPcGridColumnEditable extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
