<template lang="pug">
include ../../../../templates/component-editable.pug

v-container.flex-wrap(:class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }")
    +editable-component-list
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { DraggableComponent } from "client/mixins/draggable-component";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({
    mixins: [DraggableComponent],
})
export default class UiPcGridContainerEditable extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
